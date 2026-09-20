import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ArrowUpRight, Camera, Layers, Aperture } from 'lucide-react';
import { useVaultStories, VaultSource } from '../services/sanityVault';
import { OptimizedImage } from '../components/common/OptimizedImage';
import { TiltCard } from '../components/common/TiltCard';
import { RELEASED_PRODUCTS } from '../data/products';
import type { VaultCategory, VaultStory } from '../types';

/**
 * THE PLATES — /vault
 * Editorial archive: featured dossier + asymmetric grid + glass modal.
 */

const CATEGORY_ICON: Record<VaultCategory, React.ReactNode> = {
  CAMPAIGN: <Aperture size={11} strokeWidth={1.5} />,
  'GEN EFFECTS': <Layers size={11} strokeWidth={1.5} />,
  'SILVER-GELATIN': <Camera size={11} strokeWidth={1.5} />,
};

const FILTERS: ('ALL' | VaultCategory)[] = ['ALL', 'CAMPAIGN', 'GEN EFFECTS', 'SILVER-GELATIN'];

const stamp = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).toUpperCase();

export const VaultPage: React.FC = () => {
  const { stories, source } = useVaultStories();
  const [filter, setFilter] = useState<'ALL' | VaultCategory>('ALL');
  const [openStory, setOpenStory] = useState<VaultStory | null>(null);

  const filtered = filter === 'ALL' ? stories : stories.filter((s) => s.category === filter);
  const featured = filtered.find((s) => s.featured) ?? filtered[0];
  const rest = filtered.filter((s) => s.id !== featured?.id);

  useEffect(() => {
    document.body.style.overflow = openStory ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [openStory]);

  const linkedProducts = (story: VaultStory) =>
    RELEASED_PRODUCTS.filter((p) => story.linkedSquareItemIds.includes(p.id));

  return (
    <div className="relative bg-black text-bone pt-24 sm:pt-32 pb-24 min-h-screen">
      <div className="max-w-[1760px] mx-auto px-5 sm:px-8 md:px-12">
        {/* ─── HEADER ─── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 pb-10 sm:pb-14 border-b border-hairline"
        >
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-4">
              <span className="folio text-gold">Page 10 — The Plates</span>
              <span className="text-bone/20">—</span>
              <span className="folio text-bone/50">Editorial Archive</span>
            </div>
            <h1 className="font-display-tight text-[15vw] sm:text-[11vw] lg:text-[9vw] leading-[0.84] tracking-[-0.005em]">
              The{' '}
              <span
                className="italic text-gold-shine"
                style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic", fontWeight: 400 }}
              >
                plates.
              </span>
            </h1>
            <p
              className="text-xl sm:text-2xl text-bone/70 max-w-xl leading-snug"
              style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
            >
              Campaign lookbooks, process artifacts, and silver-gelatin photographic stories from the studio.
            </p>
          </div>

          <div className="lg:col-span-4 space-y-6 lg:pt-6">
            <div className="border border-hairline px-4 py-3 flex items-center gap-2 w-fit">
              <span className={`w-1.5 h-1.5 ${source === 'SANITY' ? 'bg-gold animate-pulse-subtle' : 'bg-bone/40'}`} />
              <span className="folio">{source === 'SANITY' ? 'Sanity Studio — Live' : 'Local Archive — Studio Offline'}</span>
            </div>
            <div className="space-y-2 text-sm text-bone/50 leading-relaxed">
              <p>
                Each plate is a published entry — campaign photography, generative process studies, or 35mm silver-gelatin originals.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3"
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`chip ${filter === f ? 'is-active' : ''}`}
            >
              {f !== 'ALL' && CATEGORY_ICON[f as VaultCategory]}
              <span>{f === 'ALL' ? 'All Plates' : f.charAt(0) + f.slice(1).toLowerCase().replace('-', ' ')}</span>
            </button>
          ))}
          <span className="ml-auto folio text-bone/40">
            {filtered.length} plate{filtered.length === 1 ? '' : 's'} on file
          </span>
        </motion.div>

        {/* ─── FEATURED DOSSIER ─── */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 sm:mt-20"
          >
            <TiltCard maxTilt={2} className="block">
              <article
                className="group grid grid-cols-1 lg:grid-cols-12 gap-0 border border-hairline hover:border-gold transition-colors cursor-pointer"
                onClick={() => setOpenStory(featured)}
                data-cursor="view"
                data-cursor-label="Explore"
              >
                <div className="lg:col-span-8 relative aspect-[4/3] lg:aspect-auto lg:min-h-[560px] overflow-hidden bg-ink">
                  <OptimizedImage
                    src={featured.coverImage}
                    alt={featured.title}
                    className="absolute inset-0 w-full h-full object-cover img-mono group-hover:scale-[1.03] transition-transform duration-[1400ms]"
                  />
                  <div className="absolute inset-0 overlay-bottom opacity-80" />
                  <div className="absolute top-5 left-5 flex items-center gap-2">
                    <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-gold border border-gold/60 px-2.5 py-1 bg-black/70">
                      Featured
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-bone/70 px-2.5 py-1 border border-bone/30 bg-black/70">
                      {featured.category}
                    </span>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="folio text-bone/50 mb-2">Cover plate</div>
                    <h2
                      className="text-4xl sm:text-6xl lg:text-7xl text-bone leading-[0.92] tracking-[-0.005em] uppercase"
                      style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
                    >
                      {featured.title}
                    </h2>
                  </div>
                </div>
                <div className="lg:col-span-4 p-8 lg:p-12 flex flex-col justify-between gap-8 bg-black">
                  <div className="space-y-6">
                    <div className="folio text-gold">{stamp(featured.publishedAt)}</div>
                    <p
                      className="text-xl sm:text-2xl text-bone/85 leading-snug"
                      style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
                    >
                      {featured.summary}
                    </p>
                  </div>
                  <div className="space-y-4 pt-6 border-t border-hairline">
                    <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-bone/40 space-y-1">
                      {featured.credits.map((c) => (
                        <div key={c}>{c}</div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="folio text-bone/50">{featured.gallery.length} plates</span>
                      <span className="link-arrow text-bone group-hover:text-gold">
                        Open Plate <ArrowUpRight size={14} className="arrow-icon" />
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </TiltCard>
          </motion.div>
        )}

        {/* ─── ASYMMETRIC GRID ─── */}
        <div className="mt-16 sm:mt-24 grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
          {rest.map((story, i) => (
            <motion.article
              key={story.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, delay: (i % 4) * 0.05 }}
              onClick={() => setOpenStory(story)}
              data-cursor="view"
              data-cursor-label="Explore"
              className={`group cursor-pointer border border-hairline hover:border-gold transition-colors flex flex-col bg-black ${
                i % 5 === 0 ? 'md:col-span-7' : i % 5 === 1 ? 'md:col-span-5' : i % 5 === 2 ? 'md:col-span-5' : i % 5 === 3 ? 'md:col-span-7' : 'md:col-span-12'
              }`}
            >
              <div className={`relative overflow-hidden bg-ink ${i % 5 === 4 ? 'aspect-[21/9]' : 'aspect-[4/3]'}`}>
                <OptimizedImage
                  src={story.coverImage}
                  alt={story.title}
                  className="absolute inset-0 w-full h-full object-cover img-mono group-hover:scale-[1.04] transition-transform duration-[1400ms]"
                />
                <div className="absolute inset-0 overlay-bottom opacity-80" />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="font-mono text-[9px] tracking-[0.28em] uppercase text-bone border border-bone/30 bg-black/70 px-2 py-1 flex items-center gap-1.5">
                    {CATEGORY_ICON[story.category]}
                    {story.category}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 font-mono text-[9px] tracking-[0.24em] text-bone/60 bg-black/70 px-2 py-1 border border-hairline">
                  {stamp(story.publishedAt)}
                </div>
              </div>
              <div className="p-6 lg:p-8 flex items-start justify-between gap-4 flex-1">
                <div className="space-y-2 flex-1">
                  <h3
                    className="text-2xl sm:text-3xl text-bone group-hover:text-gold transition-colors leading-[0.92] uppercase"
                    style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
                  >
                    {story.title}
                  </h3>
                  <p
                    className="text-sm text-bone/55 leading-relaxed line-clamp-2"
                    style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
                  >
                    {story.summary}
                  </p>
                </div>
                <ArrowUpRight
                  size={18}
                  strokeWidth={1.2}
                  className="shrink-0 text-bone/40 group-hover:text-gold group-hover:translate-x-1 group-hover:-translate-y-1 transition-all mt-1"
                />
              </div>
            </motion.article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-12 border border-hairline bg-black p-16 text-center">
            <div className="folio text-bone/40 mb-3">No documents</div>
            <p className="text-bone/50">No plates on file for this category yet.</p>
          </div>
        )}
      </div>

      {/* ─── DOSSIER MODAL ─── */}
      <AnimatePresence>
        {openStory && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8" role="dialog" aria-modal="true">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => setOpenStory(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 12 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="glass-heavy relative z-10 w-full max-w-5xl max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <button
                onClick={() => setOpenStory(null)}
                className="absolute top-5 right-5 z-20 p-2 text-bone/60 hover:text-gold transition-colors"
                aria-label="Close"
              >
                <X size={20} strokeWidth={1.2} />
              </button>

              <div className="relative aspect-[21/9] overflow-hidden bg-ink">
                <OptimizedImage
                  src={openStory.coverImage}
                  alt={openStory.title}
                  className="w-full h-full object-cover img-mono"
                  loading="eager"
                />
                <div className="absolute inset-0 overlay-cinema opacity-80" />
                <div className="absolute bottom-6 left-6 sm:left-10 right-16">
                  <div className="flex items-center gap-2 mb-3 font-mono text-[10px] text-gold tracking-[0.28em] uppercase">
                    {CATEGORY_ICON[openStory.category]}
                    {openStory.category} — {stamp(openStory.publishedAt)}
                  </div>
                  <h2
                    className="text-4xl sm:text-6xl text-bone leading-[0.92] tracking-[-0.005em] uppercase"
                    style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
                  >
                    {openStory.title}
                  </h2>
                </div>
              </div>

              <div className="p-6 sm:p-12 space-y-10">
                <p
                  className="text-2xl sm:text-3xl text-bone/85 leading-snug max-w-3xl"
                  style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
                >
                  {openStory.summary}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {openStory.gallery.map((plate) => (
                    <figure key={plate.src} className="border border-hairline bg-ink overflow-hidden group/plate">
                      <div className="aspect-[4/5] overflow-hidden">
                        <OptimizedImage
                          src={plate.src}
                          alt={plate.label || openStory.title}
                          className="w-full h-full object-cover img-mono group-hover/plate:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <figcaption className="px-2 py-1.5 font-mono text-[9px] tracking-[0.22em] text-bone/40 uppercase border-t border-hairline">
                        {plate.label}
                      </figcaption>
                    </figure>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-t border-hairline pt-8">
                  <div className="font-mono text-[10px] text-bone/40 tracking-[0.22em] uppercase space-y-1">
                    {openStory.credits.map((c) => (
                      <div key={c}>{c}</div>
                    ))}
                  </div>
                  {linkedProducts(openStory).length > 0 && (
                    <div className="space-y-3">
                      <div className="folio text-gold">Shop the story</div>
                      <div className="flex flex-wrap gap-2">
                        {linkedProducts(openStory).map((p) => (
                          <Link
                            key={p.id}
                            to={`/shop/${p.slug}`}
                            onClick={() => setOpenStory(null)}
                            className="link-arrow text-bone hover:text-gold"
                          >
                            {p.name} <ArrowUpRight size={12} className="arrow-icon" />
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
