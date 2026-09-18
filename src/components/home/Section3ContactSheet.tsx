import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Maximize2, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { CONTACT_FRAMES } from '../../data/contactFrames';
import { useCartStore } from '../../store/cartStore';
import { EditorialFaceBlur } from '../common/EditorialFaceBlur';

export const Section3ContactSheet: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const [activeHoverId, setActiveHoverId] = useState<string | null>(null);
  const { openLightbox } = useCartStore();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Horizontal parallax translation across scroll
  const xTranslate = useTransform(scrollYProgress, [0, 1], ['5%', '-35%']);

  const handleFrameClick = (index: number) => {
    openLightbox(index);
  };

  const scrollLeft = () => {
    if (scrollTrackRef.current) {
      scrollTrackRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollTrackRef.current) {
      scrollTrackRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="contact-sheet"
      ref={containerRef}
      className="relative w-full bg-black text-bone py-24 sm:py-32 md:py-36 overflow-hidden border-b border-line"
    >
      {/* Background Graphic Grid */}
      <div className="absolute inset-0 bg-archival-grid opacity-40 pointer-events-none" />

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 relative z-10 mb-12 sm:mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-line pb-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-gold inline-block" />
              <span className="font-mono text-xs text-gold tracking-widest uppercase font-bold">
                CONTACT SHEET TELEMETRY
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-bone uppercase">
              VISUAL FRAGMENTS.
            </h2>
          </div>

          <div className="flex items-center space-x-6">
            <p className="font-mono text-xs text-smoke hidden sm:block max-w-xs text-right">
              SELECT ANY FRAME TO INITIALIZE HIGH-RESOLUTION TELEMETRY LIGHTBOX.
            </p>
            {/* Carousel navigation buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={scrollLeft}
                className="p-2 border border-line bg-graphite/40 hover:border-gold hover:text-gold text-bone transition-colors focus:outline-none"
                aria-label="Scroll contact sheet left"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                onClick={scrollRight}
                className="p-2 border border-line bg-graphite/40 hover:border-gold hover:text-gold text-bone transition-colors focus:outline-none"
                aria-label="Scroll contact sheet right"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Horizontal Scroll-linked Track */}
      <div className="relative w-full overflow-x-auto no-scrollbar" ref={scrollTrackRef}>
        <motion.div
          style={{ x: xTranslate }}
          className="flex space-x-6 sm:space-x-8 px-5 sm:px-8 md:px-12 w-max select-none py-4"
        >
          {CONTACT_FRAMES.map((frame, index) => {
            const isHovered = activeHoverId === frame.id;
            const isModelShot = frame.id === 'frame-01' || frame.id === 'frame-02' || frame.id === 'frame-03' || frame.id === 'frame-04';

            return (
              <div
                key={frame.id}
                onMouseEnter={() => setActiveHoverId(frame.id)}
                onMouseLeave={() => setActiveHoverId(null)}
                onClick={() => handleFrameClick(index)}
                data-cursor="view"
                data-cursor-label="INSPECT FRAME"
                className="group relative cursor-pointer flex-shrink-0 w-72 sm:w-80 md:w-96 bg-graphite border border-line hover:border-gold transition-all duration-300 flex flex-col"
              >
                {/* Contact Frame Header Label */}
                <div className="p-3 border-b border-line flex items-center justify-between bg-black/60 font-mono text-[10px]">
                  <span className="text-gold font-bold uppercase tracking-wider">
                    {frame.label}
                  </span>
                  <span className="text-smoke">
                    {frame.frameNumber}
                  </span>
                </div>

                {/* Main Visual Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-black flex items-center justify-center p-2">
                  <img
                    src={frame.image}
                    alt={frame.title}
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      isHovered ? 'scale-105 contrast-110 grayscale-0' : 'grayscale contrast-115 brightness-90'
                    }`}
                  />

                  {/* Vintage Redaction Bar over Model Face */}
                  {isModelShot && (
                    <EditorialFaceBlur
                      top="12%"
                      left="50%"
                      width="76px"
                      height="26px"
                      label="LM // [001]"
                    />
                  )}

                  {/* Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {/* Expand Lightbox Icon Indicator */}
                  <div className="absolute top-3 right-3 p-1.5 bg-black/70 border border-line text-smoke group-hover:text-gold group-hover:border-gold transition-colors">
                    {frame.isUnreleased ? <Lock size={12} /> : <Maximize2 size={12} />}
                  </div>

                  {/* Unreleased Badge if applicable */}
                  {frame.isUnreleased && (
                    <div className="absolute top-3 left-3 bg-archive-red/90 text-bone font-mono text-[9px] px-2 py-0.5 uppercase tracking-wider font-bold border border-red-400/30">
                      NOT YET RELEASED
                    </div>
                  )}

                  {/* Hover Caption Overlay */}
                  <div
                    className={`absolute inset-x-0 bottom-0 p-4 bg-black/85 backdrop-blur-sm border-t border-line/60 transition-transform duration-300 ${
                      isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                    }`}
                  >
                    <p className="font-utility text-xs text-bone/90 leading-snug">
                      {frame.caption}
                    </p>
                  </div>
                </div>

                {/* Frame Footer Metadata */}
                <div className="p-3 bg-black/40 border-t border-line space-y-1">
                  <div className="font-display text-sm font-bold text-bone group-hover:text-gold transition-colors uppercase tracking-tight">
                    {frame.title}
                  </div>
                  <div className="flex items-center justify-between font-mono text-[9px] text-smoke">
                    <span>{frame.category}</span>
                    <span className="text-gold/80">INSPECT FRAME</span>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Frame Counter / Pagination Bar */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 mt-8 flex items-center justify-between font-mono text-xs text-smoke">
        <div>TOTAL SPECIMENS: {CONTACT_FRAMES.length} FRAMES</div>
        <div className="text-gold tracking-widest uppercase font-bold">
          CLICK FRAME TO INSPECT
        </div>
      </div>
    </section>
  );
};
