import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { SPRING } from '../../motion/tokens';

/**
 * <Magnetic> — gravitational pull wrapper.
 * Children are dragged toward the pointer while it hovers within the
 * element's bounds, then spring back to origin on exit.
 *
 * @param strength 0–1 translation multiplier (default 0.28)
 */
export const Magnetic: React.FC<{
  children: React.ReactNode;
  strength?: number;
  className?: string;
}> = ({ children, strength = 0.28, className }) => {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING.magnetic);
  const springY = useSpring(y, SPRING.magnetic);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      className={className ?? 'inline-block'}
    >
      {children}
    </motion.div>
  );
};
