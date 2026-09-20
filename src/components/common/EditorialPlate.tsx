import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Maximize2 } from 'lucide-react';
import { OptimizedImage } from './OptimizedImage';
import { EditorialLightbox, LightboxItem } from './EditorialLightbox';

export interface EditorialPlateProps {
  src: string;
  alt: string;
  /** Aspect ratio — defaults to 4/5 (portrait) */
  aspect?: string;
  /** Reveals full color on hover (default true) */
  revealOnHover?: boolean;
  /** Clickable to open the lightbox (default true) */
  clickToOpen?: boolean;
  /** Caption that fades in on hover */
  caption?: string;
  /** Right-side metadata that fades in on hover */
  meta?: string[];
  /** Eyebrow text — e.g. "Plate I" */
  eyebrow?: string;
  /** Override the lightbox payload */
  lightbox?: LightboxItem;
  className?: string;
  /** Disable the hover reveal (e.g. for technical plate grids) */
  muted?: boolean;
  /** Always-on color (skip grayscale default) */
  revealed?: boolean;
}

/**
 * EDITORIAL PLATE — image + hover caption + click-to-lightbox.
 * Default state: muted grayscale with subtle warm tint.
 * Hover: full color, 1.06x zoom, brighter, floating glass caption.
 * Click: opens full editorial lightbox.
 */
export const EditorialPlate: React.FC<EditorialPlateProps> = ({
  src,
  alt,
  aspect = 'aspect-[4/5]',
  revealOnHover = true,
  clickToOpen = true,
  caption,
  meta,
  eyebrow,
  lightbox,
  className = '',
  muted,
  revealed,
}) => {
  const [open, setOpen] = useState(false);

  const item: LightboxItem = lightbox ?? {
    src,
    alt,
    eyebrow,
    title: caption,
    meta,
  };

  return (
    <>
      <figure
        className={`group relative overflow-hidden border border-hairline ${aspect} ${className}`}
      >
        {/* Image */}
        <OptimizedImage
          src={src}
          alt={alt}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-cinematic will-change-transform ${
            revealOnHover && !revealed && !muted
              ? 'img-mono'
              : ''
          } ${revealed ? 'scale-[1.04]' : ''}`}
        />

        {/* Permanent bottom gradient — for caption readability */}
        <div className="absolute inset-0 overlay-bottom opacity-50" />

        {/* Top eyebrow chip */}
        {eyebrow && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 font-folio text-gold bg-black/65 px-2.5 py-1 border border-gold/25">
            {eyebrow}
          </div>
        )}

        {/* Top right — lightbox control */}
        {clickToOpen && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
            aria-label="Open plate"
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-9 h-9 flex items-center justify-center text-bone/70 hover:text-gold glass border-hairline opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            data-cursor="view"
            data-cursor-label="Open"
          >
            <Maximize2 size={13} strokeWidth={1.3} />
          </button>
        )}

        {/* Hover caption — floating glass strip */}
        {caption && (
          <AnimatePresence>
            <motion.figcaption
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-10 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-cinematic"
            >
              <div className="glass-gold p-3 sm:p-4">
                <div className="flex items-end justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <p
                      className="text-sm sm:text-base text-bone leading-tight line-clamp-2"
                      style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
                    >
                      {caption}
                    </p>
                    {meta && meta.length > 0 && (
                      <div className="font-folio text-bone/45 truncate">
                        {meta.slice(0, 2).join(' · ')}
                      </div>
                    )}
                  </div>
                  {clickToOpen && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpen(true);
                      }}
                      className="shrink-0 link-arrow text-gold text-[9px]"
                    >
                      Open <ArrowUpRight size={11} className="arrow-icon" />
                    </button>
                  )}
                </div>
              </div>
            </motion.figcaption>
          </AnimatePresence>
        )}
      </figure>

      <EditorialLightbox open={open} item={open ? item : null} onClose={() => setOpen(false)} />
    </>
  );
};

export default EditorialPlate;
