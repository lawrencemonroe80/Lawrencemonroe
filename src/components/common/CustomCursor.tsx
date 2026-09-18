import React, { useEffect, useState } from 'react';
import { animate, motion, useMotionValue, useSpring, useTransform, useVelocity } from 'framer-motion';
import { SPRING } from '../../motion/tokens';

/**
 * LM MAGNETIC CURSOR v2
 * ---------------------
 * State machine driven by `data-cursor` attributes on any element:
 *
 *   data-cursor="view"              → pill badge "VIEW LOOKBOOK"
 *   data-cursor="drag"              → pill badge "DRAG"
 *   data-cursor="inspect"           → pill badge "INSPECT"
 *   data-cursor="link"              → interactive ring (default for a/button)
 *   data-cursor-label="CUSTOM TEXT" → override badge copy
 *
 * The outer ring squashes along its velocity vector (magnetic inertia)
 * and rotates into its direction of travel. While a state pill is
 * showing, those velocity effects blend out so badges stay legible.
 * The core dot stays locked to the pointer. Native cursor is hidden on
 * fine pointers via `body.lm-cursor-active` (see index.css).
 */

type CursorState = 'default' | 'link' | 'view' | 'drag' | 'inspect';

const STATE_LABEL: Partial<Record<CursorState, string>> = {
  view: 'VIEW LOOKBOOK',
  drag: 'DRAG',
  inspect: 'INSPECT',
};

const PILL_STATES: CursorState[] = ['view', 'drag', 'inspect'];

const isPillState = (v: string): v is 'view' | 'drag' | 'inspect' =>
  PILL_STATES.includes(v as CursorState);

export const CustomCursor: React.FC = () => {
  const [state, setState] = useState<CursorState>('default');
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);

  const isPill = PILL_STATES.includes(state);
  const badgeText = label ?? (isPill ? STATE_LABEL[state] ?? '' : '');

  // ---- Raw pointer telemetry ----
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Core dot: near-instant lock. Ring: heavy lens-barrel lag.
  const coreX = useSpring(x, SPRING.cursorCore);
  const coreY = useSpring(y, SPRING.cursorCore);
  const ringX = useSpring(x, SPRING.cursorRing);
  const ringY = useSpring(y, SPRING.cursorRing);

  // ---- Velocity-reactive squash (the "magnetic" drag of the ring) ----
  const xVel = useVelocity(ringX);
  const yVel = useVelocity(ringY);
  const speed = useTransform(
    [xVel, yVel],
    ([vx, vy]: number[]) => Math.min(Math.hypot(vx, vy), 2400)
  );
  const stretch = useTransform(speed, [0, 2400], [0, 0.32]);
  const headingRaw = useTransform(
    [xVel, yVel],
    ([vx, vy]: number[]) => (Math.hypot(vx, vy) > 40 ? (Math.atan2(vy, vx) * 180) / Math.PI : 0)
  );

  // Blend factor: 1 while a pill badge is showing — kills squash/rotation
  // so labels remain legible at speed.
  const pillMix = useMotionValue(0);

  useEffect(() => {
    const controls = animate(pillMix, isPill ? 1 : 0, {
      duration: 0.18,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [isPill, pillMix]);

  const scaleX = useTransform(
    [stretch, pillMix],
    ([s, p]: number[]) => 1 + s * (1 - p)
  );
  const scaleY = useTransform(
    [stretch, pillMix],
    ([s, p]: number[]) => 1 / (1 + s * (1 - p))
  );
  const heading = useTransform(
    [headingRaw, pillMix],
    ([h, p]: number[]) => h * (1 - p)
  );

  // ---- Activation + state detection ----
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    if (reduced || coarse) return;

    setEnabled(true);
    document.body.classList.add('lm-cursor-active');

    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const tagged = target.closest<HTMLElement>('[data-cursor]');
      if (tagged) {
        const value = tagged.dataset.cursor ?? 'link';
        const pill = isPillState(value);
        setState(pill ? value : 'link');
        setLabel(tagged.dataset.cursorLabel ?? (pill ? STATE_LABEL[value] ?? null : null));
        return;
      }

      const interactive = target.closest('a, button, input, select, textarea, [role="button"], label');
      setState(interactive ? 'link' : 'default');
      setLabel(null);
    };

    const handleLeave = () => setVisible(false);

    window.addEventListener('mousemove', handleMove, { passive: true });
    document.addEventListener('mouseleave', handleLeave);

    return () => {
      document.body.classList.remove('lm-cursor-active');
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* CORE — precision gold dot */}
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 z-[10000] pointer-events-none"
        style={{ x: coreX, y: coreY }}
      >
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-gold mix-blend-difference"
          animate={{
            width: isPill ? 4 : 6,
            height: isPill ? 4 : 6,
            opacity: visible ? 1 : 0,
          }}
          transition={SPRING.cursorCore}
        />
      </motion.div>

      {/* RING / STATE PILL — lags, squashes along velocity vector */}
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ x: ringX, y: ringY, rotate: heading }}
      >
        <motion.div
          className="flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
          style={{ scaleX, scaleY }}
        >
          <motion.div
            className="relative flex items-center justify-center rounded-full border"
            initial={false}
            animate={{
              width: isPill ? 118 : state === 'link' ? 44 : 26,
              height: isPill ? 118 : state === 'link' ? 44 : 26,
              borderColor: isPill || state === 'link' ? 'rgba(173,138,72,0.85)' : 'rgba(231,225,215,0.32)',
              backgroundColor: isPill ? 'rgba(13,13,13,0.55)' : 'rgba(13,13,13,0)',
              opacity: visible ? 1 : 0,
            }}
            transition={{ type: 'spring', stiffness: 320, damping: 26, mass: 0.5 }}
            style={{
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
            }}
          >
            {/* Crosshair ticks at pill cardinal points */}
            {isPill && (
              <>
                <span className="absolute -top-1 left-1/2 w-px h-2 bg-gold" />
                <span className="absolute -bottom-1 left-1/2 w-px h-2 bg-gold" />
                <span className="absolute -left-1 top-1/2 h-px w-2 bg-gold" />
                <span className="absolute -right-1 top-1/2 h-px w-2 bg-gold" />
              </>
            )}
            {/* Badge label */}
            <motion.span
              className="absolute inset-0 flex items-center justify-center"
              initial={false}
              animate={{ opacity: isPill ? 1 : 0, scale: isPill ? 1 : 0.6 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="font-mono text-[9px] font-semibold tracking-[0.22em] text-bone text-center leading-tight px-3">
                {badgeText}
              </span>
            </motion.span>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
};
