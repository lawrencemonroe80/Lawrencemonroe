import React, { useRef } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';

/**
 * <TiltCard> — 3D cursor tilt + dynamic glare (§9 material interaction)
 * --------------------------------------------------------------------
 * Physical rig: pointer position drives rotateX/rotateY through springs
 * (the card behaves like a rigid plate on a gimbal), while a champagne
 * specular highlight tracks the cursor across the glass surface — the
 * glare layer is a radial gradient whose origin follows the pointer.
 *
 * Disabled for reduced-motion users and coarse (touch) pointers.
 *
 * Usage:
 *   <TiltCard maxTilt={4}>
 *     <Link className="block aspect-[4/5] …">…</Link>
 *   </TiltCard>
 */
export const TiltCard: React.FC<{
  children: React.ReactNode;
  maxTilt?: number; // degrees at the viewport edges
  glare?: boolean;
  className?: string;
}> = ({ children, maxTilt = 5, glare = true, className = '' }) => {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const coarse =
    typeof window !== 'undefined' &&
    (window.matchMedia?.('(pointer: coarse)').matches || 'ontouchstart' in window);
  const disabled = Boolean(reduced || coarse);

  const ref = useRef<HTMLDivElement>(null);

  // Pointer position normalized 0…1 within the card
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const hover = useMotionValue(0);

  // Rigid-plate gimbal springs
  const gimbal = { stiffness: 260, damping: 24, mass: 0.6 };
  const sx = useSpring(px, gimbal);
  const sy = useSpring(py, gimbal);

  const rotateY = useTransform(sx, [0, 1], [-maxTilt, maxTilt]);
  const rotateX = useTransform(sy, [0, 1], [maxTilt, -maxTilt]);

  // Dynamic glare — champagne specular that tracks the cursor
  const glareX = useTransform(sx, (v) => v * 100);
  const glareY = useTransform(sy, (v) => v * 100);
  const glareBg = useMotionTemplate`radial-gradient(360px circle at ${glareX}% ${glareY}%, rgba(252, 246, 186, 0.14), rgba(255, 255, 255, 0.05) 32%, transparent 62%)`;
  const glareOpacity = useSpring(hover, { stiffness: 180, damping: 30 });

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set(Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1));
    py.set(Math.min(Math.max((e.clientY - rect.top) / rect.height, 0), 1));
    hover.set(1);
  };

  const handleLeave = () => {
    px.set(0.5);
    py.set(0.5);
    hover.set(0);
  };

  if (disabled) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={className} style={{ perspective: 1100 }}>
      <motion.div
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative will-change-transform"
      >
        {children}
        {/* Dynamic specular glare across the glass surface */}
        {glare && (
          <motion.div
            aria-hidden
            className="absolute inset-0 z-[15] pointer-events-none"
            style={{ backgroundImage: glareBg, opacity: glareOpacity }}
          />
        )}
      </motion.div>
    </div>
  );
};
