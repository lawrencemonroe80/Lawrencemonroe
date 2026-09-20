import React from 'react';
import { useLocation } from 'react-router-dom';
import { routeFolio, ISSUE } from '../../data/magazine';

/**
 * Running folio — minimal floating chip in the corner.
 */
export const MagazineFolio: React.FC = () => {
  const { pathname } = useLocation();
  const folio = routeFolio(pathname);

  return (
    <div className="fixed bottom-5 left-5 z-40 hidden lg:flex flex-col gap-1 pointer-events-none">
      <div className="font-mono text-[9px] tracking-[0.32em] uppercase text-bone/40">
        Page {folio.page} / 20
      </div>
      <div className="font-mono text-[9px] tracking-[0.32em] uppercase text-gold">
        {folio.title}
      </div>
      <div className="font-mono text-[9px] tracking-[0.32em] uppercase text-bone/30">
        {ISSUE.date}
      </div>
    </div>
  );
};
