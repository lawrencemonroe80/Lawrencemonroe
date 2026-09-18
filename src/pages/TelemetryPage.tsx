import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Instagram, ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useRawFeed, relativeStamp } from '../services/rawFeed';
import { hydrateTags, tagHref } from '../services/squareCatalog';
import { VelocityText } from '../components/common/VelocityText';
import { OptimizedImage } from '../components/common/OptimizedImage';
import { formatCurrency } from '../utils/format';
import { EASE, revealUp } from '../motion/tokens';
import type { FeedAspect, RawFeedPost } from '../types';

/**
 * THE TELEMETRY — /telemetry
 * --------------------------
 * Live social & community hub (RAW FEEDS). The official @LawrenceMonroe
 * feed streams through `/api/instagram` (Instagram Graph API or Behold —
 * token server-side only) and merges with the curated community archive.
 *
 * Interactions:
 *   - Asymmetrical editorial grid (tall / wide / square spans, dense flow)
 *   - Hover: zoom + color return, caption dossier, timestamps, tags
 *   - Magnetic cursor states: "VIEW POST" on tiles
 *   - Click: glass light-box viewer — high-res plate, full caption, live
 *     SHOP THE LOOK chips mapped to Square Item IDs, prev/next + keyboard
 */

const SPAN: Record<FeedAspect, string> = {
  tall: 'col-span-1 row-span-2 md:col-span-2 md:row-span-2',
  wide: 'col-span-2 md:col-span-3 md:row-span-1',
  square: 'col-span-1 md:col-span-2 md:row-span-1',
};

const FeedTile: React.FC<{
  post: RawFeedPost;
  index: number;
  onOpen: () => void;
}> = ({ post, index, onOpen }) => {
  const tags = hydrateTags(post.tags);

  return (
    <motion.figure
      variants={revealUp(Math.min(index * 0.04, 0.4))}
      initial="hidden"
      animate="visible"
      onClick={onOpen}
      data-cursor="view"
      data-cursor-label="VIEW POST"
      className={`group relative overflow-hidden border border-line bg-graphite/50 hover:border-gold/60 transition-colors cursor-pointer ${SPAN[post.aspect]}`}
    >
      {/* Media plate — hover zoom reveals grain/fabric detail */}
      <div className="absolute inset-0 overflow-hidden">
        <OptimizedImage
          src={post.image}
          alt={post.alt}
          className="w-full h-full object-cover grayscale contrast-125 brightness-90 scale-100 group-hover:scale-[1.05] group-hover:brightness-105 group-hover:grayscale-[0.35] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          draggable={false}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30" />

      {/* Top meta rail */}
      <div className="absolute top-0 inset-x-0 flex items-center justify-between p-2.5">
        <div className="flex items-center gap-1.5 bg-black/75 backdrop-blur-[4px] px-2 py-0.5 border border-line/60">
          {post.isOfficial ? (
            <>
              <Instagram size={10} className="text-gold" />
              <span className="font-mono text-[8px] tracking-[0.15em] text-gold font-bold uppercase">
                @{post.handle}
              </span>
            </>
          ) : (
            <span className="font-mono text-[8px] tracking-[0.15em] text-smoke uppercase">@{post.handle}</span>
          )}
        </div>
        <span className="font-mono text-[8px] tracking-[0.15em] text-smoke/90 bg-black/75 px-2 py-0.5 border border-line/50 uppercase">
          {relativeStamp(post.postedAt)}
        </span>
      </div>

      {/* Caption dossier (hover lift) */}
      <figcaption className="absolute bottom-0 inset-x-0 p-3 space-y-2.5 translate-y-2 opacity-90 group-hover:translate-y-0 group-hover:opacity-100 transition-transform duration-500">
        <p className="font-utility text-[11px] leading-snug text-bone/90 line-clamp-2">{post.caption}</p>

        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-3 font-mono text-[9px] text-smoke tracking-[0.12em] uppercase">
            {typeof post.likes === 'number' && (
              <span className="inline-flex items-center gap-1">
                <Heart size={9} className="text-gold" /> {post.likes.toLocaleString()}
              </span>
            )}
            {post.permalink && (
              <a
                href={post.permalink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-0.5 text-smoke hover:text-gold transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                SOURCE <ArrowUpRight size={9} />
              </a>
            )}
          </div>

          {/* SHOP THE LOOK tags → Square items */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <a
                  key={tag.squareItemId}
                  href={tagHref(tag)}
                  onClick={(e) => e.stopPropagation()}
                  className="font-mono text-[8px] font-bold tracking-[0.15em] uppercase border border-gold/70 text-bone bg-black/70 hover:bg-gold hover:text-black px-2 py-1 transition-colors"
                >
                  SHOP — {tag.name}
                  {tag.priceCents ? ` / ${formatCurrency(tag.priceCents / 100)}` : ''}
                </a>
              ))}
            </div>
          )}
        </div>
      </figcaption>
    </motion.figure>
  );
};

/* ---------------- LIGHT-BOX VIEWER ---------------- */

const FeedLightbox: React.FC<{
  posts: RawFeedPost[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}> = ({ posts, index, onIndex, onClose }) => {
  const post = posts[index];
  const tags = hydrateTags(post.tags);

  const prev = useCallback(() => onIndex((index - 1 + posts.length) % posts.length), [index, posts.length, onIndex]);
  const next = useCallback(() => onIndex((index + 1) % posts.length), [index, posts.length, onIndex]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8" role="dialog" aria-modal="true" aria-label="Telemetry lightbox">
      {/* Backdrop — glass blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.32, ease: EASE.aperture }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-[20px]"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 26, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, scale: 0.94, y: 14, filter: 'blur(8px)' }}
        transition={{ duration: 0.5, ease: EASE.cinematicOut }}
        className="glass-panel-heavy relative z-10 w-full max-w-5xl max-h-[90vh] flex flex-col lg:flex-row overflow-hidden"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/80 border border-line p-2 text-bone hover:text-gold hover:border-gold transition-colors"
          aria-label="Close viewer"
        >
          <X size={18} />
        </button>

        {/* High-res plate */}
        <div className="lg:w-3/5 relative bg-black flex items-center justify-center min-h-[320px] lg:min-h-[540px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 1.015, filter: 'blur(6px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.02, filter: 'blur(4px)' }}
              transition={{ duration: 0.35, ease: EASE.noirSnap }}
              className="absolute inset-0 flex items-center justify-center p-4"
            >
              <OptimizedImage
                src={post.image}
                alt={post.alt}
                className="max-h-[70vh] w-auto max-w-full object-contain contrast-110"
                loading="eager"
                sizes="(max-width: 1024px) 92vw, 55vw"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>

          {/* Prev / Next */}
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/70 border border-line hover:border-gold text-bone hover:text-gold p-2 transition-colors z-10"
            aria-label="Previous frame"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/70 border border-line hover:border-gold text-bone hover:text-gold p-2 transition-colors z-10"
            aria-label="Next frame"
          >
            <ChevronRight size={18} />
          </button>

          {/* Frame stamp */}
          <div className="absolute bottom-3 left-3 font-mono text-[9px] bg-black/80 px-2 py-1 border border-line text-gold tracking-[0.2em]">
            FRAME {String(index + 1).padStart(2, '0')} / {String(posts.length).padStart(2, '0')}
          </div>
        </div>

        {/* Caption dossier */}
        <div className="lg:w-2/5 p-6 sm:p-8 flex flex-col justify-between gap-6 overflow-y-auto no-scrollbar border-t lg:border-t-0 lg:border-l border-line">
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              {post.isOfficial ? <Instagram size={13} className="text-gold" /> : null}
              <span className={`font-mono text-[11px] tracking-[0.15em] uppercase font-bold ${post.isOfficial ? 'text-gold' : 'text-smoke'}`}>
                @{post.handle}
              </span>
              <span className="text-line">|</span>
              <span className="font-mono text-[10px] text-smoke tracking-[0.12em] uppercase">
                {new Date(post.postedAt).toLocaleString('en-US', {
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            <p className="font-utility text-sm text-bone/90 leading-relaxed">{post.caption}</p>

            {typeof post.likes === 'number' && (
              <div className="inline-flex items-center gap-2 font-mono text-[11px] text-smoke border border-line px-3 py-1.5">
                <Heart size={11} className="text-gold" /> {post.likes.toLocaleString()} SIGNALS
              </div>
            )}
          </div>

          {/* SHOP THE LOOK → Square items */}
          {tags.length > 0 && (
            <div className="space-y-2.5 border-t border-line pt-5">
              <div className="font-mono text-[9px] text-gold tracking-[0.25em] uppercase font-bold">
                Shop the look — Square catalog
              </div>
              <div className="flex flex-col gap-2">
                {tags.map((tag) => (
                  <a
                    key={tag.squareItemId}
                    href={tagHref(tag)}
                    onClick={onClose}
                    className="flex items-center justify-between font-mono text-[11px] font-bold tracking-[0.15em] uppercase border border-gold/60 text-bone hover:bg-gold hover:text-black px-3.5 py-2.5 transition-colors"
                  >
                    <span>{tag.name}</span>
                    <span>{tag.priceCents ? formatCurrency(tag.priceCents / 100) : 'VIEW →'}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Footer actions */}
          <div className="flex items-center justify-between border-t border-line pt-4">
            <span className="font-mono text-[9px] text-smoke tracking-[0.2em] uppercase">
              {post.isOfficial ? 'OFFICIAL TELEMETRY' : 'CURATED COMMUNITY'}
            </span>
            {post.permalink && (
              <a
                href={post.permalink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-bone hover:text-gold transition-colors"
              >
                View on Instagram <ArrowUpRight size={11} />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/* ---------------- PAGE ---------------- */

export const TelemetryPage: React.FC = () => {
  const { posts, source, loading } = useRawFeed();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const officialCount = posts.filter((p) => p.isOfficial).length;

  // Lock scroll while the lightbox is open
  useEffect(() => {
    document.body.style.overflow = openIndex !== null ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [openIndex]);

  return (
    <div className="min-h-screen bg-black text-bone pt-28 sm:pt-36 pb-24 selection:bg-gold selection:text-black">
      <div className="absolute inset-0 bg-archival-grid opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 relative z-10">
        {/* Header */}
        <motion.div variants={revealUp()} initial="hidden" animate="visible" className="border-b border-line pb-8 mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-gold inline-block animate-pulse-subtle" />
                <span className="font-mono text-xs text-gold tracking-[0.25em] uppercase font-bold">
                  RAW FEEDS / SOCIAL TELEMETRY
                </span>
              </div>
              <h1 className="text-5xl sm:text-7xl md:text-8xl uppercase text-bone">
                <VelocityText>THE TELEMETRY</VelocityText>
              </h1>
              <p className="font-serif italic text-lg sm:text-xl text-smoke max-w-xl">
                The official feed and the community archive, tagged to the catalog.
              </p>
            </div>

            <div className="font-mono text-[10px] tracking-[0.18em] uppercase flex items-center gap-4">
              <div className="flex items-center gap-2 border border-line bg-graphite/40 px-3 py-2">
                {source === 'LIVE' ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse-subtle" />
                    <span className="text-gold font-bold">INSTAGRAM / LIVE SYNC</span>
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 bg-smoke" />
                    <span className="text-smoke">CURATED ARCHIVE MODE</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-line/50 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] tracking-[0.2em] text-smoke uppercase">
            <span>
              {officialCount} OFFICIAL / {posts.length - officialCount} COMMUNITY — {posts.length} TOTAL FRAMES
            </span>
            <span className="text-gold/80">HOVER TO INSPECT — CLICK FOR HIGH-RES VIEWER</span>
          </div>
        </motion.div>

        {/* Asymmetrical feed grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 auto-rows-[170px] sm:auto-rows-[210px] md:auto-rows-[240px] grid-flow-row-dense gap-3 sm:gap-4">
          {posts.map((post, i) => (
            <FeedTile key={post.id} post={post} index={i} onOpen={() => setOpenIndex(i)} />
          ))}
        </div>

        {loading && (
          <div className="mt-8 font-mono text-[10px] text-smoke tracking-[0.3em] uppercase text-center animate-pulse-subtle">
            Acquiring signal…
          </div>
        )}

        {/* Footer note */}
        <div className="mt-14 border-t border-line pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="font-mono text-[10px] text-smoke tracking-[0.15em] uppercase leading-relaxed max-w-lg">
            Community frames are curated by the studio. Tag @lawrencemonroe to submit telemetry for review.
          </p>
          <a
            href="https://instagram.com/lawrencemonroe"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-bone hover:text-gold border border-line hover:border-gold px-4 py-2.5 transition-colors"
          >
            <Instagram size={13} /> FOLLOW THE FEED
          </a>
        </div>
      </div>

      {/* Light-box viewer */}
      <AnimatePresence>
        {openIndex !== null && posts[openIndex] && (
          <FeedLightbox
            posts={posts}
            index={openIndex}
            onIndex={setOpenIndex}
            onClose={() => setOpenIndex(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
