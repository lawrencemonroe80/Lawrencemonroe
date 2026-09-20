import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHmac, timingSafeEqual } from 'crypto';
import { clearCatalogCache } from '../lib/square';

/**
 * POST /api/square/webhook
 * ------------------------
 * Square webhook receiver (Square Dashboard → Developer → Webhooks
 * → subscribe to `inventory.count.updated`, `payment.updated`,
 * `order.created`). Verifies the HMAC-SHA256 signature Square attaches
 * to every event, then invalidates the catalog cache so stock changes
 * made in the Square Dashboard (or Point of Sale) reflect on the
 * storefront within one cache TTL.
 *
 * Environment:
 *   SQUARE_WEBHOOK_SIGNATURE_KEY  Square Dashboard → Developer →
 *                                 Webhooks → Signature key
 *   SITE_URL                      canonical URL the webhook is
 *                                 registered at
 */

const verifySignature = (signature: string, body: string): boolean => {
  const key = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
  if (!key) return false;

  const siteUrl = process.env.SITE_URL || 'https://lawrencemonroe.com';
  const payload = `${siteUrl}/api/square/webhook${body}`;

  const hmac = createHmac('sha256', key).update(payload).digest('base64');

  const a = Buffer.from(hmac);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const signature = req.headers['x-square-hmacsha256-signature'] as string | undefined;
  const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});

  const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
  if (signatureKey) {
    if (!signature || !verifySignature(signature, rawBody)) {
      return res.status(403).json({ error: 'Invalid webhook signature' });
    }
  }

  try {
    const { type } = req.body || {};

    switch (type) {
      case 'inventory.count.updated':
      case 'catalog.version.updated':
        // Stock / catalog changed in the Square Dashboard — drop caches
        clearCatalogCache();
        break;
      case 'payment.updated':
      case 'order.created':
      case 'order.updated':
        // Order events land in the Square Orders dashboard natively via
        // the checkout flow; clear the catalog too (stock decrements).
        clearCatalogCache();
        break;
      default:
        break;
    }

    return res.status(200).json({ received: true, type: type ?? null });
  } catch (error: any) {
    return res.status(400).json({ error: error?.message || 'Invalid webhook payload.' });
  }
}
