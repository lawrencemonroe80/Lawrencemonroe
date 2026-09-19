import React, { useEffect } from 'react';
import { Cover } from '../components/home/Cover';
import { CapsuleDrop } from '../components/home/CapsuleDrop';
import { EditorialStatement } from '../components/home/EditorialStatement';
import { BackPage } from '../components/home/BackPage';

/**
 * THE ISSUE — homepage as a printed magazine.
 *
 *   PAGE 01  THE COVER      masthead, cover lines, barcode
 *   PAGE 02  THE FEATURE    one typographic moment
 *   PAGE 04  THE DROP       capsule, live Square pricing
 *   ...      THE BACK PAGE  closing statement + in-this-issue index
 *   PAGE 20  COLOPHON       (footer)
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
      <Cover />
      <EditorialStatement />
      <CapsuleDrop />
      <BackPage />
    </div>
  );
};
