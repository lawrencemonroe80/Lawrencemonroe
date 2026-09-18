import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { VelocityText } from '../common/VelocityText';
import { revealUp } from '../../motion/tokens';

/**
 * HOMEPAGE V2 — EDITORIAL STATEMENT
 * ---------------------------------
 * One typographic moment on paper: the manifesto headline (scroll-
 * velocity variable-font distortion retained as the single kinetic
 * flourish), a short quote, and a quiet three-plate contact strip.
 */
const STRIP = [
  { src: '/images/campaign-contact-fabric.jpg', label: '480GSM WEAVE' },
  { src: '/images/campaign-contact-stride.jpg', label: 'STRIDE STUDY' },
  { src: '/images/campaign-contact-hardware.jpg', label: 'HARDWARE MACRO' },
];

export const EditorialStatement: React.FC = () => {
  return (
    <section
      id="manifesto"
      className="fx-grain-light relative bg-paper text-ink py-24 sm:py-32 border-t border-line-dark overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <motion.div
            variants={revealUp()}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="lg:col-span-8 space-y-6"
          >
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-gold inline-block" />
              <span className="font-mono text-[11px] text-ash tracking-[0.3em] uppercase font-semibold">
                001 / The Manifesto
              </span>
            </div>
            <h2 className="text-5xl sm:text-7xl lg:text-8xl uppercase text-ink leading-[0.94]">
              <VelocityText>BUILT TO</VelocityText>
              <VelocityText>HOLD ITS FORM.</VelocityText>
            </h2>
          </motion.div>

          <motion.div
            variants={revealUp(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="lg:col-span-4 space-y-6 lg:pb-3"
          >
            <div className="w-12 h-[2px] bg-gold-dark" />
            <p className="font-serif italic text-xl text-ash leading-relaxed">
              “A limited release built around silhouette, weight, and repeat wear.”
            </p>
            <p className="font-utility text-xs text-smoke uppercase tracking-wide leading-relaxed">
              Rejecting synthetic collapse in favor of heavyweight pure cotton. Each piece maintains
              rigid architectural lines across daily movement.
            </p>
            <Link
              to="/about"
              className="gold-line-sweep inline-block font-mono text-[11px] font-bold tracking-[0.25em] uppercase text-ink hover:text-gold-dark transition-colors"
            >
              Read the manifesto
            </Link>
          </motion.div>
        </div>

        {/* Quiet contact strip */}
        <motion.div
          variants={revealUp(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-3 gap-3 sm:gap-4 mt-16 sm:mt-20"
        >
          {STRIP.map((plate) => (
            <figure key={plate.label} className="group">
              <div className="overflow-hidden border border-line-dark bg-white/40">
                <img
                  src={plate.src}
                  alt={plate.label}
                  loading="lazy"
                  className="h-32 sm:h-44 w-full object-cover grayscale contrast-120 group-hover:scale-[1.05] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                />
              </div>
              <figcaption className="pt-2 font-mono text-[9px] tracking-[0.2em] text-ash uppercase">
                {plate.label}
              </figcaption>
            </figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
