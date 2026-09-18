import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Lock, Plus, Check } from 'lucide-react';
import { RELEASED_PRODUCTS } from '../data/products';
import { formatCurrency } from '../utils/format';
import { useCartStore } from '../store/cartStore';
import { brandAssets } from '../data/assets';
import { useCatalogFeed } from '../services/squareCatalog';
import { AssetInspector } from '../components/common/AssetInspector';
import { VelocityText } from '../components/common/VelocityText';
import { revealUp } from '../motion/tokens';
import type { CatalogItem, Product, Size } from '../types';

/**
 * SHOP / COLLECTION CATALOG — /shop
 * ---------------------------------
 * Grid-based luxury catalog powered by the Square Catalog API via
 * `/api/square/catalog` (live pricing, size variations S–XXL, inventory)
 * with the bundled Release 001 dossier as fallback.
 *
 * Card mechanics:
 *   - Live variant selection: size chips reflect Square variation stock;
 *     unavailable sizes are struck and disabled.
 *   - Quick-add: adds the selected variation straight to the cart
 *     drawer (which carries the inline Square express checkout).
 *   - Hover: macro-zoom inspection lens on the media plate.
 */

type Collection = 'new' | 'essentials' | 'lookbook';

/** Curated collection membership for the bundled catalog; live Square
 *  items default to NEW ARRIVALS. */
const COLLECTIONS: Record<string, Collection[]> = {
  'lm-shorts-001': ['new', 'essentials'],
  'lm-shorts-002': ['essentials', 'lookbook'],
};

const COLLECTION_TABS: { id: 'ALL' | Collection; label: string }[] = [
  { id: 'ALL', label: 'ALL SPECIMENS' },
  { id: 'new', label: 'NEW ARRIVALS' },
  { id: 'essentials', label: 'ESSENTIALS' },
  { id: 'lookbook', label: 'LOOKBOOK EXCLUSIVES' },
];

interface ShopCard {
  product: Product;
  live?: CatalogItem;
}

/** Normalize a size label ("Small"/"S"/"XXL") to the storefront Size union. */
const normalizeSize = (name: string): Size => {
  const s = name.trim().toUpperCase();
  if (s.startsWith('XXL')) return 'XXL';
  if (s.startsWith('XL')) return 'XL';
  if (s.startsWith('L')) return 'L';
  if (s.startsWith('M')) return 'M';
  if (s.startsWith('S')) return 'S';
  return 'M';
};

const ProductCard: React.FC<{ card: ShopCard; index: number }> = ({ card: { product, live }, index }) => {
  const { addItem, openCart } = useCartStore();
  const [added, setAdded] = useState(false);

  // Variant list — live Square variations or bundled sizes
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

  const isHeather = product.id === 'lm-shorts-002';
  const badgeSrc = isHeather ? brandAssets.blueBadge : brandAssets.whiteBadge;
  const macroImage = product.images.find((i) => i.type === 'macro')?.url ?? product.images[3]?.url;
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
      variants={revealUp(index * 0.08)}
      initial="hidden"
      animate="visible"
      className={`group bg-graphite/40 border transition-all duration-500 flex flex-col justify-between ${
        soldOut ? 'border-line/50 opacity-70' : 'border-line hover:border-gold'
      }`}
    >
      {/* Product Header Bar */}
      <div className="p-4 border-b border-line flex items-center justify-between font-mono text-[10px]">
        <span className="text-gold tracking-widest font-bold">SPEC: {product.code}</span>
        <span
          className={`px-2 py-0.5 border ${
            soldOut
              ? 'text-archive-red border-archive-red/40 bg-archive-red/10'
              : lowStock
                ? 'text-gold border-gold/40 bg-gold/10 font-bold'
                : 'text-smoke bg-black/60 border-line/40'
          }`}
        >
          {soldOut ? 'SOLD OUT' : lowStock ? `LOW STOCK — ${liveStock} LEFT` : product.release}
        </span>
      </div>

      {/* Main Media Stage — macro inspection on hover */}
      <Link
        to={product.slug ? `/shop/${product.slug}` : '/shop'}
        className="block relative aspect-[4/5] bg-black overflow-hidden"
      >
        <AssetInspector
          image={product.heroImage}
          macroImage={macroImage}
          zoom={2.4}
          alt={product.name}
          className="absolute inset-0"
          imgClassName="object-cover brightness-95 contrast-105"
        />
        <div className="absolute inset-0 pointer-events-none z-[8]">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
          {/* Official Pill Badge Stamp */}
          <div className="absolute top-4 left-4 w-32 sm:w-36">
            <img src={badgeSrc} alt="LawrenceMonroe" className="w-full h-auto object-contain drop-shadow-md" />
          </div>
          {/* Inspect spec hint */}
          <div className="absolute bottom-4 right-4 font-mono text-[10px] text-smoke bg-black/80 border border-line px-3 py-1.5 flex items-center space-x-1 group-hover:text-gold group-hover:border-gold transition-colors">
            <span>INSPECT SPEC</span>
            <ArrowUpRight size={13} />
          </div>
        </div>
      </Link>

      {/* Footer — details, variant selection, quick add */}
      <div className="p-6 bg-black/60 border-t border-line space-y-4">
        <div className="flex items-baseline justify-between">
          <Link to={product.slug ? `/shop/${product.slug}` : '/shop'}>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-bone group-hover:text-gold transition-colors uppercase tracking-tight">
              {product.name}
            </h2>
          </Link>
          <span className="font-mono text-lg sm:text-xl font-bold text-bone">
            {formatCurrency(livePrice)}
          </span>
        </div>

        <p className="font-utility text-xs text-smoke leading-relaxed line-clamp-2">
          {product.shortDescription}
        </p>

        {/* Live variant selection — S through XXL */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between font-mono text-[9px] text-smoke tracking-[0.18em] uppercase">
            <span>Select size — live stock</span>
            <span className="text-gold/80">
              {selectedVariant?.available ? `${selectedVariant.stock} AVAILABLE` : 'UNAVAILABLE'}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {variants.slice(0, 6).map((v) => {
              const isSelected = v.size === selectedSize;
              return (
                <button
                  key={v.size}
                  onClick={() => setSelectedSize(v.size)}
                  disabled={!v.available}
                  aria-pressed={isSelected}
                  className={`font-mono text-[11px] font-bold px-2.5 py-1.5 border transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-gold ${
                    isSelected
                      ? 'border-gold bg-gold text-black'
                      : v.available
                        ? 'border-line text-bone/85 bg-black/50 hover:border-smoke'
                        : 'border-line/40 text-smoke/40 line-through bg-black/30 cursor-not-allowed'
                  }`}
                >
                  {v.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick add + dossier */}
        <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            onClick={handleQuickAdd}
            disabled={quickAddDisabled}
            data-cursor="view"
            data-cursor-label={quickAddDisabled ? 'SOLD OUT' : 'QUICK ADD'}
            className={`flex-1 py-3 px-4 font-mono text-[11px] font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
              quickAddDisabled
                ? 'bg-ash text-smoke/70 cursor-not-allowed'
                : added
                  ? 'bg-gold-soft text-black'
                  : 'bg-bone hover:bg-gold text-black'
            }`}
          >
            {added ? (
              <>
                <Check size={13} /> ADDED
              </>
            ) : (
              <>
                <Plus size={13} /> QUICK ADD {selectedSize}
              </>
            )}
          </button>
          <Link
            to={product.slug ? `/shop/${product.slug}` : '/shop'}
            className="flex-1 py-3 px-4 border border-line hover:border-gold text-bone hover:text-gold font-mono text-[11px] font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-colors"
          >
            VIEW DOSSIER <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export const ShopPage: React.FC = () => {
  const [activeCollection, setActiveCollection] = useState<'ALL' | Collection>('ALL');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const { openRequestAccess } = useCartStore();
  const { feed, loading: feedLoading } = useCatalogFeed();

  /** Merge the bundled product dossiers with the live Square catalog. */
  const cards: ShopCard[] = useMemo(() => {
    const merged: ShopCard[] = RELEASED_PRODUCTS.map((product) => {
      const live = feed.items.find(
        (i) =>
          i.squareItemId === product.id ||
          i.name.replace(/\s+/g, '').toUpperCase() === product.name.replace(/\s+/g, '').toUpperCase()
      );
      return { product, live };
    });

    // Square items with no bundled dossier (owner added a new product in
    // the Square Dashboard) → synthesized cards
    for (const item of feed.items) {
      const known = merged.some(
        (c) =>
          c.live?.squareItemId === item.squareItemId ||
          c.product.name.replace(/\s+/g, '').toUpperCase() === item.name.replace(/\s+/g, '').toUpperCase()
      );
      if (!known) {
        merged.push({
          product: {
            ...RELEASED_PRODUCTS[0], // structural template
            id: item.squareItemId,
            slug: '', // routes to catalog index until a dossier page exists
            code: item.squareItemId.toUpperCase().slice(-8),
            name: item.name,
            price: item.minPriceCents / 100,
            release: 'SQUARE LIVE',
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

  const liveSyncLabel = feed.source === 'square' ? 'SQUARE / LIVE SYNC' : feedLoading ? 'SYNCING…' : 'LOCAL ARCHIVE';

  return (
    <div className="min-h-screen bg-black text-bone pt-28 sm:pt-36 pb-24">
      {/* Background Archival Grid */}
      <div className="absolute inset-0 bg-archival-grid opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 relative z-10">
        {/* Page Header */}
        <div className="border-b border-line pb-8 mb-12 sm:mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-gold inline-block" />
                <span className="font-mono text-xs text-gold tracking-widest uppercase font-bold">
                  RELEASE 001 / CATALOG DOSSIER
                </span>
              </div>
              <h1 className="text-5xl sm:text-7xl md:text-8xl uppercase text-bone leading-[0.92]">
                <VelocityText>ACTIVE PIECES</VelocityText>
              </h1>
              <p className="font-utility text-xs sm:text-sm text-smoke max-w-lg">
                Exclusive limited allocation. All shorts constructed from 480GSM cotton with official insignia badges and raw hemline.
              </p>
            </div>

            {/* Live sync + release metadata */}
            <div className="flex items-center space-x-4 font-mono text-xs text-smoke">
              <div className="border border-line bg-graphite/40 px-3 py-2 flex items-center gap-2">
                <span
                  className={`w-1.5 h-1.5 ${feed.source === 'square' ? 'bg-gold animate-pulse-subtle' : 'bg-smoke'}`}
                />
                <span className={feed.source === 'square' ? 'text-gold font-bold' : ''}>{liveSyncLabel}</span>
              </div>
              <div className="border border-line bg-graphite/40 px-3 py-2 hidden sm:block">
                <span className="text-smoke/60">ALLOCATED: </span>
                <span className="text-gold font-bold">{filteredCards.length} EDITIONS</span>
              </div>
            </div>
          </div>

          {/* Collection + Sort Toolbar */}
          <div className="mt-10 pt-6 border-t border-line/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {COLLECTION_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCollection(tab.id)}
                  className={`px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors border ${
                    activeCollection === tab.id
                      ? 'border-gold bg-gold text-black font-bold'
                      : 'border-line bg-graphite/40 text-smoke hover:text-bone hover:border-smoke'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2 font-mono text-xs">
              <span className="text-smoke">SORT:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-black border border-line text-bone px-3 py-1.5 font-mono text-xs focus:border-gold focus:outline-none uppercase"
              >
                <option value="featured">FEATURED CURATION</option>
                <option value="price-asc">PRICE: LOW TO HIGH</option>
                <option value="price-desc">PRICE: HIGH TO LOW</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid: Editorial Asymmetry */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-24">
          {filteredCards.map((card, idx) => (
            <ProductCard key={card.product.id} card={card} index={idx} />
          ))}
        </div>

        {/* Unreleased Concept Archive Teaser Section */}
        <div className="border-t border-line pt-16 mt-16">
          <div className="bg-graphite border border-line p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute -right-12 -bottom-12 pointer-events-none opacity-5 font-display text-9xl font-black text-smoke">
              NEXT
            </div>

            <div className="max-w-2xl space-y-6 relative z-10">
              <div className="flex items-center space-x-2">
                <Lock size={14} className="text-archive-red" />
                <span className="font-mono text-xs text-archive-red tracking-widest uppercase font-bold">
                  ARCHIVE NEXT / UNRELEASED RESEARCH
                </span>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-bone uppercase tracking-tight">
                RELEASE 002 (SHIRT) & 003 (HEADWEAR).
              </h2>

              <p className="font-utility text-xs sm:text-sm text-smoke leading-relaxed">
                Future release garments remain locked in laboratory testing. Enrolled clients receive priority dispatch access prior to public allocation.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => openRequestAccess()}
                  className="bg-black border border-gold hover:bg-gold hover:text-black text-gold py-3.5 px-8 font-mono text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center space-x-2"
                >
                  <Lock size={13} />
                  <span>REQUEST RELEASE ACCESS</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
