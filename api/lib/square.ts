/**
 * SQUARE SERVER LIBRARY — shared by all Vercel serverless functions.
 * ----------------------------------------------------------------
 * Single place where the Square REST API is touched:
 *
 *   - Catalog:   GET  /v2/catalog/list            (paginated, type ITEM)
 *   - Images:    GET  /v2/catalog/object/:id      (IMAGE objects → CDN url)
 *   - Inventory: POST /v2/inventory/counts/batch-retrieve
 *   - Orders:    POST /v2/orders                  (checkout flow)
 *   - Payments:  POST /v2/payments                (Web Payments SDK charge)
 *
 * Environment variables (set in Vercel → Project → Settings → Environment
 * Variables — never committed to the repo):
 *
 *   SQUARE_ACCESS_TOKEN  Square Dashboard → Developer → Credentials
 *   SQUARE_LOCATION_ID   Square Dashboard → Locations → Location ID
 *   SQUARE_ENVIRONMENT   'sandbox' | 'production'
 *
 * The catalog is normalized into an "authoritative" shape consumed by
 * `/api/square/catalog` (storefront feed) and `/api/square/checkout`
 * (server-authoritative pricing). The client never sets prices.
 */

const SQUARE_VERSION = '2023-10-18';
const CACHE_TTL_MS = 60_000; // 60s — protects Square rate limits on traffic spikes

export interface AuthoritativeVariation {
  variationId: string; // Square catalog object id of the ITEM_VARIATION
  name: string; // e.g. "S", "M", "XL"
  sku?: string;
  priceCents: number;
  available: boolean;
  stock: number;
}

export interface AuthoritativeItem {
  squareItemId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  available: boolean;
  maxStock: number;
  minPriceCents: number;
  variations: AuthoritativeVariation[];
}

export interface AuthoritativeCatalog {
  items: AuthoritativeItem[];
  generatedAt: string;
}

/* ---------------- low-level fetch helper ---------------- */

const squareBaseUrl = (): string =>
  (process.env.SQUARE_ENVIRONMENT || 'sandbox') === 'production'
    ? 'https://connect.squareup.com'
    : 'https://connect.squareupsandbox.com';

const squareFetch = async (path: string, init: RequestInit = {}): Promise<any> => {
  const token = process.env.SQUARE_ACCESS_TOKEN;
  if (!token) throw new Error('SQUARE_ACCESS_TOKEN not configured');

  const res = await fetch(`${squareBaseUrl()}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'Square-Version': SQUARE_VERSION,
      ...(init.headers || {}),
    },
  });

  const data = await res.json();
  if (!res.ok) {
    const detail = data?.errors?.[0]?.detail || `Square ${path} failed (${res.status})`;
    throw new Error(detail);
  }
  return data;
};

/* ---------------- catalog + inventory ---------------- */

/** Paginate /v2/catalog/list for ITEM objects (products, not variations/modifiers). */
const listCatalogItems = async (): Promise<any[]> => {
  const items: any[] = [];
  let cursor: string | undefined;

  do {
    const qs = new URLSearchParams({ types: 'ITEM' });
    if (cursor) qs.set('cursor', cursor);
    const page = await squareFetch(`/v2/catalog/list?${qs.toString()}`);
    items.push(...(page.objects || []));
    cursor = page.cursor;
  } while (cursor);

  return items;
};

/** IN_STOCK counts keyed by catalog object id (variation-level). */
const fetchInventoryCounts = async (variationIds: string[]): Promise<Record<string, number>> => {
  if (variationIds.length === 0) return {};

  const counts: Record<string, number> = {};
  // Batch endpoint accepts up to 100 ids per call.
  for (let i = 0; i < variationIds.length; i += 100) {
    const batch = variationIds.slice(i, i + 100);
    const data = await squareFetch('/v2/inventory/counts/batch-retrieve', {
      method: 'POST',
      body: JSON.stringify({ catalog_object_ids: batch, states: 'IN_STOCK' }),
    });
    for (const entry of data.counts || []) {
      counts[entry.catalog_object_id] =
        (counts[entry.catalog_object_id] || 0) + Number(entry.quantity || 0);
    }
  }
  return counts;
};

/** Resolve Square catalog IMAGE objects to their public CDN URLs. */
const resolveImageUrls = async (imageIds: string[]): Promise<Record<string, string>> => {
  const urls: Record<string, string> = {};
  await Promise.all(
    imageIds.map(async (id) => {
      try {
        const data = await squareFetch(`/v2/catalog/object/${id}`);
        const url = data?.object?.image_data?.url;
        if (url) urls[id] = url;
      } catch {
        /* non-fatal — card falls back to bundled campaign imagery */
      }
    })
  );
  return urls;
};

/* ---------------- normalization + cache ---------------- */

let cache: { at: number; payload: AuthoritativeCatalog } | null = null;

/**
 * On-demand cache invalidation — called by `/api/revalidate` when a
 * Sanity webhook fires (and by `/api/square/webhook` on Square inventory
 * events). Note: serverless instances are ephemeral, so this clears the
 * instance-local cache; the 60s TTL covers the rest. For a hard global
 * purge, trigger a redeploy (`vercel deploy` or the Vercel API).
 */
export const clearCatalogCache = (): void => {
  cache = null;
};

/** Normalize a Square ITEM (with variations) + inventory into the storefront shape. */
const normalizeItem = (
  item: any,
  inventory: Record<string, number>,
  images: Record<string, string>
): AuthoritativeItem | null => {
  const itemData = item?.item_data;
  if (!itemData) return null;

  // Skip items that are not enabled for point of sale / online
  if (itemData.product_type && itemData.product_type !== 'REGULAR') return null;

  const variations: AuthoritativeVariation[] = (itemData.variations || [])
    .map((v: any) => {
      const vd = v.item_variation_data || {};
      const price = vd.price_money?.amount ?? 0;
      const stock = inventory[v.id] ?? 0;
      const sellable = vd.sellable !== false && vd.available !== false;
      return {
        variationId: v.id,
        name: vd.name || 'ONE SIZE',
        sku: vd.sku,
        priceCents: Number(price),
        available: sellable && stock > 0,
        stock,
      };
    })
    .filter((v: AuthoritativeVariation) => v.priceCents > 0);

  if (variations.length === 0) return null;

  const totalStock = variations.reduce((sum: number, v) => sum + v.stock, 0);
  const imageId = itemData.image_ids?.[0];

  return {
    squareItemId: item.id,
    name: itemData.name || 'UNNAMED ITEM',
    description: itemData.description,
    imageUrl: imageId ? images[imageId] : undefined,
    available: totalStock > 0,
    maxStock: totalStock,
    minPriceCents: Math.min(...variations.map((v) => v.priceCents)),
    variations,
  };
};

/**
 * The authoritative catalog — live from Square when credentials exist,
 * `null` otherwise (callers fall back to the bundled Release 001 catalog).
 * Cached per serverless instance for CACHE_TTL_MS.
 */
export const buildAuthoritativeCatalog = async (): Promise<AuthoritativeCatalog | null> => {
  if (!process.env.SQUARE_ACCESS_TOKEN || !process.env.SQUARE_LOCATION_ID) return null;
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.payload;

  const rawItems = await listCatalogItems();
  const variationIds = rawItems.flatMap((item) =>
    (item?.item_data?.variations || []).map((v: any) => v.id)
  );
  const imageIds = rawItems.flatMap((item) => item?.item_data?.image_ids || []);
  const [inventory, images] = await Promise.all([
    fetchInventoryCounts(variationIds),
    resolveImageUrls(imageIds),
  ]);

  const items = rawItems
    .map((item) => normalizeItem(item, inventory, images))
    .filter((i): i is AuthoritativeItem => i !== null);

  const payload: AuthoritativeCatalog = { items, generatedAt: new Date().toISOString() };
  cache = { at: Date.now(), payload };
  return payload;
};

/* ---------------- orders (checkout flow) ---------------- */

export interface OrderLine {
  variationId: string;
  quantity: number;
}

/**
 * POST /v2/orders — creates a real order in the owner's Square Orders
 * dashboard with catalog-backed line items (pricing pulled live from
 * Square, never from the client). Returns the order id + total.
 */
export const createSquareOrder = async (opts: {
  locationId: string;
  lines: OrderLine[];
  shippingCents?: number;
  orderId: string;
  buyerEmail?: string;
}): Promise<{ orderId: string; totalCents: number } | null> => {
  if (!process.env.SQUARE_ACCESS_TOKEN) return null;

  const line_items: any[] = opts.lines.map((line) => ({
    catalog_object_id: line.variationId,
    quantity: String(line.quantity),
  }));

  if (opts.shippingCents && opts.shippingCents > 0) {
    line_items.push({
      name: 'PRIORITY COURIER SHIPPING',
      quantity: '1',
      base_price_money: { amount: opts.shippingCents, currency: 'USD' },
    });
  }

  const data = await squareFetch('/v2/orders', {
    method: 'POST',
    body: JSON.stringify({
      idempotency_key: `order-${opts.orderId}`,
      order: {
        location_id: opts.locationId,
        line_items,
        metadata: {
          website_order_id: opts.orderId,
          channel: 'lawrencemonroe.com',
        },
        ...(opts.buyerEmail ? { email_address: opts.buyerEmail } : {}),
      },
    }),
  });

  const order = data?.order;
  return {
    orderId: order?.id,
    totalCents: Number(order?.total_money?.amount ?? 0),
  };
};

/**
 * POST /v2/payments — charges the tokenized source (Web Payments SDK)
 * against the created order so payment + fulfillment are linked in the
 * Square Dashboard.
 */
export const createSquarePayment = async (opts: {
  locationId: string;
  sourceId: string;
  amountCents: number;
  orderId?: string;
  buyerEmail?: string;
  note: string;
  idempotencyKey: string;
}): Promise<any> => {
  return squareFetch('/v2/payments', {
    method: 'POST',
    body: JSON.stringify({
      source_id: opts.sourceId,
      idempotency_key: opts.idempotencyKey,
      amount_money: { amount: opts.amountCents, currency: 'USD' },
      location_id: opts.locationId,
      ...(opts.orderId ? { order_id: opts.orderId } : {}),
      ...(opts.buyerEmail ? { buyer_email_address: opts.buyerEmail } : {}),
      note: opts.note,
    }),
  });
};

export const squareConfigured = (): boolean =>
  Boolean(process.env.SQUARE_ACCESS_TOKEN && process.env.SQUARE_LOCATION_ID);

export const getSquareLocationId = (): string | undefined =>
  process.env.SQUARE_LOCATION_ID || undefined;
