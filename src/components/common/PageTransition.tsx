import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE } from '../../motion/tokens';
import { ISSUE, routeFolio } from '../../data/magazine';

/**
 * PAGE-TURN TRANSITION — the magazine flip.
 * -----------------------------------------
 * On every route change a sheet of paper sweeps the viewport (gold
 * leading seam) carrying the destination folio — "PAGE 06 · THE EDIT" —
 * so navigation feels like turning to a section of the issue. The new
 * page fades up beneath the clearing sheet.
 *
 * Reduced motion: sheet disabled, simple cross-fade only.
 */

const SHEET_DURATION = 0.66;

const TurnSheet: React.FC<{ pathname: string }> = ({ pathname }) => {
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return null;

  const folio = routeFolio(pathname);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        className="fixed inset-0 z-[90] pointer-events-none"
        initial={{ x: '100%' }}
        animate={{ x: ['100%', '0%', '0%', '-100%'] }}
        transition={{
          duration: SHEET_DURATION,
          times: [0, 0.45, 0.55, 1],
          ease: EASE.cinematicOut,
        }}
      >
        {/* Gold leading seam */}
        <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-gold-core via-gold-hi to-gold-core" />
        {/* The sheet */}
        <div className="absolute inset-0 bg-paper" />
        {/* Folio label — where the reader is turning to */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="font-mono text-[10px] tracking-[0.4em] text-ash uppercase">
              ISSUE {ISSUE.number}
            </div>
            <div className="font-serif font-bold uppercase text-2xl sm:text-4xl text-ink tracking-[0.02em]">
              PAGE {folio.page} · {folio.title}
            </div>
            <div className="mx-auto w-10 h-[2px] bg-gold-dark" />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const firstRender = useRef(true);

  useEffect(() => {
    firstRender.current = false;
  }, []);

  return (
    <>
      <TurnSheet pathname={location.pathname} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.34, ease: EASE.cinematicOut, delay: 0.16 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
};
