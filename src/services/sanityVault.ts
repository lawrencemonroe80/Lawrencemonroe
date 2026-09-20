import { useEffect, useState } from 'react';
import { BUNDLED_VAULT_STORIES } from '../data/vaultStories';
import { VaultCategory, VaultStory } from '../types';

/**
 * SANITY VAULT SERVICE (/vault)
 * -----------------------------
 * Queries the Sanity Content Lake directly over HTTPS (public dataset —
 * no client secret required) with a bundled fallback, so the vault works
 * before the owner ever opens Sanity Studio.
 *
 * Env (client-side, public):
 *   VITE_SANITY_PROJECT_ID  — sanity.io project id
 *   VITE_SANITY_DATASET     — defaults to 'production'
 *
 * When the owner publishes in Studio, the Sanity webhook hits
 * `/api/revalidate` (see api/revalidate.ts) and content is fresh on the
 * next load — the SPA equivalent of Next.js On-Demand ISR.
 *
 * Schemas live in `sanity/schemas.ts` — they define exactly this shape.
 */

export type VaultSource = 'SANITY' | 'LOCAL';

const GROQ = `*[_type == "lookbookStory" && defined(slug.current)] | order(publishedAt desc) {
  "_id": _id,
  "slug": slug.current,
  title,
  category,
  summary,
  coverImage,
  gallery,
  publishedAt,
  credits,
  linkedSquareItemIds,
  featured
}`;

/** Build a CDN URL from a Sanity image asset `_ref`. */
const sanityImageUrl = (ref: string): string => {
  const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
  const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
  // ref: "image-<id>-<w>x<h>-<ext>"
  const path = ref.replace(/^image-/, '').replace(/-(jpg|png|webp|gif)$/, '.$1');
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${path}`;
};

const mapStory = (doc: any): VaultStory => ({
  id: doc._id,
  slug: doc.slug,
  title: doc.title ?? 'UNTITLED STORY',
  category: (doc.category ?? 'CAMPAIGN') as VaultCategory,
  summary: doc.summary ?? '',
  coverImage: doc.coverImage ? sanityImageUrl(doc.coverImage.asset._ref) : '/images/campaign-hero-motion.jpg',
  gallery: (doc.gallery ?? []).map((g: any) => ({
    src: sanityImageUrl(g.asset._ref),
    label: (g.caption ?? '').toUpperCase(),
  })),
  publishedAt: doc.publishedAt ?? new Date().toISOString(),
  credits: doc.credits ?? [],
  linkedSquareItemIds: doc.linkedSquareItemIds ?? [],
  featured: doc.featured ?? false,
});

export const fetchVaultStories = async (): Promise<{ stories: VaultStory[]; source: VaultSource }> => {
  const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
  if (!projectId) return { stories: BUNDLED_VAULT_STORIES, source: 'LOCAL' };

  try {
    const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);

    const res = await fetch(
      `https://${projectId}.apicdn.sanity.io/v1/data/query/${dataset}?query=${encodeURIComponent(GROQ)}`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`sanity ${res.status}`);

    const data = await res.json();
    const stories = (data.result ?? []).map(mapStory);
    if (stories.length === 0) throw new Error('empty dataset');

    return { stories, source: 'SANITY' };
  } catch {
    return { stories: BUNDLED_VAULT_STORIES, source: 'LOCAL' };
  }
};

export const useVaultStories = () => {
  const [stories, setStories] = useState<VaultStory[]>(BUNDLED_VAULT_STORIES);
  const [source, setSource] = useState<VaultSource>('LOCAL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchVaultStories().then((vault) => {
      if (mounted) {
        setStories(vault.stories);
        setSource(vault.source);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return { stories, source, loading };
};
