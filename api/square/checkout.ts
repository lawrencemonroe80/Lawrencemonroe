import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  AuthoritativeItem,
  buildAuthoritativeCatalog,
  createSquareOrder,
  createSquarePayment,
  getSquareLocationId,
  squareConfigured,
} from '../lib/square';

/**
 * POST /api/square/checkout
 * -------------------------
 * Server-authoritative checkout (Square Web Payments SDK partner):
 *
 *   1. Token arrives from the client's `payments.tokenize()` — the raw
 *      card data never touches our servers (PCI SAQ-A scope).
 *   2. Cart is validated against the live Square catalog — prices and
 *      stock are pulled from Square, never trusted from the client.
 *   3. A Square ORDER is created (/v2/orders) with catalog-backed line
 *      items → appears instantly in the owner's Square Orders dashboard.
 *   4. The token is charged against that order (/v2/payments) so payment
 *      and fulfillment stay linked.
 *
 * Without Square credentials (local dev / preview), the endpoint
 * simulates a completed sandbox transaction so the full UX is testable.
 */

// Keyed by storefront product ids used by the bundled (non-Square) catalog
const LOCAL_FALLBACK_CATALOG: Record<string, { name: string; priceCents: number; maxStock: number }> = {
  'lm-shorts-001': { name: 'LM SHORTS 001', priceCents: 16500, maxStock: 14 },
  'lm-shorts-002': { name: 'LM SHORTS 002', priceCents: 16500, maxStock: 9 },
};

const VALID_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

interface IncomingLine {
  productId: string;
  size: string;
  quantity: number;
  color?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { sourceId, customer, items, idempotencyKey } = req.body || {};

    if (!sourceId || !customer || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ error: 'Invalid payment request payload. Missing sourceId, customer, or items.' });
    }

    // ---- 1. Authoritative catalog (live Square, else local) ----
    const catalog = squareConfigured() ? await buildAuthoritativeCatalog() : null;
    const liveItems: AuthoritativeItem[] = catalog?.items ?? [];

    const findLiveItem = (productId: string): AuthoritativeItem | undefined =>
      liveItems.find(
        (i) =>
          i.squareItemId === productId ||
          i.name.replace(/\s+/g, '').toUpperCase() === productId.replace(/\s+/g, '').toUpperCase()
      );

    // ---- 2. Validate every line + compute server-side totals ----
    let totalCents = 0;
    const validatedItems: any[] = [];
    const orderLines: { variationId: string; quantity: number }[] = [];

    for (const item of items as IncomingLine[]) {
      const qty = Math.max(1, parseInt(String(item.quantity), 10) || 1);
      const size = String(item.size || 'M').toUpperCase();
      const live = findLiveItem(item.productId);

      if (live) {
        // LIVE SQUARE PATH — price + stock come from Square
        const variation =
          live.variations.find((v) => v.name.toUpperCase().startsWith(size)) ||
          live.variations.find((v) => v.name.toUpperCase() === size);

        if (!variation) {
          return res.status(400).json({ error: `${live.name} is not offered in size ${size}.` });
        }
        if (!variation.available || variation.stock < qty) {
          return res
            .status(400)
            .json({ error: `${live.name} (${size}) has insufficient inventory remaining.` });
        }

        totalCents += variation.priceCents * qty;
        orderLines.push({ variationId: variation.variationId, quantity: qty });
        validatedItems.push({
          productId: item.productId,
          squareItemId: live.squareItemId,
          name: live.name,
          color: item.color,
          size,
          quantity: qty,
          unitPriceCents: variation.priceCents,
          lineTotalCents: variation.priceCents * qty,
        });
      } else {
        // LOCAL FALLBACK PATH (no Square credentials configured)
        const spec = LOCAL_FALLBACK_CATALOG[item.productId];
        if (!spec) {
          return res
            .status(400)
            .json({ error: `Unreleased or unrecognized product identifier: ${item.productId}.` });
        }
        if (!VALID_SIZES.includes(size)) {
          return res.status(400).json({ error: `Invalid size selected: ${size}.` });
        }
        if (qty > spec.maxStock) {
          return res
            .status(400)
            .json({ error: `Requested quantity exceeds available allocation for ${spec.name}.` });
        }
        totalCents += spec.priceCents * qty;
        validatedItems.push({
          productId: item.productId,
          name: spec.name,
          color: item.color,
          size,
          quantity: qty,
          unitPriceCents: spec.priceCents,
          lineTotalCents: spec.priceCents * qty,
        });
      }
    }

    const shippingCents = customer.shippingOption === 'express' ? 2500 : 0;
    // Live orders use Square tax templates at the location level
    const taxCents = liveItems.length > 0 ? 0 : Math.round(totalCents * 0.0825);
    const finalAmountCents = totalCents + shippingCents + taxCents;

    const orderId = `LM-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const note = `LAWRENCE MONROE - Order ${orderId}`;

    // ---- 3. Square: order first, then payment linked to it ----
    if (squareConfigured()) {
      const locationId = getSquareLocationId()!;

      const order = await createSquareOrder({
        locationId,
        lines: orderLines,
        shippingCents,
        orderId,
        buyerEmail: customer.email,
      });

      const chargeCents = order?.totalCents || finalAmountCents;

      const payment = await createSquarePayment({
        locationId,
        sourceId,
        amountCents: chargeCents,
        orderId: order?.orderId,
        buyerEmail: customer.email,
        note,
        idempotencyKey:
          idempotencyKey ||
          (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `lm-${Date.now()}`),
      });

      return res.status(200).json({
        orderId,
        squareOrderId: order?.orderId,
        paymentId: payment?.payment?.id,
        status: payment?.payment?.status === 'COMPLETED' ? 'COMPLETED' : 'PENDING',
        totalAmount: chargeCents / 100,
        currency: 'USD',
        items: validatedItems,
        customer,
        createdAt: new Date().toISOString(),
      });
    }

    // ---- Sandbox simulation (development without credentials) ----
    return res.status(200).json({
      orderId,
      paymentId: `sq_sandbox_${Math.random().toString(36).substring(2, 12)}`,
      status: 'COMPLETED',
      totalAmount: finalAmountCents / 100,
      currency: 'USD',
      items: validatedItems,
      customer,
      createdAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error?.message || 'Internal server error while processing payment transaction.' });
  }
}
