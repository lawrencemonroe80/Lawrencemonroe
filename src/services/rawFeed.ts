import { useEffect, useState } from 'react';
import { CURATED_FEED_POSTS } from '../data/rawFeedPosts';
import { hydrateTags } from './squareCatalog';
import { RawFeedPost, ShopTheLookTag } from '../types';

/**
 * RAW FEEDS SERVICE (/telemetry)
 * ------------------------------
 * Merges the live @LawrenceMonroe Instagram feed (via `/api/instagram` —
 * token never reaches the client) with the curated community archive.
 * Official posts are always sorted first, then most-recent.
 *
 * `source` drives the page's telemetry chip:
 *   'LIVE'         — Instagram Graph API connected
 *   'CURATED'      — no token / API error → curated archive only
 */

export type FeedSource = 'LIVE' | 'CURATED';

interface FeedResponse {
  source: 'live' | 'unconfigured' | 'error';
  posts: {
    id: string;
    image: string;
    permalink: string;
    caption: string;
    postedAt: string;
    likes: number;
    mediaType: string;
    tags: ShopTheLookTag[];
  }[];
}

const ASPECTS = ['tall', 'wide', 'square'] as const;

export const fetchRawFeed = async (): Promise<{ posts: RawFeedPost[]; source: FeedSource }> => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);
    const res = await fetch('/api/instagram', { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`feed ${res.status}`);

    const data = (await res.json()) as FeedResponse;

    if (data.source === 'live' && data.posts.length > 0) {
      const official: RawFeedPost[] = data.posts.map((p, i) => ({
        id: `ig-${p.id}`,
        handle: 'lawrencemonroe',
        isOfficial: true,
        image: p.image,
        alt: p.caption.slice(0, 120) || 'Official Lawrence Monroe post',
        caption: p.caption,
        postedAt: p.postedAt,
        likes: p.likes,
        permalink: p.permalink,
        aspect: ASPECTS[i % ASPECTS.length],
        tags: hydrateTags(p.tags ?? []),
      }));

      return { posts: [...official, ...CURATED_FEED_POSTS], source: 'LIVE' };
    }
  } catch {
    /* fall through to curated */
  }

  return { posts: CURATED_FEED_POSTS, source: 'CURATED' };
};

export const useRawFeed = () => {
  const [posts, setPosts] = useState<RawFeedPost[]>(CURATED_FEED_POSTS);
  const [source, setSource] = useState<FeedSource>('CURATED');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchRawFeed().then((feed) => {
      if (mounted) {
        setPosts(feed.posts);
        setSource(feed.source);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return { posts, source, loading };
};

/** "3d 14h ago" style stamp for the grid captions. */
export const relativeStamp = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return 'JUST NOW';
  if (hours < 24) return `${hours}H AGO`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}D AGO`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase();
};
