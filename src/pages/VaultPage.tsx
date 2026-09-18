import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ArrowUpRight, Camera, Layers, Aperture } from 'lucide-react';
import { useVaultStories, VaultSource } from '../services/sanityVault';
import { VelocityText } from '../components/common/VelocityText';
import { OptimizedImage } from '../components/common/OptimizedImage';
import { EASE, badgeBlurIn, revealUp } from '../motion/tokens';
import { RELEASED_PRODUCTS } from '../data/products';
import type { VaultCategory, VaultStory } from '../types';

/**
 * THE ARCHIVE — /vault
 * --------------------
 * Editorial vault: campaign lookbooks, "Gen Effects" process assets and
 * silver-gelatin photographic stories. Content is published in Sanity
 * Studio by the site owner (see sanity/schemas.ts); this page renders
 * the live Content Lake when configured and the bundled archive
 * otherwise — identical shape, zero downtime.
 */

const CATEGORY_ICON: Record<VaultCategory, React.ReactNode> = {
  CAMPAIGN: <Aperture size={12} />,
  'GEN EFFECTS': <Layers size={12} />,
  'SILVER-GELATIN': <Camera size={12} />,
};

const FILTERS: ('ALL' | VaultCategory)[] = ['ALL', 'CAMPAIGN', 'GEN EFFECTS', 'SILVER-GELATIN'];

const stamp = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).toUpperCase();

export const VaultPage: React.FC = () => {
  const { stories, source, loading } = useVaultStories();
  const [filter, setFilter] = useState<'ALL' | VaultCategory>('ALL');
  const [openStory, setOpenStory] = useState<VaultStory | null>(null);

  const filtered = filter === 'ALL' ? stories : stories.filter((s) => s.category === filter);
  const featured = filtered.find((s) => s.featured) ?? filtered[0];
  const rest = filtered.filter((s) => s.id !== featured?.id);

  // Lock scroll while the dossier modal is open
  useEffect(() => {
    document.body.style.overflow = openStory ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [openStory]);

  const linkedProducts = (story: VaultStory) =>
    RELEASED_PRODUCTS.filter((p) => story.linkedSquareItemIds.includes(p.id));

  const sourceChip = (s: VaultSource) =>
    s === 'SANITY' ? (
      <>
        <span className="w-1.5 h-1.5 bg-gold animate-pulse-subtle" />
        <span className="text-gold font-bold">SANITY STUDIO / LIVE</span>
      </>
    ) : (
      <>
        <span className="w-1.5 h-1.5 bg-smoke" />
        <span className="text-smoke">LOCAL ARCHIVE / STUDIO OFFLINE</span>
      </>
    );

  return (
    <div className="min-h-screen bg-black text-bone pt-28 sm:pt-36 pb-24 selection:bg-gold selection:text-black">
      <div className="absolute inset-0 bg-archival-grid opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 relative z-10">
        {/* ---- Page header ---- */}
        <motion.div
          variants={revealUp()}
          initial="hidden"
          animate="visible"
          className="border-b border-line pb-8 mb-10 sm:mb-14"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-gold inline-block" />
                <span className="font-mono text-xs text-gold tracking-[0.25em] uppercase font-bold">
                  THE ARCHIVE / EDITORIAL VAULT
                </span>
              </div>
              <h1 className="text-5xl sm:text-7xl md:text-8xl uppercase text-bone">
                <VelocityText>THE VAULT</VelocityText>
              </h1>
              <p className="font-serif italic text-lg sm:text-xl text-smoke max-w-xl">
                Campaign lookbooks, process artifacts, and silver-gelatin stories.
              </p>
            </div>
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase flex items-center gap-2 border border-line bg-graphite/40 px-3 py-2 w-fit">
              {sourceChip(source)}
            </div>
          </div>

          {/* Category filters */}
          <div className="mt-8 pt-6 border-t border-line/50 flex flex-wrap items-center gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors border flex items-center gap-1.5 ${
                  filter === f
                    ? 'border-gold bg-gold text-black font-bold'
                    : 'border-line bg-graphite/40 text-smoke hover:text-bone hover:border-smoke'
                }`}
              >
                {f !== 'ALL' && CATEGORY_ICON[f as VaultCategory]}
                {f}
              </button>
            ))}
            <span className="ml-auto font-mono text-[10px] text-smoke tracking-[0.2em] hidden sm:inline">
              {filtered.length} DOCUMENT{filtered.length === 1 ? '' : 'S'} ON FILE
            </span>
          </div>
        </motion.div>

        {/* ---- Featured dossier ---- */}
        {featured && (
          <motion.article
            variants={revealUp(0.08)}
            initial="hidden"
            animate="visible"
            className="group grid grid-cols-1 lg:grid-cols-12 border border-line bg-graphite/40 mb-10 sm:mb-14 hover:border-gold/60 transition-colors cursor-pointer"
            onClick={() => setOpenStory(featured)}
            data-cursor="view"
            data-cursor-label="EXPLORE"
          >
            <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto lg:min-h-[440px] overflow-hidden">
              <OptimizedImage
                src={featured.coverImage}
                alt={featured.title}
                className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 brightness-90 group-hover:brightness-100 transition-[filter] duration-700"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/80 border border-gold/50 px-2.5 py-1 font-mono text-[9px] tracking-[0.2em] text-gold font-bold uppercase">
                {CATEGORY_ICON[featured.category]}
                FEATURED / {featured.category}
              </div>
            </div>
            <div className="lg:col-span-5 p-7 sm:p-10 flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <div className="font-mono text-[10px] text-smoke tracking-[0.25em]">
                  {stamp(featured.publishedAt)} — DOSSIER {featured.slug.toUpperCase()}
                </div>
                <h2 className="font-serif font-bold uppercase text-3xl sm:text-4xl text-bone leading-[0.95]">
                  {featured.title}
                </h2>
                <p className="font-utility text-sm text-smoke leading-relaxed">{featured.summary}</p>
              </div>
              <div className="space-y-4">
                <div className="font-mono text-[9px] text-smoke/70 tracking-[0.15em] uppercase">
                  {featured.credits.map((c) => (
                    <div key={c}>{c}</div>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-line pt-4">
                  <span className="font-mono text-[10px] text-smoke tracking-[0.2em]">
                    {featured.gallery.length} PLATES
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold tracking-[0.2em] text-bone group-hover:text-gold transition-colors uppercase">
                    Open Dossier <ArrowUpRight size={13} />
                  </span>
                </div>
              </div>
            </div>
          </motion.article>
        )}

        {/* ---- Story grid (asymmetrical) ---- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
          {rest.map((story, i) => (
            <motion.article
              key={story.id}
              variants={revealUp(0.1 + i * 0.05)}
              initial="hidden"
              animate="visible"
              onClick={() => setOpenStory(story)}
              data-cursor="view"
              data-cursor-label="EXPLORE"
              className={`group cursor-pointer border border-line bg-graphite/40 hover:border-gold/60 transition-colors flex flex-col ${
                i % 3 === 1 ? 'md:col-span-5' : 'md:col-span-7'
              } ${i === 0 ? 'md:col-span-12' : ''}`}
            >
              <div className={`relative overflow-hidden ${i === 0 ? 'aspect-[21/9]' : 'aspect-[4/3]'}`}>
                <OptimizedImage
                  src={story.coverImage}
                  alt={story.title}
                  className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 brightness-90 group-hover:scale-[1.03] group-hover:brightness-100 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/80 border border-line px-2 py-0.5 font-mono text-[8px] tracking-[0.2em] text-smoke uppercase">
                  {CATEGORY_ICON[story.category]}
                  {story.category}
                </div>
                <div className="absolute bottom-3 right-3 font-mono text-[9px] text-smoke bg-black/70 px-2 py-0.5 border border-line/50">
                  {stamp(story.publishedAt)}
                </div>
              </div>
              <div className="p-5 sm:p-6 flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="font-serif font-bold uppercase text-xl sm:text-2xl text-bone group-hover:text-gold transition-colors leading-tight">
                    {story.title}
                  </h3>
                  <p className="font-utility text-xs text-smoke leading-relaxed line-clamp-2">{story.summary}</p>
                </div>
                <ArrowUpRight
                  size={16}
                  className="shrink-0 text-smoke group-hover:text-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all mt-1"
                />
              </div>
            </motion.article>
          ))}
        </div>

        {filtered.length === 0 && !loading && (
          <div className="border border-line bg-graphite/30 p-12 text-center font-mono text-xs text-smoke tracking-[0.2em] uppercase">
            No documents on file for this category yet.
          </div>
        )}
      </div>

      {/* ---- Dossier modal (glass) ---- */}
      <AnimatePresence>
        {openStory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8" role="dialog" aria-modal="true">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.32, ease: EASE.aperture }}
              onClick={() => setOpenStory(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-[20px]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 26, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.94, y: 14, filter: 'blur(8px)' }}
              transition={{ duration: 0.5, ease: EASE.cinematicOut }}
              className="glass-panel-heavy relative z-10 w-full max-w-5xl max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <button
                onClick={() => setOpenStory(null)}
                className="absolute top-4 right-4 z-20 bg-black/80 border border-line p-2 text-bone hover:text-gold hover:border-gold transition-colors"
                aria-label="Close dossier"
              >
                <X size={18} />
              </button>

              {/* Cover plate */}
              <div className="relative aspect-[21/9] overflow-hidden">
                <OptimizedImage
                  src={openStory.coverImage}
                  alt={openStory.title}
                  className="w-full h-full object-cover grayscale contrast-125 brightness-90"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute bottom-5 left-6 sm:left-10 right-6">
                  <div className="flex items-center gap-2 font-mono text-[10px] text-gold tracking-[0.25em] uppercase font-bold mb-2">
                    {CATEGORY_ICON[openStory.category]}
                    {openStory.category} — {stamp(openStory.publishedAt)}
                  </div>
                  <h2 className="font-serif font-bold uppercase text-3xl sm:text-5xl text-bone leading-[0.95]">
                    {openStory.title}
                  </h2>
                </div>
              </div>

              <div className="p-6 sm:p-10 space-y-8">
                <p className="font-serif italic text-lg sm:text-xl text-bone/90 leading-relaxed max-w-3xl">
                  {openStory.summary}
                </p>

                {/* Gallery strip */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {openStory.gallery.map((plate) => (
                    <figure key={plate.src} className="border border-line bg-black/60 overflow-hidden group/plate">
                      <div className="aspect-[4/5] overflow-hidden">
                        <OptimizedImage
                          src={plate.src}
                          alt={plate.label || openStory.title}
                          className="w-full h-full object-cover grayscale contrast-125 brightness-90 group-hover/plate:brightness-100 transition-[filter] duration-500"
                        />
                      </div>
                      <figcaption className="px-2 py-1.5 font-mono text-[8px] tracking-[0.18em] text-smoke uppercase border-t border-line">
                        {plate.label}
                      </figcaption>
                    </figure>
                  ))}
                </div>

                {/* Credits + linked items */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-t border-line pt-6">
                  <div className="font-mono text-[9px] text-smoke/70 tracking-[0.15em] uppercase space-y-1">
                    {openStory.credits.map((c) => (
                      <div key={c}>{c}</div>
                    ))}
                  </div>
                  {linkedProducts(openStory).length > 0 && (
                    <div className="space-y-2">
                      <div className="font-mono text-[9px] text-gold tracking-[0.25em] uppercase font-bold">
                        Shop the story
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {linkedProducts(openStory).map((p) => (
                          <Link
                            key={p.id}
                            to={`/shop/${p.slug}`}
                            onClick={() => setOpenStory(null)}
                            className="font-mono text-[10px] tracking-[0.15em] uppercase border border-gold/60 text-bone hover:bg-gold hover:text-black px-3 py-1.5 transition-colors"
                          >
                            {p.name} — ${p.price}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
