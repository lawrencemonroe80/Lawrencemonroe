import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Lock } from 'lucide-react';
import { RELEASED_PRODUCTS } from '../data/products';
import { formatCurrency } from '../utils/format';
import { useCartStore } from '../store/cartStore';
import { useCatalogFeed } from '../services/squareCatalog';
import { TiltCard } from '../components/common/TiltCard';
import { EditorialPlate } from '../components/common/EditorialPlate';
import type { CatalogItem, Product, Size } from '../types';

/**
 * THE DROP — /drop
 * Editorial fashion catalog. Hero piece + asymmetric product grid.
 */

type Collection = 'new' | 'essentials' | 'lookbook';

const COLLECTIONS: Record<string, Collection[]> = {
  'lm-shorts-001': ['new', 'essentials'],
  'lm-shorts-002': ['essentials', 'lookbook'],
};

const COLLECTION_TABS: { id: 'ALL' | Collection; label: string }[] = [
  { id: 'ALL', label: 'All Pieces' },
  { id: 'new', label: 'New Arrivals' },
  { id: 'essentials', label: 'Essentials' },
  { id: 'lookbook', label: 'Lookbook Exclusives' },
];

interface ShopCard {
  product: Product;
  live?: CatalogItem;
}

const normalizeSize = (name: string): Size => {
  const s = name.trim().toUpperCase();
  if (s.startsWith('XXL')) return 'XXL';
  if (s.startsWith('XL')) return 'XL';
  if (s.startsWith('L')) return 'L';
  if (s.startsWith('M')) return 'M';
  if (s.startsWith('S')) return 'S';
  return 'M';
};

const ProductCard: React.FC<{ card: ShopCard; index: number; large?: boolean }> = ({ card: { product, live }, index, large = false }) => {
  const { addItem, openCart } = useCartStore();
  const [added, setAdded] = useState(false);

  const variants = useMemo(() => {
    if (live?.variations.length) {
      return live.variations.map((v) => ({
        size: normalizeSize(v.name),
        label: v.name.toUpperCase(),
        available: v.available && v.stock > 0,
        stock: v.stock,
      }));
    }
    return product.sizes.map((s) => ({
      size: s.size,
      label: s.size,
      available: s.available && s.stock > 0,
      stock: s.stock,
    }));
  }, [live, product]);

  const [selectedSize, setSelectedSize] = useState<Size>(
    () => variants.find((v) => v.available)?.size ?? variants[0]?.size ?? 'M'
  );

  const livePrice = live ? live.minPriceCents / 100 : product.price;
  const liveStock = live ? live.maxStock : product.stockCount;
  const soldOut = live ? !live.available : product.status === 'SOLD OUT';
  const lowStock = !soldOut && liveStock <= 4;
  const selectedVariant = variants.find((v) => v.size === selectedSize);
  const quickAddDisabled = soldOut || !selectedVariant?.available;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (quickAddDisabled) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      code: product.code,
      color: product.selectedColorDefault,
      size: selectedSize,
      price: livePrice,
      image: product.cutoutImage,
      maxStock: Math.max(selectedVariant?.stock ?? 1, 1),
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
    openCart();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay: index * 0.05 }}
      className={`group ${soldOut ? 'opacity-70 saturate-50' : ''}`}
    >
      <TiltCard maxTilt={2} className="block">
        <Link
          to={product.slug ? `/drop/${product.slug}` : '/drop'}
          className="block"
          data-cursor="view"
          data-cursor-label="View Piece"
        >
          {/* Numbered plate tag */}
          <div className="flex items-baseline justify-between mb-4">
            <div className="flex items-center gap-3">
              <span
                className="text-2xl text-gold leading-none"
                style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic", letterSpacing: "0.02em" }}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-bone/40">
                / Plate {product.code.slice(-3)}
              </span>
            </div>
            <span className={`font-mono text-[10px] tracking-[0.24em] uppercase ${
              soldOut ? 'text-bone/40' : lowStock ? 'text-gold' : 'text-bone/50'
            }`}>
              {soldOut ? 'Closed' : lowStock ? `Low — ${liveStock}` : product.release}
            </span>
          </div>

          <div className="relative overflow-hidden bg-ink aspect-[4/5]">
            <img
              src={product.heroImage}
              alt={product.name}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover img-mono group-hover:scale-105 transition-transform duration-[1400ms]"
            />
            <div className="absolute inset-0 overlay-bottom opacity-60" />
            {!soldOut && (
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div className="space-y-1">
                  <div className="folio text-gold">
                    {product.colors[0]?.name.split('/')[0]?.trim()}
                  </div>
                  <div
                    className="text-lg sm:text-xl text-bone leading-none"
                    style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic", letterSpacing: "0.02em" }}
                  >
                    {variants.length > 1 ? `${variants[0].label} — ${variants[variants.length - 1].label}` : variants[0]?.label}
                  </div>
                </div>
              </div>
            )}
            {soldOut && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span
                  className="text-2xl text-bone uppercase"
                  style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
                >
                  Allocation closed
                </span>
              </div>
            )}
          </div>

          {/* Below image */}
          <div className="pt-5 space-y-3">
            <div className="flex items-baseline justify-between gap-4">
              <h2
                className="text-3xl sm:text-4xl text-bone group-hover:text-gold transition-colors duration-500 leading-none uppercase"
                style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic", letterSpacing: "0.01em" }}
              >
                {product.name}
              </h2>
              <span
                className="text-2xl text-bone shrink-0 leading-none"
                style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
              >
                {formatCurrency(livePrice)}
              </span>
            </div>
            <p className={`text-sm text-bone/55 leading-relaxed ${large ? 'max-w-md' : 'line-clamp-2'}`}>
              {product.shortDescription}
            </p>
          </div>
        </Link>
      </TiltCard>

      {/* Sizes + quick add */}
      <div className="pt-5 space-y-3 border-t border-hairline mt-4">
        <div className="flex items-center justify-between">
          <span className="folio">Select size</span>
          <span className="font-mono text-[10px] text-bone/40 tracking-[0.18em] uppercase">
            {selectedVariant?.available ? `${selectedVariant.stock} available` : 'Unavailable'}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {variants.slice(0, 6).map((v) => {
            const isSelected = v.size === selectedSize;
            return (
              <button
                key={v.size}
                onClick={() => setSelectedSize(v.size)}
                disabled={!v.available}
                aria-pressed={isSelected}
                className={`font-mono text-sm px-3 py-1.5 border transition-colors ${
                  isSelected
                    ? 'border-bone bg-bone text-black'
                    : v.available
                      ? 'border-hairline text-bone hover:border-bone/50'
                      : 'border-hairline/50 text-bone/30 line-through cursor-not-allowed'
                }`}
              >
                {v.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <button
            onClick={handleQuickAdd}
            disabled={quickAddDisabled}
            className={`flex-1 py-3 font-mono text-[10px] font-medium tracking-[0.28em] uppercase transition-colors border ${
              quickAddDisabled
                ? 'border-hairline text-bone/30 cursor-not-allowed'
                : added
                  ? 'border-gold bg-gold text-black'
                  : 'border-bone text-bone hover:bg-bone hover:text-black'
            }`}
            data-cursor="view"
            data-cursor-label={quickAddDisabled ? 'Sold Out' : 'Quick Add'}
          >
            {added ? 'Added' : quickAddDisabled ? 'Closed' : `Quick Add · ${selectedSize}`}
          </button>
          <Link
            to={product.slug ? `/drop/${product.slug}` : '/drop'}
            className="flex-1 py-3 font-mono text-[10px] font-medium tracking-[0.28em] uppercase border border-line-strong text-bone hover:border-gold hover:text-gold transition-colors flex items-center justify-center gap-2"
          >
            View Dossier <ArrowUpRight size={11} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export const DropPage: React.FC = () => {
  const [activeCollection, setActiveCollection] = useState<'ALL' | Collection>('ALL');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const { openRequestAccess } = useCartStore();
  const { feed, loading } = useCatalogFeed();

  const cards: ShopCard[] = useMemo(() => {
    const merged: ShopCard[] = RELEASED_PRODUCTS.map((product) => {
      const live = feed.items.find(
        (i) =>
          i.squareItemId === product.id ||
          i.name.replace(/\s+/g, '').toUpperCase() === product.name.replace(/\s+/g, '').toUpperCase()
      );
      return { product, live };
    });

    for (const item of feed.items) {
      const known = merged.some(
        (c) =>
          c.live?.squareItemId === item.squareItemId ||
          c.product.name.replace(/\s+/g, '').toUpperCase() === item.name.replace(/\s+/g, '').toUpperCase()
      );
      if (!known) {
        merged.push({
          product: {
            ...RELEASED_PRODUCTS[0],
            id: item.squareItemId,
            slug: '',
            code: item.squareItemId.toUpperCase().slice(-8),
            name: item.name,
            price: item.minPriceCents / 100,
            release: 'Square Live',
            status: item.available ? 'ACTIVE' : 'SOLD OUT',
            stockCount: item.maxStock,
            heroImage: item.imageUrl ?? RELEASED_PRODUCTS[0].heroImage,
            cutoutImage: item.imageUrl ?? RELEASED_PRODUCTS[0].cutoutImage,
            shortDescription: item.description ?? 'Published live from the Square Dashboard.',
            sizes: item.variations.map((v) => ({
              size: normalizeSize(v.name),
              available: v.available,
              stock: v.stock,
            })),
          },
          live: item,
        });
      }
    }

    return merged;
  }, [feed]);

  const filteredCards = useMemo(() => {
    let list = [...cards];
    if (activeCollection !== 'ALL') {
      list = list.filter((c) => {
        const collections = COLLECTIONS[c.product.id] ?? ['new'];
        return collections.includes(activeCollection);
      });
    }
    if (sortBy === 'price-asc') list.sort((a, b) => a.product.price - b.product.price);
    if (sortBy === 'price-desc') list.sort((a, b) => b.product.price - a.product.price);
    return list;
  }, [cards, activeCollection, sortBy]);

  const liveSyncLabel = feed.source === 'square' ? 'Square Live Sync' : loading ? 'Syncing' : 'Local Archive';

  return (
    <div className="relative bg-black text-bone pt-24 sm:pt-32 pb-24 min-h-screen">
      <div className="max-w-[1760px] mx-auto px-5 sm:px-8 md:px-12">
        {/* ─── HEADER ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 pb-10 sm:pb-14 border-b border-hairline">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-8 space-y-6"
          >
            <div className="flex items-center gap-4">
              <span className="folio text-gold">Page 02 — The Drop</span>
              <span className="text-bone/20">—</span>
              <span className="folio text-bone/50">Issue 001</span>
            </div>
            <h1
              className="text-[15vw] sm:text-[11vw] lg:text-[9vw] leading-[0.84] tracking-[-0.005em]"
              style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
            >
              The current{' '}
              <span className="italic text-gold-shine">
                drop.
              </span>
            </h1>
            <p
              className="text-xl sm:text-2xl text-bone/70 max-w-xl leading-snug"
              style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
            >
              Limited allocation. Heavyweight cotton with official insignia and raw hemline. The catalog, live from the studio.
            </p>
          </motion.div>

          <div className="lg:col-span-4 space-y-6 lg:pt-6">
            <div className="border border-hairline px-4 py-3 flex items-center gap-2 w-fit">
              <span className={`w-1.5 h-1.5 ${feed.source === 'square' ? 'bg-gold animate-pulse-subtle' : 'bg-bone/40'}`} />
              <span className="folio">{liveSyncLabel}</span>
            </div>
            <div className="border border-hairline px-4 py-3 flex items-center gap-2 w-fit">
              <span className="folio text-bone/50">On the rack</span>
              <span
                className="text-xl text-gold ml-2 leading-none"
                style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
              >
                {filteredCards.length.toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Filter + sort toolbar */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {COLLECTION_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCollection(tab.id)}
                className={`chip ${activeCollection === tab.id ? 'is-active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-bone/40">Sort</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-transparent border border-hairline text-bone px-3 py-2 font-mono text-[10px] uppercase tracking-[0.24em] focus:border-gold focus:outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price · Low to High</option>
              <option value="price-desc">Price · High to Low</option>
            </select>
          </div>
        </div>

        {/* ─── EDITORIAL PRODUCT GRID ─── */}
        {filteredCards.length > 0 && (
          <>
            {/* Hero piece */}
            <div className="mt-12 sm:mt-16">
              <ProductCard card={filteredCards[0]} index={0} large />
            </div>

            {/* Asymmetric grid */}
            <div className="mt-16 sm:mt-24 grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
              {filteredCards.slice(1).map((card, i) => (
                <div
                  key={card.product.id}
                  className={
                    i % 3 === 0
                      ? 'md:col-span-7'
                      : i % 3 === 1
                        ? 'md:col-span-5'
                        : 'md:col-span-12'
                  }
                >
                  <ProductCard card={card} index={i + 1} />
                </div>
              ))}
            </div>
          </>
        )}

        {filteredCards.length === 0 && (
          <div className="mt-16 border border-hairline p-16 text-center">
            <div className="folio text-bone/40 mb-3">No pieces</div>
            <p className="text-bone/50">No specimens match this filter yet.</p>
          </div>
        )}

        {/* Unreleased teaser */}
        <div className="mt-24 sm:mt-32 pt-16 border-t border-hairline">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <Lock size={14} className="text-gold" strokeWidth={1.5} />
                <span className="folio text-gold">Archive Next — Unreleased Research</span>
              </div>
              <h2
                className="text-5xl sm:text-7xl lg:text-8xl text-bone leading-[0.92] tracking-[-0.005em] uppercase"
                style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic", letterSpacing: "0.005em" }}
              >
                Release 002 <span
                  className="italic text-gold-shine"
                  style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic", fontWeight: 400, fontSize: "0.65em" }}
                >(Shirt)</span>
                <br />
                & Release 003 <span
                  className="italic text-gold-shine"
                  style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic", fontWeight: 400, fontSize: "0.65em" }}
                >(Headwear)</span>.
              </h2>
              <p
                className="text-xl text-bone/60 max-w-2xl leading-snug"
                style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
              >
                Future release garments remain locked in laboratory testing. Enrolled clients receive priority dispatch access prior to public allocation.
              </p>
              <button onClick={() => openRequestAccess()} className="btn-mono mt-2">
                <Lock size={12} strokeWidth={1.5} />
                Request access
              </button>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <EditorialPlate
                src="/images/archive-shirt-teaser.jpg"
                alt="Shirt prototype — locked"
                aspect="aspect-[3/4]"
                eyebrow="Release 002"
                caption="The Shirt — locked"
                meta={['Locked', 'Lab testing']}
                lightbox={{
                  src: '/images/archive-shirt-teaser.jpg',
                  alt: 'Shirt prototype',
                  eyebrow: 'Release 002 — Locked',
                  title: 'The Shirt.',
                  caption: 'Currently in laboratory stress testing. Archive clients receive priority dispatch.',
                  meta: ['Status: Locked', 'Lab: Stage 03', 'ETA: Q1 2027'],
                }}
              />
              <div className="mt-12">
                <EditorialPlate
                  src="/images/archive-hat-teaser.jpg"
                  alt="Hat prototype — locked"
                  aspect="aspect-[3/4]"
                  eyebrow="Release 003"
                  caption="The Headwear — locked"
                  meta={['Locked', 'Lab testing']}
                  lightbox={{
                    src: '/images/archive-hat-teaser.jpg',
                    alt: 'Hat prototype',
                    eyebrow: 'Release 003 — Locked',
                    title: 'The Headwear.',
                    caption: 'Structured silhouette currently in pattern revision. Allocation opening imminent.',
                    meta: ['Status: Locked', 'Lab: Stage 02', 'ETA: Q2 2027'],
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
