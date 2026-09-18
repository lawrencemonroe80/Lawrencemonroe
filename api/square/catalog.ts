import type { VercelRequest, VercelResponse } from '@vercel/node';
import { buildAuthoritativeCatalog, squareConfigured } from '../lib/square';

/**
 * GET /api/square/catalog
 * -----------------------
 * Public storefront catalog feed. When Square credentials are configured
 * the response is generated live from the Square Catalog + Inventory APIs
 * (owner edits products in Square Dashboard → site updates within 60s).
 * Without credentials it reports `source: 'local'` and the frontend falls
 * back to the curated Release 001 catalog bundled in the app.
 *
 * Response: {
 *   source: 'square' | 'local',
 *   generatedAt: ISO string,
 *   items: AuthoritativeItem[]   // see lib/square.ts
 * }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!squareConfigured()) {
    return res
      .status(200)
      .setHeader('Content-Type', 'application/json')
      .setHeader('Cache-Control', 'public, max-age=60')
      .json({ source: 'local', generatedAt: new Date().toISOString(), items: [] });
  }

  try {
    const catalog = await buildAuthoritativeCatalog();

    if (!catalog || catalog.items.length === 0) {
      // Square reachable but empty / errored — client uses local data
      return res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .setHeader('Cache-Control', 'public, max-age=30')
        .json({ source: 'local', generatedAt: new Date().toISOString(), items: [] });
    }

    return res
      .status(200)
      .setHeader('Content-Type', 'application/json')
      .setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
      .json({ source: 'square', generatedAt: catalog.generatedAt, items: catalog.items });
  } catch (error: any) {
    return res
      .status(502)
      .setHeader('Content-Type', 'application/json')
      .json({ error: error?.message || 'Square Catalog API unavailable.' });
  }
}
