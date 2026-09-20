import { useEffect, useState } from 'react';
import { RELEASED_PRODUCTS } from '../data/products';
import type { CatalogFeed, CatalogItem, ShopTheLookTag } from '../types';

/**
 * SQUARE CATALOG SERVICE (client)
 * -------------------------------
 * Fetches the normalized catalog from `/api/catalog` (Netlify function →
 * Square Catalog + Inventory APIs). When Square isn't configured — local
 * dev, preview deploys — it maps the bundled Release 001 catalog into the
 * same shape, so every consumer stays identical.
 *
 * The feed also powers "SHOP THE LOOK" tag resolution on /telemetry.
 */

const CATALOG_ENDPOINT = '/api/square/catalog';

/** Map the bundled local catalog into the normalized Square shape. */
export const localCatalogFeed = (): CatalogFeed => ({
  source: 'local',
  generatedAt: new Date().toISOString(),
  items: RELEASED_PRODUCTS.map((p) => ({
    squareItemId: p.id,
    name: p.name,
    description: p.shortDescription,
    imageUrl: p.heroImage,
    available: p.status === 'ACTIVE',
    maxStock: p.stockCount,
    minPriceCents: Math.round(p.price * 100),
    variations: p.sizes.map((s) => ({
      // Synthetic ids — only used when Square credentials are absent
      variationId: `${p.id}-var-${s.size}`,
      name: s.size,
      priceCents: Math.round(p.price * 100),
      available: s.available && s.stock > 0,
      stock: s.stock,
    })),
  })),
});

/** Fetch the live catalog; resolve to local on any failure. */
export const fetchCatalogFeed = async (): Promise<CatalogFeed> => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(CATALOG_ENDPOINT, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`catalog ${res.status}`);
    const feed = (await res.json()) as CatalogFeed;

    if (feed.source === 'square' && feed.items.length > 0) return feed;
    return { ...localCatalogFeed(), generatedAt: feed.generatedAt };
  } catch {
    return localCatalogFeed();
  }
};

/** React hook: catalog feed + loading flag (local feed is synchronous-ish). */
export const useCatalogFeed = () => {
  const [feed, setFeed] = useState<CatalogFeed>(() => localCatalogFeed());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchCatalogFeed().then((f) => {
      if (mounted) {
        setFeed(f);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return { feed, loading };
};

/** Resolve a SHOP THE LOOK tag to a storefront link target. */
export const tagHref = (tag: ShopTheLookTag): string =>
  tag.slug ? `/shop/${tag.slug}` : '/shop';

/** Attach storefront slugs to tags coming from the live feed. */
export const hydrateTags = (tags: ShopTheLookTag[]): ShopTheLookTag[] =>
  tags.map((tag) => {
    const local = RELEASED_PRODUCTS.find((p) => p.id === tag.squareItemId);
    return local ? { ...tag, slug: local.slug } : tag;
  });
