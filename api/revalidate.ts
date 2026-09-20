import type { VercelRequest, VercelResponse } from '@vercel/node';
import { timingSafeEqual } from 'crypto';
import { clearCatalogCache } from './lib/square';

/**
 * POST /api/revalidate
 * --------------------
 * Sanity webhook target — the SPA equivalent of Next.js On-Demand ISR.
 *
 * When the owner publishes a lookbook in Sanity Studio, Sanity fires a
 * webhook (manage.sanity.io → Project → API → Webhooks) to this route.
 * We verify the shared secret, then:
 *
 *   1. Clear the instance-local Square catalog cache (product tags in
 *      editorial stories are resolved against the live catalog).
 *   2. Warm a fresh catalog fetch so the next visitor gets hot data.
 *   3. Return the revalidation receipt.
 *
 * Because Vercel serverless instances are ephemeral, the 60s TTL on the
 * catalog cache is the global worst-case freshness bound. (For a future
 * Next.js migration this route becomes `res.revalidate()` per path.)
 *
 * Environment:
 *   SANITY_WEBHOOK_SECRET  shared secret, also set in the Sanity webhook
 *   SITE_URL               canonical production URL (default
 *                          https://lawrencemonroe.com)
 */

const safeEqual = (a: string, b: string): boolean => {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // --- verify shared secret (header or query param) ---
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  const provided =
    (req.headers['sanity-webhook-secret'] as string | undefined) ||
    (req.query.secret as string | undefined);

  if (secret && !provided) {
    return res.status(401).json({ error: 'Missing webhook secret.' });
  }
  if (secret && provided && !safeEqual(secret, provided)) {
    return res.status(403).json({ error: 'Invalid webhook secret.' });
  }
  // Without a configured secret we accept the call (dev/preview) but
  // flag it in the receipt — production should always set the secret.

  // --- invalidate + warm ---
  clearCatalogCache();

  const siteUrl = process.env.SITE_URL || 'https://lawrencemonroe.com';
  const warmed = await fetch(`${siteUrl}/api/square/catalog`, {
    headers: { 'user-agent': 'lm-revalidate' },
  }).catch(() => null);

  const body = req.body || {};

  return res
    .status(200)
    .setHeader('Content-Type', 'application/json')
    .json({
      revalidated: true,
      secretVerified: Boolean(secret),
      documentType: body._type ?? null,
      documentId: body._id ?? null,
      catalogWarmStatus: warmed ? warmed.status : null,
      timestamp: new Date().toISOString(),
    });
}
