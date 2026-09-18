import React, { useEffect, useRef, useState } from 'react';
import { motion, animate, useMotionValue, useSpring, useTransform, useVelocity } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { AssetInspector } from '../common/AssetInspector';
import { VelocityText } from '../common/VelocityText';
import { EditorialFaceBlur } from '../common/EditorialFaceBlur';
import { DRAG_INERTIA, EASE } from '../../motion/tokens';

/**
 * SECTION — HORIZONTAL SPEED INDEX (INERTIA DRAG + SNAP)
 *
 * Scroll mechanics:
 *  - Fling-physics drag track (power 0.18 / timeConstant 280ms) that
 *    decelerates with analog inertia and snaps to the nearest plate.
 *  - Live drag velocity shears the whole track (±3.5°) — the plates
 *    "speed lean" while the track is in motion.
 *  - Progress rail + live velocity telemetry readout in mm/s.
 *  - Plates host the <AssetInspector /> macro lens; cursor shows DRAG on
 *    the track, INSPECT over a plate.
 */

interface GalleryPlate {
  id: string;
  frameNo: string;
  image: string;
  macroImage?: string;
  title: string;
  tag: string;
  alt: string;
  faceBlur?: boolean;
  classified?: boolean;
}

const PLATES: GalleryPlate[] = [
  {
    id: 'g-01',
    frameNo: 'PLATE 01',
    image: '/models/LM_P01_02_BLACK_BLACK.jpg',
    macroImage: '/images/campaign-contact-fabric.jpg',
    title: 'ARCH / FRONTAL',
    tag: 'LOOK 001 — BLACK',
    alt: 'LM Shorts 001 frontal campaign plate',
    faceBlur: true,
  },
  {
    id: 'g-02',
    frameNo: 'PLATE 02',
    image: '/models/LM_P01_02_GRAY_.jpg',
    macroImage: '/images/campaign-contact-hardware.jpg',
    title: 'ARCH / PROFILE',
    tag: 'LOOK 002 — HEATHER',
    alt: 'LM Shorts 002 profile campaign plate',
    faceBlur: true,
  },
  {
    id: 'g-03',
    frameNo: 'PLATE 03',
    image: '/images/campaign-contact-stride.jpg',
    macroImage: '/images/campaign-contact-fabric.jpg',
    title: 'STRIDE STUDY',
    tag: 'MOVEMENT / 1/250s',
    alt: 'Stride movement study in LM Shorts',
  },
  {
    id: 'g-04',
    frameNo: 'PLATE 04',
    image: '/images/campaign-hero-motion.jpg',
    macroImage: '/images/shorts-002-detail.jpg',
    title: 'CANTILEVER REST',
    tag: 'SEATED / CHROME',
    alt: 'Seated study on chrome cantilever chair',
    faceBlur: true,
  },
  {
    id: 'g-05',
    frameNo: 'PLATE 05',
    image: '/images/archive-shirt-teaser.jpg',
    title: 'HEADWEAR / ARCHIVE',
    tag: 'CLASSIFIED — NEXT',
    alt: 'Unreleased archive headwear teaser',
    classified: true,
  },
  {
    id: 'g-06',
    frameNo: 'PLATE 06',
    image: '/images/archive-hat-teaser.jpg',
    title: 'TORSO / ARCHIVE',
    tag: 'CLASSIFIED — NEXT',
    alt: 'Unreleased archive torso teaser',
    classified: true,
  },
];

const GAP = 24; // px — matches flex gap-6

export const SectionHorizontalGallery: React.FC = () => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxDrag, setMaxDrag] = useState(0);
  const [step, setStep] = useState(400);
  const [isDragging, setIsDragging] = useState(false);

  const x = useMotionValue(0);
  const xVelocity = useVelocity(x);
  const smoothVelocity = useSpring(xVelocity, { stiffness: 320, damping: 46, mass: 0.7 });

  // Speed-lean shear: track skews against its direction of travel
  const skewX = useTransform(smoothVelocity, [-4200, 0, 4200], [3.5, 0, -3.5]);
  // Live telemetry: px/s mapped to a 0–99 readout
  const speedReadout = useTransform(smoothVelocity, (v) =>
    String(Math.min(Math.abs(Math.round(v / 42)), 99)).padStart(2, '0')
  );
  const progress = useTransform(x, [-maxDrag || -1, 0], [1, 0]);

  useEffect(() => {
    const measure = () => {
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!viewport || !track) return;
      const overflow = track.scrollWidth - viewport.clientWidth;
      setMaxDrag(Math.max(overflow, 0));
      const plate = track.querySelector<HTMLElement>('[data-plate]');
      if (plate) setStep(plate.offsetWidth + GAP);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  /** Snap target: nearest plate boundary within the drag range. */
  const snapTo = (target: number) => {
    if (!step) return target;
    const snapped = Math.round(target / step) * step;
    return Math.min(0, Math.max(snapped, -maxDrag));
  };

  const nudge = (dir: -1 | 1) => {
    const target = snapTo(Math.min(0, Math.max(x.get() + dir * step, -maxDrag)));
    animate(x, target, {
      type: 'spring',
      stiffness: 210,
      damping: 30,
      mass: 0.9,
    });
  };

  return (
    <section id="speed-index" className="relative w-full bg-black text-bone py-24 sm:py-32 border-b border-line overflow-hidden">
      <div className="absolute inset-0 bg-archival-grid opacity-30 pointer-events-none" />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 relative z-10 mb-12 sm:mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-line pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gold inline-block" />
              <span className="font-mono text-xs text-gold tracking-[0.25em] uppercase font-bold">
                SPEED INDEX / DRAG TO INSPECT
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl uppercase text-bone">
              <VelocityText>HIGH VELOCITY ARCHIVE</VelocityText>
            </h2>
          </div>

          <div className="flex items-center gap-6">
            {/* Live velocity telemetry */}
            <div className="hidden sm:flex items-center gap-3 font-mono text-[10px] tracking-[0.18em] text-smoke uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse-subtle" />
              <span>
                VELOCITY <motion.span className="text-gold font-bold">{speedReadout}</motion.span> M/S
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => nudge(-1)}
                aria-label="Previous plates"
                className="p-2 border border-line bg-graphite/40 hover:border-gold hover:text-gold text-bone transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-gold"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                onClick={() => nudge(1)}
                aria-label="Next plates"
                className="p-2 border border-line bg-graphite/40 hover:border-gold hover:text-gold text-bone transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-gold"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Drag track */}
      <div
        ref={viewportRef}
        className="relative z-10 overflow-hidden"
        data-cursor="drag"
        onPointerUp={() => setIsDragging(false)}
        onPointerLeave={() => setIsDragging(false)}
      >
        <motion.div
          ref={trackRef}
          drag="x"
          style={{ x }}
          dragConstraints={{ left: -maxDrag, right: 0 }}
          dragElastic={0.08}
          dragTransition={{
            power: DRAG_INERTIA.power,
            timeConstant: DRAG_INERTIA.timeConstant,
            bounceStiffness: DRAG_INERTIA.bounceStiffness,
            bounceDamping: DRAG_INERTIA.bounceDamping,
            modifyTarget: snapTo,
          }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          className="flex gap-6 w-max px-5 sm:px-8 md:px-12 py-8 select-none touch-pan-y cursor-grab active:cursor-grabbing"
        >
          {PLATES.map((plate) => (
            <motion.figure
              key={plate.id}
              data-plate
              style={{ skewX }}
              className={`group relative flex-shrink-0 w-[74vw] sm:w-[44vw] lg:w-[27vw] max-w-[420px] border border-line bg-graphite/60 flex flex-col ${
                isDragging ? 'pointer-events-none' : ''
              }`}
            >
              {/* Plate head */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-line bg-black/70 font-mono text-[9px] tracking-[0.2em]">
                <span className="text-gold font-bold">{plate.frameNo}</span>
                <span className="text-smoke">{plate.tag}</span>
              </div>

              {/* Inspectable image plate */}
              <div className="relative fx-chromatic">
                <AssetInspector
                  image={plate.image}
                  macroImage={plate.macroImage}
                  zoom={2.6}
                  alt={plate.alt}
                  className="aspect-[4/5]"
                  imgClassName={`grayscale contrast-125 brightness-90 group-hover:brightness-100 transition-[filter] duration-500 ${
                    plate.classified ? 'opacity-70' : ''
                  }`}
                  spec={
                    plate.classified
                      ? { title: 'ARCHIVE LOCK', lines: ['STATUS: SEALED', 'RELEASE: NEXT ALLOCATION'] }
                      : undefined
                  }
                >
                  {plate.faceBlur && (
                    <EditorialFaceBlur top="11%" left="50%" width="70px" height="24px" label="LM" />
                  )}
                  <div className="fx-moire fx-moire-hover absolute inset-0 z-[6] opacity-0 pointer-events-none" />
                  {plate.classified && (
                    <div className="absolute inset-x-0 bottom-0 z-[7] bg-archive-red/85 text-bone font-mono text-[9px] px-2 py-1 uppercase tracking-[0.2em] font-bold text-center">
                      CLASSIFIED / NEXT ALLOCATION
                    </div>
                  )}
                </AssetInspector>
              </div>

              {/* Plate footer */}
              <figcaption className="flex items-center justify-between px-3 py-2.5 border-t border-line bg-black/50">
                <span className="font-mono text-[10px] font-bold tracking-[0.16em] text-bone uppercase group-hover:text-gold transition-colors">
                  {plate.title}
                </span>
                <span className="font-mono text-[9px] tracking-[0.2em] text-smoke">
                  {plate.macroImage ? 'HOVER / INSPECT' : 'SEALED'}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>

      {/* Progress rail */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 mt-6 relative z-10">
        <div className="flex items-center gap-5">
          <span className="font-mono text-[9px] tracking-[0.25em] text-smoke uppercase">Track</span>
          <div className="relative h-px flex-1 bg-line/60">
            <motion.div className="absolute inset-y-0 left-0 w-full bg-gold origin-left" style={{ scaleX: progress }} />
          </div>
          <span className="font-mono text-[9px] tracking-[0.25em] text-smoke uppercase">
            {PLATES.length} Plates
          </span>
        </div>
      </div>
    </section>
  );
};
