import React, { useEffect } from 'react';
import { LightHero } from '../components/home/LightHero';
import { CapsuleDrop } from '../components/home/CapsuleDrop';
import { EditorialStatement } from '../components/home/EditorialStatement';
import { NetworkLinks } from '../components/home/NetworkLinks';

/**
 * INDEX / THE ENTRANCE — v2 light editorial redux.
 *
 * Four focused sections on bleached paper with subtle grain:
 *   1. THE ENTRANCE  — single mounted print + ink wordmark
 *   2. THE DROP      — capsule (live Square pricing/stock)
 *   3. THE STATEMENT — one typographic moment
 *   4. THE NETWORK   — four channel index rows + closing CTA
 *
 * The heavy motion pieces (stacking lookbook, speed-index drag gallery)
 * moved to /vault; the full catalog lives at /shop.
 */
export const HomePage: React.FC = () => {
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, []);

  return (
    <div className="relative w-full bg-paper text-ink">
      <LightHero />
      <CapsuleDrop />
      <EditorialStatement />
      <NetworkLinks />
    </div>
  );
};
