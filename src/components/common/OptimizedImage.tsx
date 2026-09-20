import React from 'react';

export const OptimizedImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  draggable?: boolean;
}> = ({ src, alt, className = '', loading = 'lazy', sizes, draggable = false }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      sizes={sizes}
      draggable={draggable}
      decoding="async"
    />
  );
};
