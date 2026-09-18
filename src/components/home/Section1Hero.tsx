import React, { useRef, useState } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { brandAssets } from '../../data/assets';
import { EditorialFaceBlur } from '../common/EditorialFaceBlur';
import { Magnetic } from '../common/Magnetic';
import {
  EASE,
  DURATION,
  KEN_BURNS,
  SCROLL,
  SPRING,
  badgeBlurIn,
  motionBlurIn,
} from '../../motion/tokens';

/**
 * SECTION 1 — HERO / "PHOTOSHOOT IN MOTION"
 *
 * A cursor-driven 3D camera rig:
 *  - Every campaign frame sits at a different depth and receives a
 *    different parallax multiplier, so the whole plates move
 *    synchronously in depth on cursor move.
 *  - Frames run continuous Ken Burns (micro-zoom + horizontal camera pan).
 *  - Typography & badges enter through cinematic motion-blur ramps.
 *  - Scroll-out: the rig recedes (scale/blur) while layers drift at
 *    per-depth rates.
 */

// Depth factors — px of lateral travel per unit of normalized cursor offset
const DEPTH = {
  monogram: 10,
  frameA: 34,
  frameB: -48, // opposite travel = reads as nearer
  frameC: 20,
  cutout: 26,
  headline: -12,
} as const;

export const Section1Hero: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [isHoveredCTA, setIsHoveredCTA] = useState(false);

  /* ---- CURSOR RIG — normalized (-0.5 … 0.5), heavy damped ---- */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rigX = useSpring(mx, SPRING.parallaxRig);
  const rigY = useSpring(my, SPRING.parallaxRig);

  // 3D stage tilt (±2.2°) — the "dolly head"
  const rotateY = useTransform(rigX, [-0.5, 0.5], [2.2, -2.2]);
  const rotateX = useTransform(rigY, [-0.5, 0.5], [-2.2, 2.2]);

  // Per-layer parallax translations
  const monoX = useTransform(rigX, [-0.5, 0.5], [-DEPTH.monogram, DEPTH.monogram]);
  const frameAX = useTransform(rigX, [-0.5, 0.5], [-DEPTH.frameA, DEPTH.frameA]);
  const frameAY = useTransform(rigY, [-0.5, 0.5], [-DEPTH.frameA * 0.62, DEPTH.frameA * 0.62]);
  const frameBX = useTransform(rigX, [-0.5, 0.5], [-DEPTH.frameB, DEPTH.frameB]);
  const frameBY = useTransform(rigY, [-0.5, 0.5], [-DEPTH.frameB * 0.6, DEPTH.frameB * 0.6]);
  const frameBRot = useTransform(rigX, [-0.5, 0.5], [-3.4, -1.8]);
  const frameCX = useTransform(rigX, [-0.5, 0.5], [-DEPTH.frameC, DEPTH.frameC]);
  const cutoutX = useTransform(rigX, [-0.5, 0.5], [-DEPTH.cutout, DEPTH.cutout]);
  const cutoutY = useTransform(rigY, [-0.5, 0.5], [-DEPTH.cutout * 0.6, DEPTH.cutout * 0.6]);
  const headlineX = useTransform(rigX, [-0.5, 0.5], [-DEPTH.headline, DEPTH.headline]);

  /* ---- SCROLL EXIT CHOREOGRAPHY ---- */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: [...SCROLL.pinned],
  });
  const stageScale = useTransform(scrollYProgress, [0, 1], [1, 0.955]);
  const stageBlurPx = useTransform(scrollYProgress, [0, 1], [0, 7]);
  const stageBlur = useMotionTemplate`blur(${stageBlurPx}px)`;
  const dim = useTransform(scrollYProgress, [0, 1], [0, 0.6]);

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const frameAExitY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const frameBExitY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const frameCExitY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const cutoutExitY = useTransform(scrollYProgress, [0, 1], [0, -160]);

  /* ---- LIVE CURSOR TELEMETRY READOUT ---- */
  const curX = useTransform(rigX, (v) => ((v + 0.5) * 1000).toFixed(0).padStart(4, '0'));
  const curY = useTransform(rigY, (v) => ((v + 0.5) * 1000).toFixed(0).padStart(4, '0'));

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleScrollToManifesto = () => {
    document.getElementById('manifesto')?.scrollIntoView({ behavior: 'smooth' });
  };

  const kenBurns = reduceMotion ? undefined : KEN_BURNS.panZoom;
  const kbTransition = (delay: number) =>
    kenBurns ? { ...kenBurns.transition, delay } : undefined;

  return (
    <section
      id="hero"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="fx-grain fx-scanlines relative w-full min-h-screen bg-black overflow-hidden border-b border-line selection:bg-gold selection:text-black"
      style={{ perspective: '1400px' }}
    >
      {/* AMBIENT BACKDROP — archival grid + receding monogram (deepest layer) */}
      <div className="absolute inset-0 bg-archival-grid opacity-60 pointer-events-none" />
      <motion.div style={{ x: monoX }} className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none opacity-[0.05] w-[62vw] max-w-[640px]">
          <img src={brandAssets.monogram} alt="" className="w-full h-auto object-contain" />
        </div>
        {/* Concrete grey ambience wash */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(136,136,136,0.08),transparent_55%)]" />
      </motion.div>

      {/* ═══ 3D CAMERA STAGE ═══ */}
      <motion.div
        style={{ rotateX, rotateY, scale: stageScale, filter: stageBlur, transformStyle: 'preserve-3d' }}
        className="absolute inset-0 z-[1]"
      >
        {/* LAYER A — MULTI-ANGLE MODEL FRAME / BLACK ARCH (right, mid depth) */}
        <motion.div
          style={{ x: frameAX, y: frameAY }}
          className="absolute right-[2%] md:right-[6%] top-[10%] w-[46vw] sm:w-[30vw] md:w-[23vw] max-w-[340px] z-[1]"
        >
          <motion.div style={{ y: frameAExitY }} className="will-change-transform">
            <motion.div
              initial={{ opacity: 0, scale: 1.06, filter: 'blur(18px)' }}
              animate={{ opacity: 0.62, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.1, ease: EASE.cinematicOut, delay: 0.15 }}
              className="relative border border-line bg-graphite overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.85)]"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <motion.img
                  src="/models/LM_P01_02_BLACK_BLACK_2.jpg"
                  alt="Campaign plate — LM Shorts 001, black arch colorway, angle two"
                  className="h-full w-full object-cover grayscale contrast-125 brightness-90"
                  animate={kenBurns}
                />
                <EditorialFaceBlur top="9%" left="50%" width="72px" height="24px" label="LM / [001]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
              </div>
              <div className="flex items-center justify-between px-2.5 py-1.5 bg-black/80 font-mono text-[8px] tracking-[0.18em] text-smoke">
                <span className="text-gold font-semibold">CAM A / 35MM</span>
                <span>PLATE 02</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* LAYER B — MULTI-ANGLE MODEL FRAME / HEATHER COBALT (left, near depth, counter-travel) */}
        <motion.div
          style={{ x: frameBX, y: frameBY }}
          className="hidden lg:block absolute left-[4%] top-[16%] w-[17vw] max-w-[260px] z-[2]"
        >
          <motion.div style={{ y: frameBExitY, rotate: frameBRot }} className="will-change-transform">
            <motion.div
              initial={{ opacity: 0, scale: 1.08, filter: 'blur(20px)' }}
              animate={{ opacity: 0.5, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.1, ease: EASE.cinematicOut, delay: 0.3 }}
              className="relative border border-line bg-graphite overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.85)]"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <motion.img
                  src="/models/LM_P01_02_GRAY_2.jpg"
                  alt="Campaign plate — LM Shorts 002, heather cobalt colorway, angle two"
                  className="h-full w-full object-cover grayscale contrast-125 brightness-90"
                  animate={kenBurns}
                  transition={kbTransition(-9)}
                />
                <EditorialFaceBlur top="10%" left="50%" width="66px" height="22px" label="LM / [002]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
              </div>
              <div className="flex items-center justify-between px-2.5 py-1.5 bg-black/80 font-mono text-[8px] tracking-[0.18em] text-smoke">
                <span className="text-gold font-semibold">CAM B / 80MM</span>
                <span>PLATE 04</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* LAYER C — STRIDE STUDY (far right, deepest frame) */}
        <motion.div
          style={{ x: frameCX }}
          className="hidden md:block absolute right-[26%] bottom-[9%] w-[15vw] max-w-[220px] z-[1]"
        >
          <motion.div style={{ y: frameCExitY }} className="will-change-transform">
            <motion.div
              initial={{ opacity: 0, scale: 1.05, filter: 'blur(16px)' }}
              animate={{ opacity: 0.4, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1, ease: EASE.cinematicOut, delay: 0.45 }}
              className="relative border border-line/70 bg-graphite overflow-hidden"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <motion.img
                  src="/models/LM_P01_02_BLACK_BLACK.jpg"
                  alt="Campaign plate — LM Shorts 001, black arch colorway, angle one"
                  className="h-full w-full object-cover grayscale contrast-125 brightness-[0.85]"
                  animate={kenBurns}
                  transition={kbTransition(-17)}
                />
                <EditorialFaceBlur top="8%" left="50%" width="60px" height="20px" label="LM / [001]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>
              <div className="flex items-center justify-between px-2 py-1 bg-black/80 font-mono text-[8px] tracking-[0.16em] text-smoke">
                <span className="text-gold/80 font-semibold">CAM C / TELE</span>
                <span>PLATE 01</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* LAYER D — THE PIECE ITSELF (cutout, nearest the lens) */}
        <div className="absolute left-1/2 md:left-[41%] top-[21%] md:top-[17%] w-[70vw] sm:w-[48vw] md:w-[38vw] max-w-[520px] pointer-events-none z-[3]">
          {/* class-based centering lives on this plain div; framer x/y on the next */}
          <div className="w-full -translate-x-1/2 md:translate-x-0 drop-shadow-[0_40px_60px_rgba(0,0,0,0.95)]">
          <motion.div style={{ x: cutoutX, y: cutoutY }}>
          <motion.div style={{ y: cutoutExitY }} className="will-change-transform">
            <motion.div
              initial={{ opacity: 0, y: 60, filter: 'blur(22px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: DURATION.epic, ease: EASE.cinematicOut, delay: 0.55 }}
              className="relative"
            >
              <img
                src="/images/shorts-001-cutout.jpg"
                alt="LM Shorts 001 with signature vertical arch graphic"
                className="w-full h-auto object-contain"
                draggable={false}
              />
              <EditorialFaceBlur top="6%" left="50%" width="92px" height="32px" label="LAWRENCE MONROE" />
              {/* Archival pin spec */}
              <motion.div
                variants={badgeBlurIn(1.05)}
                initial="hidden"
                animate="visible"
                className="absolute top-[34%] right-[6%] glass-panel px-2.5 py-1 flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 bg-gold" />
                <span className="font-mono text-[9px] text-bone tracking-[0.18em] font-semibold">
                  SPEC / LMS-001
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll-out dim veil */}
      <motion.div style={{ opacity: dim }} className="absolute inset-0 bg-black pointer-events-none z-[4]" />

      {/* ═══ TYPE & CHROME OVERLAY ═══ */}
      <motion.div style={{ y: contentY }} className="relative z-10 flex min-h-screen flex-col justify-between pt-24 sm:pt-28 pb-10 sm:pb-14">
        {/* TOP BANNER TAG */}
        <div className="max-w-7xl w-full mx-auto px-5 sm:px-8 md:px-12 relative z-20 flex items-center justify-between">
          <motion.div variants={badgeBlurIn(0.85)} initial="hidden" animate="visible" className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 bg-gold animate-pulse-subtle" />
            <span className="font-mono text-[11px] sm:text-xs text-gold tracking-[0.25em] uppercase font-semibold">
              RELEASE 001 / FIRST ALLOCATION
            </span>
          </motion.div>
          <motion.div
            variants={badgeBlurIn(1)}
            initial="hidden"
            animate="visible"
            className="font-mono text-[10px] text-smoke hidden sm:flex items-center gap-5 tracking-[0.3em] uppercase"
          >
            <span>PRIVATE ARCHIVE</span>
            <span className="text-gold/70">◦</span>
            <span>
              CUR X <motion.span className="text-bone/80 inline-block w-[3ch] text-right">{curX}</motion.span>{' '}
              / Y <motion.span className="text-bone/80 inline-block w-[3ch] text-right">{curY}</motion.span>
            </span>
          </motion.div>
        </div>

        {/* CENTER DISPLAY — WORDMARK */}
        <div className="max-w-7xl w-full mx-auto px-5 sm:px-8 md:px-12 relative z-20 my-auto py-10 md:py-16 pointer-events-none">
          <motion.div style={{ x: headlineX }} className="space-y-5">
            <h1 className="font-serif font-bold uppercase text-bone select-none leading-[0.92] tracking-[-0.02em] drop-shadow-[0_6px_24px_rgba(0,0,0,0.95)]">
              <motion.span
                variants={motionBlurIn(0.5)}
                initial="hidden"
                animate="visible"
                className="block text-[13.5vw] sm:text-[11vw] lg:text-[8.5rem]"
              >
                Lawrence
              </motion.span>
              <motion.span
                variants={motionBlurIn(0.62)}
                initial="hidden"
                animate="visible"
                className="block text-[13.5vw] sm:text-[11vw] lg:text-[8.5rem] text-paper"
              >
                Monroe
              </motion.span>
            </h1>

            <motion.div
              variants={badgeBlurIn(0.95)}
              initial="hidden"
              animate="visible"
              className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 pt-3 border-t border-line/50 max-w-4xl"
            >
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs sm:text-sm text-gold tracking-[0.25em] font-semibold">[001]</span>
                <span className="font-serif italic text-lg sm:text-2xl text-smoke">
                  Two pieces. One uniform.
                </span>
              </div>
              <p className="font-mono text-[11px] text-smoke max-w-sm leading-relaxed tracking-[0.08em]">
                ARCHITECTURAL SILHOUETTES CRAFTED FROM 480GSM COTTON WITH DISTRESSED ARCH GRAPHICS.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* BOTTOM CTAs & METADATA */}
        <div className="max-w-7xl w-full mx-auto px-5 sm:px-8 md:px-12 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE.cinematicOut, delay: 1.15 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-t border-line/60 pt-6"
          >
            <div className="flex items-center gap-6 sm:gap-8">
              <Magnetic strength={0.22}>
                <button
                  onClick={handleScrollToManifesto}
                  onMouseEnter={() => setIsHoveredCTA(true)}
                  onMouseLeave={() => setIsHoveredCTA(false)}
                  className="group relative bg-paper hover:bg-gold text-black px-7 py-3.5 font-mono text-xs font-bold tracking-[0.25em] uppercase transition-colors duration-300 flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold shadow-2xl"
                >
                  <span>ENTER RELEASE</span>
                  <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
                </button>
              </Magnetic>

              <Magnetic strength={0.3}>
                <Link
                  to="/shop"
                  className="group inline-flex items-center gap-1.5 font-mono text-xs text-bone hover:text-gold tracking-[0.25em] uppercase transition-colors"
                >
                  <span className="gold-line-sweep">VIEW INDEX</span>
                  <ArrowUpRight
                    size={14}
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-gold"
                  />
                </Link>
              </Magnetic>
            </div>

            <div className="flex items-center gap-6 font-mono text-[10px] text-smoke tracking-[0.15em]">
              <div>
                <span className="text-smoke/60">EDITION: </span>
                <span className="text-gold font-bold">01 / 02</span>
              </div>
              <div>
                <span className="text-smoke/60">AVAILABILITY: </span>
                <span className="text-bone">ACTIVE</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* CTA hover gold sweep line */}
      <motion.div
        className="absolute left-0 w-full h-[1px] bg-gold pointer-events-none z-30 origin-left"
        animate={{ opacity: isHoveredCTA ? 1 : 0, scaleX: isHoveredCTA ? 1 : 0 }}
        transition={{ duration: DURATION.fast * 2, ease: EASE.noirSnap }}
        style={{ bottom: '100px' }}
      />

      {/* Corner registration marks */}
      <div className="absolute top-[76px] left-4 md:left-6 w-4 h-4 border-l border-t border-gold/40 z-10 pointer-events-none" />
      <div className="absolute bottom-4 right-4 md:right-6 w-4 h-4 border-r border-b border-gold/40 z-10 pointer-events-none" />
    </section>
  );
};
