import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { CONTACT_FRAMES } from '../../data/contactFrames';
import { useCartStore } from '../../store/cartStore';

export const LightboxModal: React.FC = () => {
  const {
    lightboxIndex,
    closeLightbox,
    setLightboxIndex,
    openRequestAccess
  } = useCartStore();

  const activeIndex = lightboxIndex;
  const currentFrame = activeIndex !== null ? CONTACT_FRAMES[activeIndex] : null;

  const handlePrev = useCallback(() => {
    if (activeIndex === null) return;
    const prev = (activeIndex - 1 + CONTACT_FRAMES.length) % CONTACT_FRAMES.length;
    setLightboxIndex(prev);
  }, [activeIndex, setLightboxIndex]);

  const handleNext = useCallback(() => {
    if (activeIndex === null) return;
    const next = (activeIndex + 1) % CONTACT_FRAMES.length;
    setLightboxIndex(next);
  }, [activeIndex, setLightboxIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, closeLightbox, handlePrev, handleNext]);

  return (
    <AnimatePresence>
      {currentFrame && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Contact Sheet Lightbox"
        >
          {/* Backdrop — dark-mode glassmorphism, 20px blur per motion spec */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.83, 0, 0.17, 1] }}
            onClick={closeLightbox}
            className="fixed inset-0 bg-black/60 backdrop-blur-[20px]"
          />

          {/* Modal Container — fluid scale-up through the glass */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 26, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.94, y: 14, filter: 'blur(8px)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel-heavy glass-metal-top relative z-10 w-full max-w-6xl max-h-[90vh] flex flex-col lg:flex-row overflow-hidden shadow-2xl"
          >
            {/* Top Close Button (Absolute) */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-20 bg-black/80 border border-line p-2 text-bone hover:text-gold hover:border-gold transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-gold"
              aria-label="Close Lightbox"
            >
              <X size={18} />
            </button>

            {/* Left/Main: Visual Stage */}
            <div className="lg:w-3/5 bg-black flex items-center justify-center relative min-h-[360px] lg:min-h-[580px] p-6">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentFrame.id}
                  src={currentFrame.image}
                  alt={currentFrame.title}
                  initial={{ opacity: 0, scale: 1.015, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 1.02, filter: 'blur(4px)' }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="max-h-[70vh] w-auto max-w-full object-contain filter contrast-105"
                />
              </AnimatePresence>

              {/* Prev / Next Arrows */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 border border-line hover:border-gold text-bone hover:text-gold p-2 transition-colors focus:outline-none"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 border border-line hover:border-gold text-bone hover:text-gold p-2 transition-colors focus:outline-none"
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>

              {/* Bottom Frame Stamp inside viewer */}
              <div className="absolute bottom-4 left-4 font-mono text-[10px] bg-black/80 px-2 py-1 border border-line text-gold">
                {currentFrame.frameNumber} // {currentFrame.label}
              </div>
            </div>

            {/* Right: Technical Dossier & Metadata */}
            <div className="lg:w-2/5 p-6 sm:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-line bg-graphite overflow-y-auto">
              <div className="space-y-6">
                <div className="space-y-1 border-b border-line pb-4">
                  <div className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-gold inline-block" />
                    <span className="font-mono text-xs text-gold tracking-widest uppercase">
                      {currentFrame.category}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-bone uppercase">
                    {currentFrame.title}
                  </h3>
                  <div className="font-mono text-[10px] text-smoke">
                    INDEX REF: LM-SPEC-{currentFrame.id.toUpperCase()}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-mono text-[10px] text-smoke uppercase tracking-wider">
                    CURATORIAL CAPTION
                  </span>
                  <p className="font-utility text-sm text-bone/90 leading-relaxed">
                    {currentFrame.caption}
                  </p>
                </div>

                {/* Technical metadata table */}
                <div className="space-y-2 border border-line/60 bg-black/40 p-4">
                  <span className="font-mono text-[9px] text-gold uppercase tracking-wider block border-b border-line/40 pb-1">
                    TECHNICAL ARCHIVAL LOG
                  </span>
                  <div className="grid grid-cols-2 gap-y-2 font-mono text-xs text-smoke pt-1">
                    {currentFrame.metadata.lens && (
                      <>
                        <span className="text-smoke/60">OPTICS</span>
                        <span className="text-bone">{currentFrame.metadata.lens}</span>
                      </>
                    )}
                    {currentFrame.metadata.exposure && (
                      <>
                        <span className="text-smoke/60">EXPOSURE</span>
                        <span className="text-bone">{currentFrame.metadata.exposure}</span>
                      </>
                    )}
                    {currentFrame.metadata.treatment && (
                      <>
                        <span className="text-smoke/60">TREATMENT</span>
                        <span className="text-bone">{currentFrame.metadata.treatment}</span>
                      </>
                    )}
                    {currentFrame.metadata.release && (
                      <>
                        <span className="text-smoke/60">STATUS</span>
                        <span className="text-gold">{currentFrame.metadata.release}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-6 border-t border-line mt-6 flex items-center justify-between">
                <span className="font-mono text-xs text-smoke">
                  FRAME {Number(activeIndex) + 1} OF {CONTACT_FRAMES.length}
                </span>

                {currentFrame.isUnreleased ? (
                  <button
                    onClick={() => {
                      closeLightbox();
                      openRequestAccess(currentFrame.title.includes('SHIRT') ? 'SHIRT' : 'HEADWEAR');
                    }}
                    className="inline-flex items-center space-x-1.5 bg-black border border-gold px-3.5 py-2 font-mono text-xs text-gold hover:bg-gold hover:text-black transition-colors"
                  >
                    <Lock size={12} />
                    <span>REQUEST ACCESS</span>
                  </button>
                ) : (
                  <span className="font-mono text-[10px] text-smoke border border-line px-2 py-1 bg-black/40">
                    RELEASE 001 ACTIVE
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
