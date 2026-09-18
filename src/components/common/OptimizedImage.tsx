import React, { useState } from 'react';

/**
 * <OptimizedImage /> — Vercel Edge Image Optimization for external media.
 * ---------------------------------------------------------------------
 * Rewrites remote sources (Sanity CDN, Square media, Instagram CDN) to
 * Vercel's `/_vercel/image` endpoint, producing next-gen WebP/AVIF with
 * a responsive `srcset` (480 / 828 / 1080 / 1600px widths).
 *
 * - Local `/images/...` assets already pass through Vite's pipeline and
 *   are served as-is (immutable hashed URLs).
 * - Off-Vercel (local dev, other hosts) the raw URL is used untouched —
 *   zero configuration, graceful everywhere.
 *
 * Vercel note: remote image optimization for external domains requires
 * the Vercel Pro plan; on Hobby the component still works and simply
 * serves originals.
 */

const WIDTHS = [480, 828, 1080, 1600] as const;

const isVercel = (): boolean =>
  typeof window !== 'undefined' &&
  (window.location.hostname.endsWith('.vercel.app') ||
   window.location.hostname === 'lawrencemonroe.com' ||
   window.location.hostname === 'www.lawrencemonroe.com');

const optimizedUrl = (src: string, w: number, q = 75): string =>
  `/_vercel/image?url=${encodeURIComponent(src)}&w=${w}&q=${q}`;

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  draggable?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  sizes = '(max-width: 640px) 92vw, (max-width: 1280px) 45vw, 30vw',
  loading = 'lazy',
  draggable = true,
}) => {
  const [failed, setFailed] = useState(false);

  const remote = /^https?:\/\//.test(src);
  const useOptimizer = remote && !failed && isVercel();

  const finalSrc = useOptimizer ? optimizedUrl(src, 1080) : src;
  const srcSet = useOptimizer
    ? WIDTHS.map((w) => `${optimizedUrl(src, w)} ${w}w`).join(', ')
    : undefined;

  return (
    <img
      src={failed && useOptimizer ? src : finalSrc}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      draggable={draggable}
      onError={() => setFailed(true)}
    />
  );
};
