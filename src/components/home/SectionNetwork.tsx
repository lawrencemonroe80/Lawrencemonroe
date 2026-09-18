import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Aperture, Radio, ShoppingBag, FileText } from 'lucide-react';
import { useCatalogFeed } from '../../services/squareCatalog';
import { formatCurrency } from '../../utils/format';
import { revealUp } from '../../motion/tokens';
import { Magnetic } from '../common/Magnetic';

/**
 * SECTION — THE NETWORK (capsule drop + inner-page transitions)
 * ------------------------------------------------------------
 * Index-page connector: the featured capsule (top items with live
 * Square pricing/stock) plus the four dynamic transition links into
 * the inner pages — SHOP / VAULT / TELEMETRY / MANIFESTO.
 */

const NETWORK_LINKS = [
  {
    to: '/shop',
    code: 'CAT-001',
    title: 'THE SHOP',
    subtitle: 'ACTIVE CATALOG / SQUARE LIVE',
    image: '/images/shorts-001-cutout.jpg',
    icon: <ShoppingBag size={13} />,
  },
  {
    to: '/vault',
    code: 'ARC-001',
    title: 'THE VAULT',
    subtitle: 'EDITORIAL ARCHIVE / SANITY LIVE',
    image: '/images/campaign-contact-fabric.jpg',
    icon: <Aperture size={13} />,
  },
  {
    to: '/telemetry',
    code: 'TEL-001',
    title: 'THE TELEMETRY',
    subtitle: 'RAW FEEDS / INSTAGRAM LIVE',
    image: '/images/campaign-contact-stride.jpg',
    icon: <Radio size={13} />,
  },
  {
    to: '/about',
    code: 'DOC-001',
    title: 'THE MANIFESTO',
    subtitle: 'BRAND DOCUMENT / HIGH TYPOGRAPHY',
    image: '/images/campaign-hero-motion.jpg',
    icon: <FileText size={13} />,
  },
];

export const SectionNetwork: React.FC = () => {
  const { feed } = useCatalogFeed();

  // Featured capsule drop: top items (bundled + live Square stock).
  // Empty slots render as sealed placeholders so the strip always reads 4-wide.
  const capsule = feed.items.slice(0, 4);
  const sealedSlots = Math.max(0, 4 - capsule.length);

  return (
    <section id="network" className="relative w-full bg-black text-bone py-24 sm:py-32 border-b border-line overflow-hidden">
      <div className="absolute inset-0 bg-archival-grid opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-line pb-6 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gold inline-block" />
              <span className="font-mono text-xs text-gold tracking-[0.25em] uppercase font-bold">
                THE NETWORK / INDEX 001
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl uppercase text-bone">
              ENTER THE SYSTEM.
            </h2>
          </div>
          <p className="font-mono text-[11px] text-smoke tracking-[0.15em] uppercase text-left md:text-right leading-relaxed">
            CAPSULE DROP + FOUR CHANNELS
            <br />
            ALL PRICING SYNCED TO SQUARE
          </p>
        </div>

        {/* Featured capsule drop strip */}
        <motion.div
          variants={revealUp(0.05)}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 border border-line bg-graphite/30 mb-12"
        >
          {capsule.map((item, i) => (
            <Link
              key={item.squareItemId}
              to="/shop"
              data-cursor="view"
              data-cursor-label="VIEW CAPSULE"
              className={`group p-4 sm:p-5 hover:bg-graphite/60 transition-colors ${
                i > 0 ? 'border-l border-line' : ''
              } ${i > 1 ? 'border-t lg:border-t-0 border-line' : ''}`}
            >
              <div className="flex items-center justify-between font-mono text-[9px] text-smoke tracking-[0.2em] mb-3">
                <span className="text-gold font-bold">00{i + 1}</span>
                <span>{item.available ? `${item.maxStock} IN STOCK` : 'SOLD OUT'}</span>
              </div>
              <div className="font-display text-sm sm:text-base font-bold text-bone group-hover:text-gold transition-colors uppercase leading-tight">
                {item.name}
              </div>
              <div className="font-mono text-xs text-smoke mt-2">
                {formatCurrency(item.minPriceCents / 100)}
                <span className="mx-1.5 text-line">|</span>
                <span className="text-smoke/60">
                  {item.variations.length} SIZE{item.variations.length === 1 ? '' : 'S'}
                </span>
              </div>
            </Link>
          ))}
          {Array.from({ length: sealedSlots }).map((_, i) => (
            <div
              key={`sealed-${i}`}
              className={`p-4 sm:p-5 ${capsule.length + i > 0 ? 'border-l border-line' : ''} ${capsule.length + i > 1 ? 'border-t lg:border-t-0 border-line' : ''}`}
            >
              <div className="flex items-center justify-between font-mono text-[9px] text-smoke/60 tracking-[0.2em] mb-3">
                <span>00{capsule.length + i + 1}</span>
                <span>SEALED</span>
              </div>
              <div className="font-display text-sm sm:text-base font-bold text-smoke/50 uppercase leading-tight">
                NEXT ALLOCATION
              </div>
              <div className="font-mono text-xs text-smoke/50 mt-2">TBA</div>
            </div>
          ))}
        </motion.div>

        {/* Transition links grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {NETWORK_LINKS.map((link, i) => (
            <motion.div key={link.to} variants={revealUp(0.1 + i * 0.06)} initial="hidden" animate="visible">
              <Magnetic strength={0.12}>
                <Link
                  to={link.to}
                  data-cursor="view"
                  className="group relative block border border-line bg-graphite/40 hover:border-gold transition-colors overflow-hidden"
                >
                  {/* Ghost plate behind */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-25 transition-opacity duration-700">
                    <img src={link.image} alt="" className="w-full h-full object-cover grayscale contrast-125" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                  <div className="relative p-5 sm:p-6 h-full flex flex-col justify-between gap-8 min-h-[180px]">
                    <div className="flex items-center justify-between font-mono text-[9px] tracking-[0.2em] text-smoke uppercase">
                      <span className="inline-flex items-center gap-1.5 text-gold font-bold">
                        {link.icon}
                        {link.code}
                      </span>
                      <ArrowUpRight
                        size={14}
                        className="text-smoke group-hover:text-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                      />
                    </div>
                    <div>
                      <div className="font-serif font-bold uppercase text-2xl sm:text-3xl text-bone group-hover:text-paper transition-colors leading-none">
                        {link.title}
                      </div>
                      <div className="font-mono text-[9px] text-smoke tracking-[0.2em] uppercase mt-2">
                        {link.subtitle}
                      </div>
                    </div>
                  </div>
                </Link>
              </Magnetic>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
