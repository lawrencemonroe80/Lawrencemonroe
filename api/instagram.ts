import type { VercelRequest, VercelResponse } from '@vercel/node';
import { buildAuthoritativeCatalog, AuthoritativeItem } from './lib/square';

/**
 * GET /api/instagram
 * ------------------
 * Pulls the official @LawrenceMonroe media feed server-side (access
 * tokens stay off the client) and tags each post with purchasable Square
 * items by matching captions / SKUs against the live catalog — the
 * "SHOP THE LOOK" mechanic for /telemetry.
 *
 * Two supported providers (first match wins):
 *
 *   1. BEHOLD  — set BEHOLD_FEED_ID (behold.so feed id). Behold handles
 *                token refresh + Instagram API changes upstream; the
 *                endpoint is simply https://feed.behold.so/{feedId}.
 *   2. INSTAGRAM GRAPH API — set INSTAGRAM_ACCESS_TOKEN
 *                (instagram_basic + instagram_manage_insights).
 *
 * Response: { source: 'live' | 'unconfigured' | 'error',
 *             provider: 'behold' | 'graph' | null, posts: [...] }
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
const BEHOLD_ENDPOINT = 'https://feed.behold.so';

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

/** Tag posts against the live Square catalog (never throws). */
const withTags = async (posts: Omit<RawFeedPost, 'tags'>[]): Promise<RawFeedPost[]> => {
  const catalog = await buildAuthoritativeCatalog().catch(() => null);
  const catalogItems = catalog?.items ?? [];
  return posts.map((p) => ({ ...p, tags: matchTags(p.caption, catalogItems) }));
};

/** Lenient field access — Behold and Graph use slightly different shapes. */
const pick = (obj: any, ...keys: string[]): any => {
  for (const k of keys) {
    if (obj?.[k] !== undefined && obj?.[k] !== null) return obj[k];
  }
  return undefined;
};

/* -------------------- Provider: Behold -------------------- */

const fetchFromBehold = async (feedId: string): Promise<Omit<RawFeedPost, 'tags'>[]> => {
  const res = await fetch(`${BEHOLD_ENDPOINT}/${feedId}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Behold feed failed (${res.status})`);

  const data = await res.json();
  // Behold returns { posts: [...] } (or a bare array, depending on plan)
  const raw: any[] = Array.isArray(data) ? data : data.posts || [];

  return raw
    .map((m) => {
      const mediaType = String(pick(m, 'mediaType', 'type', 'media_type') || 'IMAGE').toUpperCase();
      const image = pick(m, 'thumbnailUrl', 'thumbnail_url', 'mediaUrl', 'media_url');
      if (!image) return null;
      return {
        id: String(pick(m, 'id', 'postId') ?? Math.random().toString(36).slice(2)),
        image,
        permalink: pick(m, 'permalink') || 'https://instagram.com/lawrencemonroe',
        caption: pick(m, 'caption') || '',
        postedAt: pick(m, 'timestamp', 'postedAt', 'date') || new Date().toISOString(),
        likes: Number(pick(m, 'likeCount', 'likes', 'like_count') ?? 0),
        mediaType,
      };
    })
    .filter((p): p is Omit<RawFeedPost, 'tags'> => p !== null);
};

/* -------------------- Provider: Instagram Graph -------------------- */

const fetchFromGraph = async (token: string): Promise<Omit<RawFeedPost, 'tags'>[]> => {
  // Resolve the account id first (token may be a user token)
  const meRes = await fetch(`${IG_GRAPH}/me?fields=id,username&access_token=${token}`);
  const me = await meRes.json();
  if (!meRes.ok) throw new Error(me?.error?.message || 'Instagram /me failed');

  const mediaRes = await fetch(
    `${IG_GRAPH}/${me.id}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count&limit=24&access_token=${token}`
  );
  const media = await mediaRes.json();
  if (!mediaRes.ok) throw new Error(media?.error?.message || 'Instagram /media failed');

  return (media.data || [])
    .filter((m: any) => m.media_url || m.thumbnail_url)
    .map((m: any) => ({
      id: m.id,
      image: m.media_type === 'VIDEO' ? m.thumbnail_url : m.media_url,
      permalink: m.permalink,
      caption: m.caption || '',
      postedAt: m.timestamp,
      likes: m.like_count ?? 0,
      mediaType: m.media_type,
    }));
};

/* -------------------- Handler -------------------- */

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const beholdFeedId = process.env.BEHOLD_FEED_ID;
  const igToken = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!beholdFeedId && !igToken) {
    return res
      .status(200)
      .setHeader('Content-Type', 'application/json')
      .setHeader('Cache-Control', 'public, max-age=300')
      .json({ source: 'unconfigured', provider: null, posts: [] });
  }

  try {
    const provider = beholdFeedId ? 'behold' : 'graph';
    const rawPosts = beholdFeedId
      ? await fetchFromBehold(beholdFeedId)
      : await fetchFromGraph(igToken!);

    const posts = await withTags(rawPosts);

    return res
      .status(200)
      .setHeader('Content-Type', 'application/json')
      .setHeader('Cache-Control', 'public, max-age=300')
      .json({ source: 'live', provider, posts });
  } catch (error: any) {
    return res
      .status(200) // soft-fail: client uses the curated feed
      .setHeader('Content-Type', 'application/json')
      .setHeader('Cache-Control', 'public, max-age=60')
      .json({ source: 'error', provider: null, posts: [], detail: error?.message });
  }
}
