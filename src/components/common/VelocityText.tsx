import React from 'react';
import { motion, useMotionTemplate, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { VELOCITY_DISTORTION } from '../../motion/tokens';

/**
 * <VelocityText /> — variable-font distortion driven by scroll velocity.
 *
 * At rest the type sits in its condensed editorial cut (wght 760 / wdth 82).
 * As scroll accelerates, the Archivo variable axes stretch toward
 * wght 480 / wdth 125 — the headline physically strains under momentum,
 * like tape drag on an analog deck. Springs back on settle.
 */
export const VelocityText: React.FC<{
  children: string;
  className?: string;
}> = ({ children, className = '' }) => {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);

  // Heavily damped smoothing — reads as mass, not jitter
  const smoothVelocity = useSpring(velocity, {
    stiffness: 380,
    damping: 48,
    mass: 0.8,
  });

  const distortion = useTransform(
    smoothVelocity,
    (v) => Math.min(Math.abs(v), VELOCITY_DISTORTION.maxVelocity) / VELOCITY_DISTORTION.maxVelocity
  );

  const weight = useTransform(
    distortion,
    [0, 1],
    [VELOCITY_DISTORTION.restWeight, VELOCITY_DISTORTION.stretchWeight]
  );
  const widthAxis = useTransform(
    distortion,
    [0, 1],
    [VELOCITY_DISTORTION.restWidth, VELOCITY_DISTORTION.stretchWidth]
  );

  const fontVariationSettings = useMotionTemplate`'wght' ${weight}, 'wdth' ${widthAxis}`;

  // Slight vertical shear at speed (tape-deck skew)
  const skewY = useTransform(
    smoothVelocity,
    [-VELOCITY_DISTORTION.maxVelocity, 0, VELOCITY_DISTORTION.maxVelocity],
    [2.5, 0, -2.5]
  );

  return (
    <motion.span
      className={`font-kinetic block ${className}`}
      style={{ fontVariationSettings, skewY }}
    >
      {children}
    </motion.span>
  );
};
