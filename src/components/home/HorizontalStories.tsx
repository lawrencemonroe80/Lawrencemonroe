import React, { useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowLeft, ArrowRight } from 'lucide-react';
import { RELEASED_PRODUCTS } from '../../data/products';
import { useCatalogFeed } from '../../services/squareCatalog';
import { formatCurrency } from '../../utils/format';

/**
 * §4 — HORIZONTAL STORIES
 * Fashion-forward horizontal rail. Editorial plates with oversized
 * names, drag to scroll, plus prev/next buttons.
 */
export const HorizontalStories: React.FC = () => {
  const railRef = useRef<HTMLDivElement>(null);
  const { feed } = useCatalogFeed();

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
        colors: p.colors,
        colorName: p.colors[0]?.name ?? '',
      };
    });

    for (const item of feed.items.slice(0, 4)) {
      const known = merged.some(
        (m) =>
          m.code === item.squareItemId.toUpperCase().slice(-8) ||
          m.name.replace(/\s+/g, '').toUpperCase() === item.name.replace(/\s+/g, '').toUpperCase()
      );
      if (!known && merged.length < 6) {
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
          colors: [],
          colorName: 'Colorway',
        });
      }
    }

    return merged.slice(0, 6);
  }, [feed]);

  const scrollBy = (delta: number) => {
    railRef.current?.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <section
      id="drop"
      className="relative bg-black text-bone py-24 sm:py-32 lg:py-40 border-t border-hairline overflow-hidden"
    >
      {/* Header */}
      <div className="max-w-[1760px] mx-auto px-5 sm:px-8 md:px-12 pb-10 sm:pb-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center gap-4">
              <span className="folio text-gold">Chapter II</span>
              <span className="text-bone/20">—</span>
              <span className="folio text-bone/50">The Drop</span>
            </div>
            <h2 className="font-display-tight text-[13vw] sm:text-[10vw] lg:text-[8vw] leading-[0.88] tracking-[-0.005em] text-bone">
              Two pieces.
              <br />
              <span
                className="italic text-hollow-gold"
                style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic", fontWeight: 400 }}
              >
                One uniform.
              </span>
            </h2>
            <p
              className="text-xl sm:text-2xl text-bone/70 max-w-xl leading-snug"
              style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
            >
              Capsule 001 — heavyweight cotton shorts in two colorways, available in limited allocation.
            </p>
          </div>

          {/* Scroll controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollBy(-520)}
              className="w-12 h-12 border border-line-strong rounded-full flex items-center justify-center text-bone hover:border-gold hover:text-gold transition-colors"
              aria-label="Scroll left"
              data-cursor="view"
              data-cursor-label="Prev"
            >
              <ArrowLeft size={16} strokeWidth={1.2} />
            </button>
            <button
              onClick={() => scrollBy(520)}
              className="w-12 h-12 border border-line-strong rounded-full flex items-center justify-center text-bone hover:border-gold hover:text-gold transition-colors"
              aria-label="Scroll right"
              data-cursor="view"
              data-cursor-label="Next"
            >
              <ArrowRight size={16} strokeWidth={1.2} />
            </button>
            <Link to="/shop" className="link-arrow text-bone/70 hover:text-gold ml-2 sm:ml-4">
              Full catalog <ArrowUpRight size={14} className="arrow-icon" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Horizontal rail */}
      <div
        ref={railRef}
        className="h-scroll flex gap-5 sm:gap-7 px-5 sm:px-8 md:px-12 pb-6 overflow-x-auto cursor-grab active:cursor-grabbing"
        style={{ scrollPaddingLeft: '2rem' }}
      >
        {items.map((item, i) => (
          <Link
            key={item.code}
            to={item.slug ? `/shop/${item.slug}` : '/shop'}
            className="group shrink-0 w-[78vw] sm:w-[58vw] md:w-[42vw] lg:w-[34vw] xl:w-[30vw] max-w-[480px]"
            data-cursor="view"
            data-cursor-label="View Piece"
          >
            <motion.article
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: i * 0.05 }}
              className="relative"
            >
              {/* Numbered plate tag */}
              <div className="flex items-baseline justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span
                    className="text-2xl text-gold leading-none"
                    style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic", letterSpacing: "0.02em" }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-bone/40">
                    / Plate {item.code.slice(-3)}
                  </span>
                </div>
                {item.soldOut && (
                  <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-bone/50 border border-bone/20 px-2 py-1">
                    Allocation closed
                  </span>
                )}
              </div>

              <div className="relative aspect-[4/5] overflow-hidden bg-ink">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover img-bw transition-transform duration-[1400ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 overlay-bottom opacity-60" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div className="space-y-1">
                    <div className="folio text-gold">
                      {item.colorName.split('/')[0]?.trim()}
                    </div>
                    <div
                      className="text-lg sm:text-xl text-bone leading-none"
                      style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic", letterSpacing: "0.02em" }}
                    >
                      {item.sizeLine}
                    </div>
                  </div>
                  {!item.soldOut && item.stock <= 4 && (
                    <span className="font-mono text-[9px] tracking-[0.24em] uppercase text-gold border border-gold/40 px-2 py-1 bg-black/70">
                      Low Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Below image */}
              <div className="pt-5 space-y-2">
                <div className="flex items-baseline justify-between gap-4">
                  <h3
                    className="text-3xl sm:text-4xl text-bone group-hover:text-gold transition-colors duration-500 leading-none uppercase"
                    style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic", letterSpacing: "0.02em" }}
                  >
                    {item.name}
                  </h3>
                  <span
                    className="text-xl text-bone shrink-0 leading-none"
                    style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
                  >
                    {formatCurrency(item.price)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-bone/40">
                    Sizes {item.sizeLine}
                  </span>
                  <span className="link-arrow text-[10px] text-bone/50 group-hover:text-gold">
                    View <ArrowUpRight size={11} className="arrow-icon" />
                  </span>
                </div>
              </div>
            </motion.article>
          </Link>
        ))}

        {/* End card */}
        <Link
          to="/shop"
          className="shrink-0 w-[60vw] sm:w-[42vw] md:w-[34vw] lg:w-[28vw] xl:w-[24vw] max-w-[420px] aspect-[4/5] border border-line-strong flex flex-col items-center justify-center p-8 hover:border-gold transition-colors group"
          data-cursor="view"
          data-cursor-label="View All"
        >
          <span className="folio text-gold mb-6">End of rail</span>
          <h3
            className="text-4xl sm:text-5xl text-bone text-center leading-[0.92] uppercase group-hover:text-gold transition-colors"
            style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic", letterSpacing: "0.01em" }}
          >
            View full
            <br />
            catalog
          </h3>
          <span className="mt-6 w-10 h-10 border border-bone/30 rounded-full flex items-center justify-center group-hover:border-gold group-hover:text-gold transition-colors">
            <ArrowUpRight size={16} />
          </span>
        </Link>
      </div>
    </section>
  );
};
