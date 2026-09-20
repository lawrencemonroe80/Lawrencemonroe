import React from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE } from '../../motion/tokens';
import { ISSUE, routeFolio } from '../../data/magazine';

/**
 * PAGE TRANSITION — cinematic curtain sweep with folio label.
 */
export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const folio = routeFolio(location.pathname);

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          className="fixed inset-0 z-[80] pointer-events-none flex items-center justify-center"
          initial={{ y: '-100%' }}
          animate={{ y: ['-100%', '0%', '0%', '100%'] }}
          transition={{
            duration: 0.85,
            times: [0, 0.4, 0.55, 1],
            ease: EASE.cinematicOut,
          }}
        >
          <div className="absolute inset-0 bg-black" />
          <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-gold to-transparent" />
          <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-gold to-transparent" />
          <div className="text-center space-y-4 relative z-10">
            <div className="folio text-bone/50">Issue {ISSUE.number}</div>
            <div
              className="font-editorial text-bone text-3xl sm:text-5xl md:text-6xl"
              style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
            >
              Page {folio.page}
            </div>
            <div className="font-display-tight text-bone text-2xl sm:text-4xl">
              {folio.title}
            </div>
            <div className="mx-auto w-10 h-px bg-gold" />
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE.cinematicOut, delay: 0.3 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
};
