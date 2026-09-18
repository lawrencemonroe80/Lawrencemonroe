import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { brandAssets } from '../../data/assets';
import { VelocityText } from '../common/VelocityText';

export const Section2Manifesto: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const outlineShiftX = useTransform(scrollYProgress, [0, 1], ['5%', '-15%']);
  const stripX = useTransform(scrollYProgress, [0, 1], ['0%', '-25%']);

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      className="relative w-full bg-paper text-ink py-24 sm:py-32 md:py-40 overflow-hidden border-b border-ash/30"
    >
      {/* Oversized Official Outline Wordmark running behind content */}
      <motion.div
        style={{ x: outlineShiftX }}
        className="absolute top-1/3 left-0 w-[140vw] pointer-events-none select-none z-0 opacity-15"
      >
        <img
          src={brandAssets.wordmarkOutline}
          alt=""
          className="w-full h-auto object-contain filter invert"
        />
      </motion.div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 relative z-10">
        {/* Top Meta Tag */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ash/20 pb-6 mb-12 sm:mb-16">
          <div className="flex items-center space-x-3">
            <span className="w-2 h-2 bg-gold-dark inline-block" />
            <span className="font-mono text-xs font-bold text-ash tracking-widest uppercase">
              001 / FIRST RELEASE
            </span>
          </div>
          <div className="font-mono text-[11px] text-smoke uppercase tracking-wider">
            LM / PRIVATE LABEL / ACTIVE
          </div>
        </div>

        {/* Massive Stacked Statement */}
        <motion.div style={{ y: textY }} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-4">
            {/* Scroll-velocity variable-font distortion — the headline
                physically strains (wght 760→480 / wdth 82→125) as the
                page accelerates. See <VelocityText /> + motion tokens. */}
            <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.92] uppercase text-ink">
              <VelocityText>BUILT TO</VelocityText>
              <VelocityText>HOLD</VelocityText>
              <VelocityText>ITS FORM.</VelocityText>
            </h2>
          </div>

          <div className="lg:col-span-4 space-y-6 pb-2">
            <div className="w-12 h-[2px] bg-gold-dark" />
            <p className="font-serif italic text-xl sm:text-2xl text-ash leading-relaxed">
              “A limited release built around silhouette, weight, and repeat wear.”
            </p>
            <p className="font-utility text-xs sm:text-sm text-smoke leading-relaxed uppercase tracking-wide">
              REJECTING SYNTHETIC COLLAPSE IN FAVOR OF HEAVYWEIGHT PURE COTTON TWILL AND DOUBLE-FACED TERRY. EACH PIECE MAINTAINS RIGID ARCHITECTURAL LINES ACROSS DAILY MOVEMENT.
            </p>
            <div className="font-mono text-[10px] text-ash/80 border border-ash/30 p-2.5 inline-block bg-bone/40">
              SPECIMEN RECORD: LMS-480 / BATCH NO. 01
            </div>
          </div>
        </motion.div>
      </div>

      {/* Moving Graphic Fabric / Detail Image Strip at bottom edge */}
      <div className="mt-16 sm:mt-24 pt-8 border-t border-ash/20 overflow-hidden relative">
        <motion.div
          style={{ x: stripX }}
          className="flex space-x-6 w-[200vw] sm:w-[150vw] md:w-[130vw] select-none"
        >
          {[
            { img: '/images/campaign-contact-fabric.jpg', tag: '480GSM WEAVE' },
            { img: '/images/campaign-contact-hardware.jpg', tag: 'ANTIQUE GOLD HARDWARE' },
            { img: '/images/shorts-001-back.jpg', tag: 'SEATED DRAPE' },
            { img: '/images/shorts-002-detail.jpg', tag: 'RAW HEM DETAIL' },
            { img: '/images/campaign-contact-stride.jpg', tag: 'STRIDE PROPORTION' },
            { img: '/images/campaign-contact-fabric.jpg', tag: '480GSM WEAVE' },
            { img: '/images/campaign-contact-hardware.jpg', tag: 'ANTIQUE GOLD HARDWARE' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-52 sm:w-64 md:w-80 h-36 sm:h-44 bg-ash relative overflow-hidden border border-ash/30 group"
            >
              <img
                src={item.img}
                alt={item.tag}
                className="w-full h-full object-cover grayscale contrast-125 brightness-95 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-ink/20 group-hover:bg-transparent transition-colors" />
              <div className="absolute bottom-2 left-2 font-mono text-[9px] bg-paper/90 text-ink px-2 py-0.5 uppercase tracking-wider font-bold">
                {item.tag}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
