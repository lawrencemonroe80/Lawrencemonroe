import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { RELEASED_PRODUCTS } from '../../data/products';
import { useCatalogFeed } from '../../services/squareCatalog';
import { formatCurrency } from '../../utils/format';
import { revealUp } from '../../motion/tokens';

/**
 * HOMEPAGE V2 — THE DROP (CAPSULE)
 * --------------------------------
 * Featured capsule: the top pieces with live Square pricing, size runs
 * and inventory. Light editorial cards — hairline frames, generous
 * whitespace, no chrome. The full catalog lives at /shop.
 */
export const CapsuleDrop: React.FC = () => {
  const { feed, loading } = useCatalogFeed();

  const items = useMemo(() => {
    const merged = RELEASED_PRODUCTS.map((p) => {
      const live = feed.items.find(
        (i) =>
          i.squareItemId === p.id ||
          i.name.replace(/\s+/g, '').toUpperCase() === p.name.replace(/\s+/g, '').toUpperCase()
      );
      const sizes = (live?.variations ?? p.sizes).map((v: any) => String(v.name).toUpperCase());
      return {
        slug: p.slug,
        name: p.name,
        code: p.code,
        image: p.heroImage,
        price: live ? live.minPriceCents / 100 : p.price,
        stock: live ? live.maxStock : p.stockCount,
        soldOut: live ? !live.available : p.status === 'SOLD OUT',
        sizeLine: sizes.length > 1 ? `${sizes[0]} — ${sizes[sizes.length - 1]}` : sizes[0] ?? 'ONE SIZE',
      };
    });

    // Square-only items (added by the owner in the Dashboard, no dossier yet)
    for (const item of feed.items.slice(0, 4)) {
      const known = merged.some(
        (m) =>
          m.code === item.squareItemId.toUpperCase().slice(-8) ||
          m.name.replace(/\s+/g, '').toUpperCase() === item.name.replace(/\s+/g, '').toUpperCase()
      );
      if (!known && merged.length < 4) {
        const sizes = item.variations.map((v) => v.name.toUpperCase());
        merged.push({
          slug: '',
          name: item.name,
          code: item.squareItemId.toUpperCase().slice(-8),
          image: item.imageUrl ?? RELEASED_PRODUCTS[0].heroImage,
          price: item.minPriceCents / 100,
          stock: item.maxStock,
          soldOut: !item.available,
          sizeLine: sizes.length > 1 ? `${sizes[0]} — ${sizes[sizes.length - 1]}` : sizes[0] ?? 'ONE SIZE',
        });
      }
    }

    return merged.slice(0, 4);
  }, [feed]);

  return (
    <section
      id="capsule"
      className="fx-grain-light relative bg-paper text-ink py-24 sm:py-28 border-t border-line-dark overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 relative z-10">
        {/* Header */}
        <motion.div
          variants={revealUp()}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-line-dark pb-7 mb-12"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-gold inline-block" />
              <span className="font-mono text-[11px] text-ash tracking-[0.3em] uppercase font-semibold">
                The Drop / Capsule 001
              </span>
            </div>
            <h2 className="font-serif font-bold uppercase text-4xl sm:text-6xl text-ink leading-[0.95] tracking-[-0.01em]">
              Release 001.
            </h2>
          </div>
          <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-ash flex items-center gap-2 border border-line-dark bg-white/50 px-3 py-2 w-fit">
            <span className={`w-1.5 h-1.5 ${feed.source === 'square' ? 'bg-gold animate-pulse-subtle' : 'bg-smoke'}`} />
            <span className={feed.source === 'square' ? 'text-gold-dark font-bold' : ''}>
              {loading ? 'SYNCING…' : feed.source === 'square' ? 'SQUARE / LIVE PRICING' : 'LIMITED ARCHIVE'}
            </span>
          </div>
        </motion.div>

        {/* Capsule grid */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 ${items.length > 2 ? 'lg:grid-cols-4' : 'lg:grid-cols-2'} gap-8 lg:gap-10`}
        >
          {items.map((item, i) => (
            <motion.div
              key={item.code}
              variants={revealUp(0.06 * i)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
            >
              <Link
                to={item.slug ? `/shop/${item.slug}` : '/shop'}
                className="group block"
                data-cursor="view"
                data-cursor-label="VIEW PIECE"
              >
                <div className="relative aspect-[4/5] overflow-hidden border border-line-dark bg-white/50">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="h-full w-full object-cover grayscale contrast-120 group-hover:scale-[1.04] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  />
                  <div className="absolute top-3 left-3 font-mono text-[9px] tracking-[0.2em] uppercase bg-paper/85 px-2 py-0.5 border border-line-dark text-ink">
                    SPEC {item.code}
                  </div>
                  {!item.soldOut && item.stock <= 4 && (
                    <div className="absolute bottom-3 left-3 font-mono text-[9px] tracking-[0.18em] uppercase text-gold-dark border border-gold-dark/40 bg-paper/85 px-2 py-0.5 font-bold">
                      LOW STOCK — {item.stock}
                    </div>
                  )}
                  {item.soldOut && (
                    <div className="absolute inset-0 bg-paper/70 flex items-center justify-center">
                      <span className="font-mono text-xs font-bold tracking-[0.35em] uppercase text-ink">
                        Allocation Closed
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-baseline justify-between pt-3.5">
                  <h3 className="font-serif font-bold uppercase text-xl text-ink group-hover:text-gold-dark transition-colors tracking-tight">
                    {item.name}
                  </h3>
                  <span className="font-mono text-sm font-bold text-ink">{formatCurrency(item.price)}</span>
                </div>
                <div className="flex items-center justify-between pt-1.5 font-mono text-[10px] tracking-[0.18em] text-ash uppercase">
                  <span>SIZES {item.sizeLine}</span>
                  <span className="inline-flex items-center gap-1 group-hover:text-gold-dark transition-colors">
                    VIEW <ArrowUpRight size={11} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Catalog link */}
        <motion.div
          variants={revealUp(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="pt-12 text-center"
        >
          <Link
            to="/shop"
            className="gold-line-sweep inline-flex items-center gap-2 font-mono text-xs font-bold tracking-[0.25em] uppercase text-ink hover:text-gold-dark transition-colors"
          >
            View the full catalog <ArrowUpRight size={13} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
