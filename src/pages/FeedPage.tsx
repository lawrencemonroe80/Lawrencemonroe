import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Instagram, ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useRawFeed, relativeStamp } from '../services/rawFeed';
import { hydrateTags, tagHref } from '../services/squareCatalog';
import { OptimizedImage } from '../components/common/OptimizedImage';
import { formatCurrency } from '../utils/format';
import type { FeedAspect, RawFeedPost } from '../types';

/**
 * THE FEED — /feed
 * Editorial social hub with asymmetric grid + lightbox viewer.
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
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: Math.min(index * 0.03, 0.4) }}
      onClick={onOpen}
      data-cursor="view"
      data-cursor-label="View Post"
      className={`group relative overflow-hidden border border-hairline bg-black hover:border-gold transition-colors cursor-pointer ${SPAN[post.aspect]}`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <OptimizedImage
          src={post.image}
          alt={post.alt}
          className="w-full h-full object-cover img-mono group-hover:scale-[1.05] group-hover:saturate-100 transition-all duration-[1400ms]"
          draggable={false}
        />
      </div>
      <div className="absolute inset-0 overlay-bottom opacity-70" />

      <div className="absolute top-0 inset-x-0 flex items-center justify-between p-3 sm:p-4">
        <div className="flex items-center gap-2">
          <span className="w-1 h-1 bg-gold inline-block" />
          <span className="font-mono text-[9px] tracking-[0.28em] uppercase text-bone/80">
            @{post.handle}
          </span>
        </div>
        <span className="font-mono text-[9px] tracking-[0.28em] uppercase text-bone/50">
          {relativeStamp(post.postedAt)}
        </span>
      </div>

      <figcaption className="absolute bottom-0 inset-x-0 p-3 sm:p-4 space-y-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
        <p
          className="text-xs text-bone/90 line-clamp-2 leading-snug"
          style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
        >
          {post.caption}
        </p>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-3 font-mono text-[9px] text-bone/60 tracking-[0.22em] uppercase">
            {typeof post.likes === 'number' && (
              <span className="inline-flex items-center gap-1">
                <Heart size={10} className="text-gold" /> {post.likes.toLocaleString()}
              </span>
            )}
            {post.permalink && (
              <a
                href={post.permalink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-0.5 text-bone/60 hover:text-gold transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Source <ArrowUpRight size={9} />
              </a>
            )}
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 1).map((tag) => (
                <a
                  key={tag.squareItemId}
                  href={tagHref(tag)}
                  onClick={(e) => e.stopPropagation()}
                  className="font-mono text-[9px] font-medium tracking-[0.22em] uppercase border border-gold/70 text-bone bg-black/70 hover:bg-gold hover:text-black px-2 py-1 transition-colors"
                >
                  Shop · {tag.name}
                </a>
              ))}
            </div>
          )}
        </div>
      </figcaption>
    </motion.figure>
  );
};

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
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-12" role="dialog" aria-modal="true">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/90 backdrop-blur-xl"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 12 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="glass-heavy relative z-10 w-full max-w-5xl max-h-[90vh] flex flex-col lg:flex-row overflow-hidden"
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 text-bone/60 hover:text-gold transition-colors" aria-label="Close">
          <X size={18} strokeWidth={1.2} />
        </button>

        <div className="lg:w-3/5 relative bg-black flex items-center justify-center min-h-[320px] lg:min-h-[540px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.45 }}
              className="absolute inset-0 flex items-center justify-center p-6"
            >
              <OptimizedImage src={post.image} alt={post.alt} className="max-h-[70vh] w-auto max-w-full object-contain" loading="eager" draggable={false} />
            </motion.div>
          </AnimatePresence>

          <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 text-bone/60 hover:text-gold z-10" aria-label="Previous">
            <ChevronLeft size={22} strokeWidth={1} />
          </button>
          <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-bone/60 hover:text-gold z-10" aria-label="Next">
            <ChevronRight size={22} strokeWidth={1} />
          </button>

          <div className="absolute bottom-3 left-3 font-mono text-[10px] tracking-[0.28em] uppercase text-gold">
            Frame {String(index + 1).padStart(2, '0')} / {String(posts.length).padStart(2, '0')}
          </div>
        </div>

        <div className="lg:w-2/5 p-8 lg:p-10 flex flex-col justify-between gap-6 overflow-y-auto no-scrollbar border-t lg:border-t-0 lg:border-l border-hairline">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              {post.isOfficial && <Instagram size={14} className="text-gold" strokeWidth={1.5} />}
              <span className={`font-mono text-[10px] tracking-[0.28em] uppercase ${post.isOfficial ? 'text-gold' : 'text-bone/50'}`}>
                @{post.handle}
              </span>
              <span className="text-bone/30">·</span>
              <span className="font-mono text-[10px] text-bone/40 tracking-[0.22em] uppercase">
                {new Date(post.postedAt).toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
              </span>
            </div>

            <p
              className="text-base text-bone/80 leading-relaxed"
              style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
            >
              {post.caption}
            </p>

            {typeof post.likes === 'number' && (
              <div className="inline-flex items-center gap-2 font-mono text-[10px] text-bone/60 border border-hairline px-3 py-1.5 tracking-[0.22em] uppercase">
                <Heart size={11} className="text-gold" strokeWidth={1.5} /> {post.likes.toLocaleString()} signals
              </div>
            )}
          </div>

          {tags.length > 0 && (
            <div className="space-y-3 border-t border-hairline pt-5">
              <div className="folio text-gold">Shop the look</div>
              <div className="flex flex-col gap-2">
                {tags.map((tag) => (
                  <a
                    key={tag.squareItemId}
                    href={tagHref(tag)}
                    onClick={onClose}
                    className="flex items-center justify-between font-mono text-[10px] tracking-[0.22em] uppercase border border-hairline text-bone hover:border-gold hover:text-gold px-4 py-3 transition-colors"
                  >
                    <span>{tag.name}</span>
                    <span>{tag.priceCents ? formatCurrency(tag.priceCents / 100) : 'View →'}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-hairline pt-4">
            <span className="folio text-bone/40">{post.isOfficial ? 'Official telemetry' : 'Curated community'}</span>
            {post.permalink && (
              <a href={post.permalink} target="_blank" rel="noreferrer" className="link-arrow text-bone/70 hover:text-gold text-[10px]">
                View on Instagram <ArrowUpRight size={11} className="arrow-icon" />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const FeedPage: React.FC = () => {
  const { posts, source, loading } = useRawFeed();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const officialCount = posts.filter((p) => p.isOfficial).length;

  useEffect(() => {
    document.body.style.overflow = openIndex !== null ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [openIndex]);

  return (
    <div className="relative bg-black text-bone pt-24 sm:pt-32 pb-24 min-h-screen">
      <div className="max-w-[1760px] mx-auto px-5 sm:px-8 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 pb-10 sm:pb-14 border-b border-hairline"
        >
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-4">
              <span className="folio text-gold">Page 03 — The Feed</span>
              <span className="text-bone/20">—</span>
              <span className="folio text-bone/50">Raw Posts</span>
            </div>
            <h1
              className="text-[15vw] sm:text-[11vw] lg:text-[9vw] leading-[0.84] tracking-[-0.005em]"
              style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
            >
              The{' '}
              <span className="italic text-gold-shine">
                feed.
              </span>
            </h1>
            <p
              className="text-xl sm:text-2xl text-bone/70 max-w-xl leading-snug"
              style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
            >
              The official feed and the community archive, tagged to the catalog.
            </p>
          </div>

          <div className="lg:col-span-4 space-y-6 lg:pt-6">
            <div className="border border-hairline px-4 py-3 flex items-center gap-2 w-fit">
              <span className={`w-1.5 h-1.5 ${source === 'LIVE' ? 'bg-gold animate-pulse-subtle' : 'bg-bone/40'}`} />
              <span className="folio">{source === 'LIVE' ? 'Instagram Live' : 'Curated archive'}</span>
            </div>
            <div className="border border-hairline px-4 py-3 space-y-1">
              <div className="folio text-bone/50">Frames on file</div>
              <div
                className="text-3xl text-gold leading-none"
                style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
              >
                {posts.length.toString().padStart(2, '0')}
              </div>
              <div className="font-mono text-[10px] text-bone/40 tracking-[0.22em] uppercase">
                {officialCount} official · {posts.length - officialCount} community
              </div>
            </div>
          </div>
        </motion.div>

        {/* Asymmetric grid */}
        <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-6 auto-rows-[180px] sm:auto-rows-[220px] md:auto-rows-[260px] grid-flow-row-dense gap-3 sm:gap-4">
          {posts.map((post, i) => (
            <FeedTile key={post.id} post={post} index={i} onOpen={() => setOpenIndex(i)} />
          ))}
        </div>

        {loading && (
          <div className="mt-10 folio text-bone/40 text-center animate-pulse-subtle">
            Acquiring signal…
          </div>
        )}

        {/* Footer */}
        <div className="mt-14 border-t border-hairline pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-bone/50 leading-relaxed max-w-lg">
            Community frames are curated by the studio. Tag{' '}
            <a className="text-gold hover:underline" href="https://instagram.com/lawrencemonroe" target="_blank" rel="noreferrer">
              @lawrencemonroe
            </a>{' '}
            to submit telemetry for review.
          </p>
          <a href="https://instagram.com/lawrencemonroe" target="_blank" rel="noreferrer" className="btn-mono">
            <Instagram size={12} strokeWidth={1.5} />
            Follow the feed
          </a>
        </div>
      </div>

      <AnimatePresence>
        {openIndex !== null && posts[openIndex] && (
          <FeedLightbox posts={posts} index={openIndex} onIndex={setOpenIndex} onClose={() => setOpenIndex(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};
