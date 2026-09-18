import React, { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EditorialFaceBlur } from '../common/EditorialFaceBlur';
import { Magnetic } from '../common/Magnetic';
import {
  EASE,
  KEN_BURNS,
  SCROLL,
  SPRING,
  badgeBlurIn,
  motionBlurIn,
} from '../../motion/tokens';

/**
 * HOMEPAGE V2 — THE ENTRANCE (LIGHT EDITORIAL)
 * --------------------------------------------
 * One idea per viewport: a single mounted silver-gelatin print, set in
 * generous paper whitespace, against a large ink serif wordmark.
 * Motion is retained but restrained — a gentle cursor parallax on the
 * print, a slow Ken Burns push, and cinematic blur-in typography.
 * The 3D multi-plate rig of v1 lives on in DESIGN_FRAMEWORK.md; the
 * homepage now leads with calm.
 */
export const LightHero: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  // Gentle parallax — the mounted print drifts with the cursor
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rigX = useSpring(mx, SPRING.parallaxRig);
  const rigY = useSpring(my, SPRING.parallaxRig);
  const printX = useTransform(rigX, [-0.5, 0.5], [-10, 10]);
  const printY = useTransform(rigY, [-0.5, 0.5], [-7, 7]);
  const typeX = useTransform(rigX, [-0.5, 0.5], [5, -5]);

  // Scroll exit: soft recede, no drama
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: [...SCROLL.pinned],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 56]);
  const printExitY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  const kenBurns = reduceMotion ? undefined : KEN_BURNS.panZoom;

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const scrollToCapsule = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('capsule')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="fx-grain-light relative min-h-screen bg-paper text-ink overflow-hidden"
    >
      {/* Concrete ambience wash */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_85%_0%,rgba(136,136,136,0.12),transparent_55%)]" />

      <motion.div
        style={{ y: contentY }}
        className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 md:px-12 min-h-screen flex flex-col justify-between pt-32 sm:pt-36 pb-10"
      >
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* ——— Type block ——— */}
          <motion.div style={{ x: typeX }} className="lg:col-span-7 space-y-7 lg:pr-8">
            <motion.div
              variants={badgeBlurIn(0.1)}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-3"
            >
              <span className="w-2 h-2 bg-gold" />
              <span className="font-mono text-[11px] sm:text-xs text-ash tracking-[0.3em] uppercase font-semibold">
                Release 001 — First Allocation
              </span>
            </motion.div>

            <h1 className="font-serif font-bold uppercase text-ink leading-[0.92] tracking-[-0.02em] select-none">
              <motion.span
                variants={motionBlurIn(0.22)}
                initial="hidden"
                animate="visible"
                className="block text-[15vw] sm:text-[11vw] lg:text-[7.25rem]"
              >
                Lawrence
              </motion.span>
              <motion.span
                variants={motionBlurIn(0.34)}
                initial="hidden"
                animate="visible"
                className="block text-[15vw] sm:text-[11vw] lg:text-[7.25rem]"
              >
                Monroe
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE.cinematicOut, delay: 0.62 }}
              className="font-serif italic text-xl sm:text-2xl text-ash max-w-md leading-relaxed"
            >
              Two pieces. One uniform. Heavyweight cotton, architectural line.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE.cinematicOut, delay: 0.75 }}
              className="flex flex-wrap items-center gap-8 pt-2"
            >
              <Magnetic strength={0.22}>
                <a
                  href="#capsule"
                  onClick={scrollToCapsule}
                  className="group bg-ink hover:bg-gold text-paper hover:text-black px-7 py-3.5 font-mono text-xs font-bold tracking-[0.25em] uppercase transition-colors duration-300 flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-dark"
                >
                  ENTER THE DROP
                  <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
                </a>
              </Magnetic>

              <Link
                to="/vault"
                className="gold-line-sweep inline-flex items-center gap-1.5 font-mono text-xs text-ink hover:text-gold-dark tracking-[0.25em] uppercase transition-colors"
              >
                EXPLORE THE ARCHIVE
                <ArrowUpRight size={13} />
              </Link>
            </motion.div>
          </motion.div>

          {/* ——— The mounted print ——— */}
          <div className="lg:col-span-5 relative">
            <motion.div style={{ x: printX, y: printY }} className="flex justify-center">
              <motion.div style={{ y: printExitY }} className="w-full max-w-[380px]">
                <motion.div
                  initial={{ opacity: 0, scale: 1.04, filter: 'blur(14px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 1.1, ease: EASE.cinematicOut, delay: 0.3 }}
                  className="relative bg-white/60 border border-line-dark p-2.5 shadow-[0_24px_60px_rgba(10,10,10,0.14)]"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <motion.img
                      src="/models/LM_P01_02_BLACK_BLACK_2.jpg"
                      alt="LM Shorts 001 — campaign plate, black arch colorway"
                      className="h-full w-full object-cover grayscale contrast-125"
                      animate={kenBurns}
                    />
                    <EditorialFaceBlur top="9%" left="50%" width="78px" height="26px" label="LM / [001]" />
                  </div>
                  <div className="flex items-center justify-between px-1 pt-2.5 pb-1 font-mono text-[9px] tracking-[0.2em] text-ash uppercase">
                    <span className="text-gold-dark font-bold">PLATE 02 — 35MM</span>
                    <span>SILVER-GELATIN</span>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* ——— Bottom hairline meta ——— */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.05, duration: 0.8 }}
          className="border-t border-line-dark pt-5 mt-12 flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-ash uppercase"
        >
          <span>EDITION 01 / 02</span>
          <span className="hidden sm:inline">480GSM COMBED COTTON</span>
          <span className="text-gold-dark font-bold">ALLOCATION ACTIVE</span>
        </motion.div>
      </motion.div>
    </section>
  );
};
