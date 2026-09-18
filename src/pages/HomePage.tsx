import React, { useEffect } from 'react';
import { Section1Hero } from '../components/home/Section1Hero';
import { Section2Manifesto } from '../components/home/Section2Manifesto';
import { Section3ContactSheet } from '../components/home/Section3ContactSheet';
import { SectionLookbookStack } from '../components/home/SectionLookbookStack';
import { Section4ReleasedPieces } from '../components/home/Section4ReleasedPieces';
import { SectionHorizontalGallery } from '../components/home/SectionHorizontalGallery';
import { Section5ObjectInMotion } from '../components/home/Section5ObjectInMotion';
import { Section6ArchiveNext } from '../components/home/Section6ArchiveNext';
import { Section7FinalCTA } from '../components/home/Section7FinalCTA';
import { SectionNetwork } from '../components/home/SectionNetwork';

export const HomePage: React.FC = () => {
  useEffect(() => {
    // Check if there is an anchor in the hash
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, []);

  return (
    <div className="relative w-full bg-black text-bone overflow-hidden">
      {/* SECTION 1: RELEASE OPENING — 3D parallax photoshoot rig */}
      <Section1Hero />

      {/* SECTION 2: RELEASE MANIFESTO — velocity-distorted type */}
      <Section2Manifesto />

      {/* SECTION 3: MOVING CONTACT SHEET */}
      <Section3ContactSheet />

      {/* SECTION 3.5: LOOKBOOK — sticky stacking cards */}
      <SectionLookbookStack />

      {/* SECTION 4: THE RELEASED PIECES */}
      <Section4ReleasedPieces />

      {/* SECTION 4.5: SPEED INDEX — inertia drag gallery w/ macro inspector */}
      <SectionHorizontalGallery />

      {/* SECTION 5: OBJECT IN MOTION */}
      <Section5ObjectInMotion />

      {/* SECTION 6: ARCHIVE NEXT */}
      <Section6ArchiveNext />

      {/* SECTION 6.5: THE NETWORK — capsule drop + inner-page transitions */}
      <SectionNetwork />

      {/* SECTION 7: FINAL RELEASE CTA */}
      <Section7FinalCTA />
    </div>
  );
};
