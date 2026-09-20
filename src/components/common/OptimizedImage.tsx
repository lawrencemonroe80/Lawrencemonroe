import React from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  draggable?: boolean;
  /** Set true to bypass any browser-level drag */
  onClick?: (e: React.MouseEvent<HTMLImageElement>) => void;
}

/**
 * Thin wrapper over <img> that:
 * - Preserves srcset-less simplicity (no responsive art)
 * - Sets decoding="async" for paint stability
 * - Forwards onClick for click-to-open lightbox
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  sizes,
  draggable = false,
  onClick,
}) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      sizes={sizes}
      draggable={draggable}
      decoding="async"
      onClick={onClick}
    />
  );
};

export default OptimizedImage;
