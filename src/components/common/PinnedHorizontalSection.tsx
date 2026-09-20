import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';

interface PinnedHorizontalSectionProps {
  children: React.ReactNode;
  /** Total number of panels to translate through */
  panelCount: number;
  /** Approximate scroll distance in viewport heights. Defaults to panelCount * 1.0 */
  durationVh?: number;
  /** Optional className applied to the outer pinned shell */
  className?: string;
}

/**
 * Hybrid pinned-section: vertical scroll drives horizontal translation of an
 * inner track that contains N panels.
 *
 * - Outer shell grows to (durationVh) viewports tall
 * - Sticky inner holds 100vh and translates the track from x:0 to
 *   x:-(panelCount-1)*100vw via framer-motion useScroll
 * - Smooth spring smoothing for cinematic feel
 * - On mobile (no horizontal scroll triggered), CSS media query below makes
 *   the inner track become a vertical stack — fallback is handled in pages
 */
export const PinnedHorizontalSection: React.FC<PinnedHorizontalSectionProps> = ({
  children,
  panelCount,
  durationVh,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.4,
  });

  // Translate from 0vw to -(panelCount - 1) * 100vw.
  // Using vw (not %) — percentage transforms on a flex container resolve
  // against the element's own width (which is panelCount * 100vw), so a
  // percent translate overshoots by panelCount. Use vw to translate by
  // viewport widths instead.
  const x = useTransform(smooth, [0, 1], ['0vw', `-${(panelCount - 1) * 100}vw`]);

  const vh = durationVh ?? Math.max(2.5, panelCount * 1.0);

  return (
    <div
      ref={ref}
      className={`pinned-shell relative ${className}`}
      style={{ height: `${vh * 100}vh` }}
      data-pinned-horizontal
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-black">
        <motion.div
          style={{ x }}
          className="flex h-full"
        >
          {React.Children.toArray(children).filter(Boolean).map((panel, i) => (
            <div
              key={i}
              className="pinned-panel flex-shrink-0 w-screen h-screen"
              data-panel-index={i}
            >
              {panel}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default PinnedHorizontalSection;
