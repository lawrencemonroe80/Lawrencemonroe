import React, { useRef } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { VELOCITY_DISTORTION } from '../../motion/tokens';

/**
 * Variable kinetic text — distorted by scroll velocity.
 */
export const VelocityText: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollY } = useScroll();
  const lastScroll = useRef(0);
  const lastTime = useRef(Date.now());
  const velocity = useRef(0);

  const weight = useRef(0);
  const width = useRef(0);

  React.useEffect(() => {
    return useMotionValueEvent(scrollY, 'change', (v) => {
      const now = Date.now();
      const dt = Math.max(now - lastTime.current, 1);
      const dv = Math.abs(v - lastScroll.current);
      const v_px_s = (dv / dt) * 1000;
      velocity.current = Math.min(v_px_s, VELOCITY_DISTORTION.maxVelocity);

      const ratio = velocity.current / VELOCITY_DISTORTION.maxVelocity;
      weight.current = VELOCITY_DISTORTION.restWeight - (VELOCITY_DISTORTION.restWeight - VELOCITY_DISTORTION.stretchWeight) * ratio;
      width.current = VELOCITY_DISTORTION.restWidth + (VELOCITY_DISTORTION.stretchWidth - VELOCITY_DISTORTION.restWidth) * ratio;

      if (ref.current) {
        ref.current.style.fontVariationSettings = `'wght' ${Math.round(weight.current)}, 'wdth' ${Math.round(width.current)}`;
      }

      lastScroll.current = v;
      lastTime.current = now;
    });
  }, [scrollY]);

  return (
    <span ref={ref} className={`font-kinetic block ${className}`}>
      {children}
    </span>
  );
};
