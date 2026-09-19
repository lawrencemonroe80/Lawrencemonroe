import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { EditorialFaceBlur } from '../common/EditorialFaceBlur';
import { Magnetic } from '../common/Magnetic';
import { EASE, KEN_BURNS, SCROLL, badgeBlurIn, motionBlurIn } from '../../motion/tokens';
import { ISSUE, CONTENTS } from '../../data/magazine';

/**
 * THE COVER — PAGE 01
 * -------------------
 * A magazine cover: masthead, issue strip, one cover image, cover lines
 * down the left rail referencing the contents pages, barcode block.
 * Calm paper ground, silver-gelatin plate, a single slow push.
 */
export const Cover: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: [...SCROLL.pinned],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 56]);

  const kenBurns = reduceMotion ? undefined : KEN_BURNS.panZoom;

  const scrollToFeature = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('feature')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="cover"
      ref={sectionRef}
      className="fx-grain-light relative min-h-screen bg-paper text-ink overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_85%_0%,rgba(136,136,136,0.10),transparent_55%)]" />

      <motion.div
        style={{ y: contentY }}
        className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 md:px-12 min-h-screen flex flex-col pt-24 sm:pt-28 pb-8"
      >
        {/* ——— Masthead + issue strip ——— */}
        <motion.div
          variants={badgeBlurIn(0.05)}
          initial="hidden"
          animate="visible"
          className="border-t-2 border-b border-ink pt-3 pb-3 mb-8 sm:mb-12 flex items-center justify-between font-mono text-[10px] sm:text-[11px] tracking-[0.25em] uppercase"
        >
          <span className="text-ash">ISSUE №{ISSUE.number}</span>
          <span className="text-ink font-bold text-center">{ISSUE.title}</span>
          <span className="text-gold-dark font-bold">{ISSUE.priceLine}</span>
        </motion.div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* ——— Cover lines ——— */}
          <div className="lg:col-span-5 space-y-8 order-2 lg:order-1">
            <h1 className="font-serif font-bold uppercase text-ink leading-[0.94] tracking-[-0.02em] select-none">
              <motion.span
                variants={motionBlurIn(0.18)}
                initial="hidden"
                animate="visible"
                className="block text-[14vw] lg:text-[5.6rem]"
              >
                Lawrence
              </motion.span>
              <motion.span
                variants={motionBlurIn(0.3)}
                initial="hidden"
                animate="visible"
                className="block text-[14vw] lg:text-[5.6rem]"
              >
                Monroe
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE.cinematicOut, delay: 0.55 }}
              className="font-serif italic text-lg sm:text-xl text-ash max-w-sm leading-relaxed"
            >
              Two pieces. One uniform. A private-label issue on form, weight, and repeat wear.
            </motion.p>

            {/* Cover lines → contents */}
            <div className="space-y-0 border-t border-line-dark">
              {CONTENTS.slice(1, 5).map((entry, i) => (
                <motion.div
                  key={entry.page}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, ease: EASE.cinematicOut, delay: 0.65 + i * 0.08 }}
                >
                  <Link
                    to={entry.route}
                    className="group flex items-baseline py-2.5 border-b border-line-dark/70 hover:border-gold-dark/60 transition-colors"
                  >
                    <span className="font-mono text-[10px] font-bold text-gold-dark tracking-[0.18em] w-12 shrink-0">
                      P.{entry.page}
                    </span>
                    <span className="font-serif font-bold uppercase text-base sm:text-lg text-ink group-hover:text-gold-dark transition-colors">
                      {entry.subtitle}
                    </span>
                    <ArrowUpRight
                      size={13}
                      className="ml-2 self-center text-ash group-hover:text-gold-dark group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0"
                    />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ——— Cover image + barcode ——— */}
          <div className="lg:col-span-7 order-1 lg:order-2 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 1.04, filter: 'blur(14px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.1, ease: EASE.cinematicOut, delay: 0.25 }}
              className="w-full max-w-[440px]"
            >
              <div className="bg-white/60 border border-line-dark p-2.5 shadow-paper">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <motion.img
                    src="/models/LM_P01_02_BLACK_BLACK_2.jpg"
                    alt="Issue 001 cover plate — LM Shorts 001, black arch colorway"
                    className="h-full w-full object-cover grayscale contrast-125"
                    animate={kenBurns}
                  />
                  <EditorialFaceBlur top="9%" left="50%" width="78px" height="26px" label="LM / [001]" />
                </div>
                <div className="flex items-center justify-between px-1 pt-2.5 pb-1 font-mono text-[9px] tracking-[0.2em] text-ash uppercase">
                  <span className="text-gold-dark font-bold">COVER PLATE — 35MM</span>
                  <span>SILVER-GELATIN</span>
                </div>
              </div>

              {/* Barcode block */}
              <div className="mt-4 flex items-end justify-between gap-6">
                <div className="flex-1 max-w-[180px]">
                  <div className="barcode" />
                  <div className="font-mono text-[8px] tracking-[0.25em] text-ash uppercase pt-1.5">
                    LM {ISSUE.number} · {ISSUE.date} · VOL. I
                  </div>
                </div>
                <div className="text-right font-mono text-[9px] tracking-[0.2em] text-ash uppercase leading-relaxed">
                  PUBLISHED BY THE STUDIO
                  <br />
                  {ISSUE.established}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ——— Bottom rail ——— */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.05, duration: 0.8 }}
          className="border-t border-line-dark pt-4 mt-10 flex items-center justify-between"
        >
          <Magnetic strength={0.2}>
            <a
              href="#feature"
              onClick={scrollToFeature}
              className="group inline-flex items-center gap-2.5 font-mono text-[11px] font-bold tracking-[0.25em] uppercase text-ink hover:text-gold-dark transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-gold-dark"
            >
              OPEN THE ISSUE
              <ArrowDown size={13} className="group-hover:translate-y-0.5 transition-transform" />
            </a>
          </Magnetic>
          <span className="font-mono text-[9px] tracking-[0.2em] text-ash uppercase">
            480GSM COMBED COTTON · ALLOCATION ACTIVE
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
};
