import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { ISSUE } from '../../data/magazine';
import { Magnetic } from '../common/Magnetic';

/**
 * §1 — HERO
 * Powerful opening. Massive display wordmark, asymmetric image plate,
 * scroll-driven parallax on type and image. Editorial film grain.
 */
export const Hero: React.FC = () => {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen bg-black text-bone overflow-hidden pt-14 md:pt-16 grain"
    >
      {/* Top metadata strip */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="max-w-[1760px] mx-auto px-5 sm:px-8 md:px-12 pt-6 pb-4 flex items-center justify-between border-b border-hairline"
      >
        <div className="flex items-center gap-4 sm:gap-8">
          <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-bone/50">
            ISSUE №{ISSUE.number}
          </span>
          <span className="hidden sm:inline font-mono text-[10px] tracking-[0.32em] uppercase text-gold">
            {ISSUE.title}
          </span>
          <span className="hidden md:inline font-mono text-[10px] tracking-[0.32em] uppercase text-bone/40">
            {ISSUE.date}
          </span>
        </div>
        <div className="font-mono text-[10px] tracking-[0.32em] uppercase text-bone/40">
          EST. {ISSUE.established.replace('EST. ', '')}
        </div>
      </motion.div>

      {/* Main hero */}
      <motion.div
        style={{ opacity }}
        className="relative max-w-[1760px] mx-auto px-5 sm:px-8 md:px-12 pt-12 sm:pt-16 lg:pt-24 pb-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start min-h-[70vh]">
          {/* Title block */}
          <motion.div
            style={{ y: titleY }}
            className="lg:col-span-9 space-y-10 sm:space-y-14"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <span className="w-1.5 h-1.5 bg-gold inline-block" />
              <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-bone/60">
                A private-label digital issue — Autumn {new Date().getFullYear()}
              </span>
            </motion.div>

            <h1 className="font-display-tight text-bone leading-[0.82] tracking-[-0.01em]">
              <motion.span
                initial={{ opacity: 0, y: 90, filter: 'blur(20px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                className="block text-[22vw] sm:text-[18vw] lg:text-[16vw]"
              >
                Lawrence
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 90, filter: 'blur(20px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                className="block italic font-editorial-display text-[22vw] sm:text-[18vw] lg:text-[16vw] text-gold-shine"
              >
                Monroe
              </motion.span>
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 max-w-4xl pt-4"
            >
              <p
                className="md:col-span-6 text-2xl sm:text-3xl text-bone leading-[1.15]"
                style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
              >
                A digital magazine for a modern unisex streetwear brand.
              </p>
              <p className="md:col-span-6 text-sm sm:text-base text-bone/50 leading-relaxed max-w-md">
                Two pieces, one uniform. A limited release built around silhouette, weight, and repeat wear — published as one document each season.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2"
            >
              <Magnetic strength={0.2}>
                <Link to="/shop" className="btn-gold" data-cursor="view" data-cursor-label="Open Issue">
                  Open Issue 001
                  <ArrowUpRight size={14} />
                </Link>
              </Magnetic>
              <Link to="/about" className="link-arrow text-bone/70 hover:text-gold">
                Read the manifesto <ArrowUpRight size={14} className="arrow-icon" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right image plate — asymmetric, overlapping */}
          <motion.div
            style={{ y: imageY }}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            className="lg:col-span-3 lg:absolute lg:right-5 xl:right-12 lg:top-44 lg:w-[26vw] lg:max-w-[420px]"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <img
                src="/models/LM_P01_02_BLACK_BLACK_2.jpg"
                alt="Lawrence Monroe — Campaign cover plate"
                className="w-full h-full object-cover img-mono"
              />
              <div className="absolute inset-0 overlay-bottom" />
              {/* Cover plate label */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div className="space-y-1">
                  <div className="font-mono text-[9px] tracking-[0.32em] uppercase text-gold">
                    Cover Plate
                  </div>
                  <div
                    className="text-lg text-bone leading-none"
                    style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
                  >
                    35mm
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[9px] tracking-[0.24em] uppercase text-bone/50">
                    Silver-gelatin
                  </div>
                  <div className="font-mono text-[9px] tracking-[0.24em] uppercase text-bone/50">
                    Issue 001
                  </div>
                </div>
              </div>
              {/* Top right plate mark */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5">
                <span className="w-1 h-1 bg-gold inline-block animate-pulse-subtle" />
                <span className="font-mono text-[9px] tracking-[0.28em] uppercase text-bone/70">
                  Live
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom rail */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="absolute bottom-8 left-5 right-5 sm:left-8 sm:right-8 md:left-12 md:right-12 flex items-center justify-between"
        >
          <a
            href="#statement"
            className="group flex items-center gap-3 text-bone/60 hover:text-gold transition-colors"
          >
            <span className="font-mono text-[10px] tracking-[0.32em] uppercase">
              Turn the page
            </span>
            <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
          </a>
          <div className="hidden md:flex items-center gap-4 font-mono text-[10px] tracking-[0.28em] uppercase text-bone/40">
            <span>480GSM Combed Cotton</span>
            <span className="text-gold">·</span>
            <span>Allocation Active</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
