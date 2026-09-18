import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Instagram, ArrowUpRight } from 'lucide-react';
import { useRawFeed, relativeStamp } from '../services/rawFeed';
import { hydrateTags, tagHref } from '../services/squareCatalog';
import { VelocityText } from '../components/common/VelocityText';
import { OptimizedImage } from '../components/common/OptimizedImage';
import { formatCurrency } from '../utils/format';
import { revealUp } from '../motion/tokens';
import type { FeedAspect, RawFeedPost } from '../types';

/**
 * THE TELEMETRY — /telemetry
 * --------------------------
 * Live social & community hub. The official @LawrenceMonroe Instagram
 * feed streams through `/api/instagram` (token server-side only) and is
 * merged with the curated community archive. Every post is tagged
 * against the Square catalog — "SHOP THE LOOK" chips link straight to
 * the product page.
 *
 * Grid: asymmetrical editorial spans (tall / wide / square) packed with
 * grid-flow-dense. Hover lifts the caption dossier, restores color, and
 * reveals the product tags.
 */

const SPAN: Record<FeedAspect, string> = {
  tall: 'col-span-1 row-span-2 md:col-span-2 md:row-span-2',
  wide: 'col-span-2 md:col-span-3 md:row-span-1',
  square: 'col-span-1 md:col-span-2 md:row-span-1',
};

const FeedTile: React.FC<{ post: RawFeedPost; index: number }> = ({ post, index }) => {
  const tags = hydrateTags(post.tags);

  return (
    <motion.figure
      variants={revealUp(Math.min(index * 0.04, 0.4))}
      initial="hidden"
      animate="visible"
      className={`group relative overflow-hidden border border-line bg-graphite/50 hover:border-gold/60 transition-colors ${SPAN[post.aspect]}`}
    >
      {/* Media plate */}
      <div className="absolute inset-0">
        <OptimizedImage
          src={post.image}
          alt={post.alt}
          className="w-full h-full object-cover grayscale contrast-125 brightness-90 group-hover:brightness-105 group-hover:grayscale-[0.35] transition-[filter] duration-500"
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

      {/* Corner registration tick */}
      <span className="absolute top-2.5 right-14 w-2 h-2 border-t border-r border-gold/50 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Caption dossier */}
      <figcaption className="absolute bottom-0 inset-x-0 p-3 space-y-2.5 translate-y-2 opacity-90 group-hover:translate-y-0 group-hover:opacity-100 transition-transform duration-400">
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

export const TelemetryPage: React.FC = () => {
  const { posts, source, loading } = useRawFeed();
  const officialCount = posts.filter((p) => p.isOfficial).length;

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
              <AnimatePresence>
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
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-line/50 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] tracking-[0.2em] text-smoke uppercase">
            <span>
              {officialCount} OFFICIAL / {posts.length - officialCount} COMMUNITY — {posts.length} TOTAL FRAMES
            </span>
            <span className="text-gold/80">TAGGED ITEMS LINK DIRECTLY TO THE SQUARE CATALOG</span>
          </div>
        </motion.div>

        {/* Asymmetrical feed grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 auto-rows-[170px] sm:auto-rows-[210px] md:auto-rows-[240px] grid-flow-row-dense gap-3 sm:gap-4">
          {posts.map((post, i) => (
            <FeedTile key={post.id} post={post} index={i} />
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
    </div>
  );
};
