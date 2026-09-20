import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ArrowUpRight } from 'lucide-react';
import { OptimizedImage } from './OptimizedImage';

export interface LightboxItem {
  src: string;
  alt: string;
  /** Eyebrow chip — issue, plate number, category */
  eyebrow?: string;
  /** Headline (display type) */
  title?: string;
  /** Italic subhead */
  caption?: string;
  /** Right-side metadata stack (e.g. credits) */
  meta?: string[];
  /** Optional link the image should route to when clicked */
  href?: string;
}

interface EditorialLightboxProps {
  open: boolean;
  item: LightboxItem | null;
  onClose: () => void;
}

/**
 * EDITORIAL LIGHTBOX — open a single image as a full magazine plate.
 * - Background: heavy glass blur
 * - Plate: full image w/ inset border + soft shadow
 * - Caption: floating glass strip below
 * - Close: gold X button + ESC + click backdrop
 */
export const EditorialLightbox: React.FC<EditorialLightboxProps> = ({ open, item, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && item && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6 md:p-10"
          role="dialog"
          aria-modal="true"
          aria-label="Editorial plate"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-2xl"
          />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close plate"
            className="fixed top-4 right-4 sm:top-6 sm:right-6 z-30 glass-gold w-10 h-10 flex items-center justify-center text-bone/80 hover:text-gold transition-colors"
          >
            <X size={16} strokeWidth={1.4} />
          </button>

          {/* Plate container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-7xl max-h-[90vh] flex flex-col"
          >
            {/* Eyebrow strip */}
            {item.eyebrow && (
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="font-folio text-gold">{item.eyebrow}</span>
                <span className="font-folio text-bone/45">Plate 01</span>
              </div>
            )}

            {/* The image */}
            <div className="relative flex-1 min-h-0 overflow-hidden border border-hairline">
              <OptimizedImage
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-contain"
                loading="eager"
              />
              {/* Subtle gold inner edge */}
              <div className="absolute inset-0 ring-1 ring-inset ring-gold/15 pointer-events-none" />
            </div>

            {/* Caption bar */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
              <div className="sm:col-span-8 space-y-1.5">
                {item.title && (
                  <h3
                    className="text-2xl sm:text-3xl lg:text-4xl text-bone leading-[0.95]"
                    style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
                  >
                    {item.title}
                  </h3>
                )}
                {item.caption && (
                  <p
                    className="text-base sm:text-lg text-bone/65 leading-snug"
                    style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
                  >
                    {item.caption}
                  </p>
                )}
              </div>
              {item.meta && item.meta.length > 0 && (
                <div className="sm:col-span-4 sm:text-right space-y-1 font-folio text-bone/45">
                  {item.meta.map((m) => (
                    <div key={m}>{m}</div>
                  ))}
                </div>
              )}
              {item.href && (
                <div className="sm:col-span-12 pt-2 border-t border-hairline flex items-center justify-between">
                  <span className="font-folio text-bone/40">Continue reading</span>
                  <a
                    href={item.href}
                    className="link-arrow text-bone hover:text-gold"
                  >
                    Open page <ArrowUpRight size={12} className="arrow-icon" />
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditorialLightbox;
