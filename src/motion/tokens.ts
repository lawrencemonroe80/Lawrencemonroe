/**
 * LAWRENCE MONROE — MOTION & ANIMATION DESIGN TOKENS
 * ---------------------------------------------------
 * Single source of truth for every easing, duration, spring and scroll
 * trigger used across the digital campaign experience.
 *
 * Reference scales:
 *  - Durations follow a 1.333 (perfect fourth) cinematic scale.
 *  - Springs model physical camera/fixture hardware (damped, heavy).
 *  - Scroll offsets are named after editorial/film operations.
 *
 * These tokens are consumed by Framer Motion. For the pure-CSS mirror
 * (keyframes + cubic-bezier strings) see `src/index.css` and
 * DESIGN_FRAMEWORK.md §4.
 */

import type { TargetAndTransition, Transition, Variants } from 'framer-motion';

/* ------------------------------------------------------------------ */
/* 1. EASINGS — the "noir" curve library                               */
/* ------------------------------------------------------------------ */

export const EASE = {
  /** Signature dolly-out. Fast attack, long silent settle. Hero & modals. */
  cinematicOut: [0.16, 1, 0.3, 1] as const,
  /** Aperture open/close. Used for enter↔exit pairs (modals, drawers). */
  aperture: [0.83, 0, 0.17, 1] as const,
  /** Sharp snap with slight overshoot. UI chips, badges, toggles. */
  noirSnap: [0.22, 1, 0.36, 1] as const,
  /** Springy mechanical catch. Magnetic buttons, cursor badges. */
  catch: [0.34, 1.56, 0.64, 1] as const,
  /** Linear shuttle for marquees / telemetry tickers. */
  shuttle: [0, 0, 1, 1] as const,
  /** Heavy friction for stacking-card falloff. */
  friction: [0.3, 0.05, 0.1, 1] as const,
} as const;

/* ------------------------------------------------------------------ */
/* 2. DURATIONS (seconds)                                              */
/* ------------------------------------------------------------------ */

export const DURATION = {
  /** Micro-feedback: hovers, ticks, cursor state swaps. */
  instant: 0.12,
  /** Buttons, chips, link underlines. */
  fast: 0.24,
  /** Default component transitions. */
  base: 0.4,
  /** Section reveals, card entrances. */
  cinematic: 0.8,
  /** Hero typography, full-bleed imagery. */
  epic: 1.2,
  /** Ambient loops (Ken Burns / grain drift). */
  ambientSlow: 24,
  ambientGlitch: 7,
} as const;

/* ------------------------------------------------------------------ */
/* 3. SPRINGS — physical hardware models                               */
/* ------------------------------------------------------------------ */

export const SPRING = {
  /** Custom cursor core dot — near-instant lock. */
  cursorCore: { type: 'spring', stiffness: 900, damping: 50, mass: 0.1 },
  /** Custom cursor outer ring — lags like a heavy lens barrel. */
  cursorRing: { type: 'spring', stiffness: 250, damping: 28, mass: 0.6 },
  /** Magnetic pull on buttons/badges. */
  magnetic: { type: 'spring', stiffness: 180, damping: 14, mass: 0.4 },
  /** Hero 3D parallax rig — heavy dolly head. */
  parallaxRig: { type: 'spring', stiffness: 60, damping: 20, mass: 1.2 },
  /** Asset Inspector lens pop. */
  inspectorLens: { type: 'spring', stiffness: 400, damping: 32, mass: 0.5 },
  /** Stacking-card settle. */
  stackSettle: { type: 'spring', stiffness: 120, damping: 26, mass: 0.9 },
} as const satisfies Record<string, Transition>;

/** Horizontal gallery inertia — fling physics + snap-to-card. */
export const DRAG_INERTIA = {
  power: 0.18,
  timeConstant: 280,
  bounceStiffness: 90,
  bounceDamping: 18,
} as const;

/* ------------------------------------------------------------------ */
/* 4. SCROLL TRIGGERS — named offsets (useScroll offset pairs)         */
/* ------------------------------------------------------------------ */

export const SCROLL = {
  /** Pin plane: element enters/exits while pinned (hero, sticky stacks). */
  pinned: ['start start', 'end start'] as const,
  /** Full pin lifecycle for stacking containers. */
  stackLifecycle: ['start start', 'end end'] as const,
  /** Parallax drift as element passes through the viewport. */
  driftThrough: ['start end', 'end start'] as const,
  /** Reveal: fires when element's leading edge hits viewport bottom. */
  reveal: ['start 92%', 'end 55%'] as const,
} as const;

/* ------------------------------------------------------------------ */
/* 5. SHARED VARIANTS                                                  */
/* ------------------------------------------------------------------ */

/** Cinematic motion-blur entrance for display typography. */
export const motionBlurIn = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 42, filter: 'blur(14px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: DURATION.epic, ease: EASE.cinematicOut, delay },
  },
});

/** Badge / chip entrance with a shorter blur ramp. */
export const badgeBlurIn = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 14, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: DURATION.cinematic, ease: EASE.noirSnap, delay },
  },
});

/** Standard fade-up used across section headers. */
export const revealUp = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.cinematic, ease: EASE.cinematicOut, delay },
  },
});

/** Continuous camera micro-zoom / pan for campaign assets (Ken Burns). */
export const KEN_BURNS: { panZoom: TargetAndTransition } = {
  /** Slow push-in with lateral camera pan. Mirror loops for seamlessness. */
  panZoom: {
    scale: [1, 1.07, 1.07, 1],
    x: ['0%', '-1.6%', '1.2%', '0%'],
    transition: {
      duration: DURATION.ambientSlow,
      ease: 'linear',
      repeat: Infinity,
      repeatType: 'mirror',
    },
  },
};

/** Velocity → distortion mapping used by <VelocityText />. */
export const VELOCITY_DISTORTION = {
  /** px/s of scroll velocity at which distortion maxes out. */
  maxVelocity: 2200,
  /** Variable-font axis ranges: rest → full velocity. */
  restWeight: 760,
  stretchWeight: 480,
  restWidth: 82, // condensed editorial cut at rest
  stretchWidth: 125, // fully expanded under scroll acceleration
} as const;

/** Asset Inspector defaults. */
export const INSPECTOR = {
  zoom: 2.8,
  lensSize: 320, // px, clamped to frame on small screens
} as const;
