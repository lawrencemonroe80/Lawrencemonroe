import type { VercelRequest, VercelResponse } from '@vercel/node';
import { buildAuthoritativeCatalog, AuthoritativeItem } from './lib/square';

/**
 * GET /api/instagram
 * ------------------
 * Pulls the official @LawrenceMonroe media feed server-side (the Graph
 * API token stays off the client) and tags each post with purchasable
 * Square items by matching captions / SKUs against the live catalog —
 * the "SHOP THE LOOK" mechanic for /telemetry.
 *
 * Environment:
 *   INSTAGRAM_ACCESS_TOKEN  Meta developer console → Instagram Graph API
 *                           (instagram_basic + instagram_manage_insights)
 *
 * Response: { source: 'live' | 'unconfigured' | 'error', posts: [...] }
 * The frontend silently falls back to the curated community feed when
 * source !== 'live'.
 */

interface RawFeedTag {
  squareItemId: string;
  name: string;
  priceCents: number;
}

interface RawFeedPost {
  id: string;
  image: string;
  permalink: string;
  caption: string;
  postedAt: string;
  likes: number;
  mediaType: string;
  tags: RawFeedTag[];
}

const IG_GRAPH = 'https://graph.instagram.com/v21.0';

/** Deterministic tag matching: caption tokens ↔ catalog names / SKUs. */
const matchTags = (caption: string, items: AuthoritativeItem[]): RawFeedTag[] => {
  const haystack = (caption || '').toUpperCase();
  const tags: RawFeedTag[] = [];

  for (const item of items) {
    const nameTokens = item.name.toUpperCase().split(/\s+/).filter((t) => t.length > 2);
    const skuTokens = item.variations.map((v) => v.sku).filter(Boolean) as string[];

    const nameHit = nameTokens.length > 0 && nameTokens.every((t) => haystack.includes(t));
    const skuHit = skuTokens.some((sku) => haystack.includes(sku.toUpperCase()));

    if (nameHit || skuHit) {
      tags.push({ squareItemId: item.squareItemId, name: item.name, priceCents: item.minPriceCents });
    }
  }
  return tags;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) {
    return res
      .status(200)
      .setHeader('Content-Type', 'application/json')
      .setHeader('Cache-Control', 'public, max-age=300')
      .json({ source: 'unconfigured', posts: [] });
  }

  try {
    // Resolve the account id first (token may be a user token)
    const meRes = await fetch(`${IG_GRAPH}/me?fields=id,username&access_token=${token}`);
    const me = await meRes.json();
    if (!meRes.ok) throw new Error(me?.error?.message || 'Instagram /me failed');

    const mediaRes = await fetch(
      `${IG_GRAPH}/${me.id}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count&limit=24&access_token=${token}`
    );
    const media = await mediaRes.json();
    if (!mediaRes.ok) throw new Error(media?.error?.message || 'Instagram /media failed');

    // Tag against the live Square catalog (falls back to zero tags gracefully)
    const catalog = await buildAuthoritativeCatalog().catch(() => null);
    const catalogItems = catalog?.items ?? [];

    const posts: RawFeedPost[] = (media.data || [])
      .filter((m: any) => m.media_url || m.thumbnail_url)
      .map((m: any) => ({
        id: m.id,
        image: m.media_type === 'VIDEO' ? m.thumbnail_url : m.media_url,
        permalink: m.permalink,
        caption: m.caption || '',
        postedAt: m.timestamp,
        likes: m.like_count ?? 0,
        mediaType: m.media_type,
        tags: matchTags(m.caption || '', catalogItems),
      }));

    return res
      .status(200)
      .setHeader('Content-Type', 'application/json')
      .setHeader('Cache-Control', 'public, max-age=300')
      .json({ source: 'live', posts });
  } catch (error: any) {
    return res
      .status(200) // soft-fail: client uses the curated feed
      .setHeader('Content-Type', 'application/json')
      .setHeader('Cache-Control', 'public, max-age=60')
      .json({ source: 'error', posts: [], detail: error?.message });
  }
}
