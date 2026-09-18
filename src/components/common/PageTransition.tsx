import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE } from '../../motion/tokens';

/**
 * PAGE TRANSITIONS — dark curtain slide + content fade.
 * ----------------------------------------------------
 * On every route change a two-layer curtain sweeps across the viewport:
 * a matte void-black panel with an antique-gold leading seam, entering
 * from the right and exiting left (like a gallery scrim being pulled).
 * The new page fades up 12px underneath as the curtain clears.
 *
 * Reduced-motion: curtain disabled, simple 150ms cross-fade only.
 */

const CURTAIN_DURATION = 0.72; // s — enter 45%, hold 10%, exit 45%

const RouteCurtain: React.FC<{ pathname: string }> = ({ pathname }) => {
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        className="fixed inset-0 z-[90] pointer-events-none"
        initial={{ x: '100%' }}
        animate={{ x: ['100%', '0%', '0%', '-100%'] }}
        transition={{
          duration: CURTAIN_DURATION,
          times: [0, 0.45, 0.55, 1],
          ease: EASE.cinematicOut,
        }}
      >
        {/* Antique gold leading seam */}
        <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-gold via-gold/60 to-gold" />
        {/* Curtain face */}
        <div className="absolute inset-0 bg-void" />
        {/* Curtain pass-line telemetry */}
        <div className="absolute bottom-8 right-8 font-mono text-[9px] tracking-[0.3em] text-smoke/70 uppercase">
          LM / ROUTE CHANGE
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const firstRender = useRef(true);
  const [, setTick] = useState(0);

  // Curtain only fires on actual navigation (not the initial mount)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      setTick((t) => t + 1);
    }
  }, []);

  return (
    <>
      <RouteCurtain pathname={location.pathname} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.34, ease: EASE.cinematicOut, delay: 0.18 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
};
