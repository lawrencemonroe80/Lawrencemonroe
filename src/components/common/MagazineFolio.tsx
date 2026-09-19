import React from 'react';
import { useLocation } from 'react-router-dom';
import { ISSUE, routeFolio } from '../../data/magazine';

/**
 * RUNNING FOLIO — the printed page number.
 * A small paper chip pinned bottom-left on every route: issue number,
 * page, and section title. The reader always knows where in the issue
 * they are. (Hidden on phones to keep the small viewport clean.)
 */
export const MagazineFolio: React.FC = () => {
  const { pathname } = useLocation();
  const folio = routeFolio(pathname);

  return (
    <div
      aria-hidden
      className="fixed bottom-3 left-3 z-30 hidden sm:flex items-center gap-2.5 bg-paper/90 backdrop-blur-sm border border-line-dark px-2.5 py-1.5 font-mono text-[9px] tracking-[0.18em] uppercase text-ash shadow-paper pointer-events-none select-none"
    >
      <span className="font-bold text-gold-dark">LM·{ISSUE.number}</span>
      <span className="w-px h-3 bg-line-dark" />
      <span>
        PAGE {folio.page} — {folio.title}
      </span>
    </div>
  );
};
