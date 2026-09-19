import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck, Sparkles, Layers } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-paper text-ink pt-28 sm:pt-36 pb-24 border-b border-ash/30 selection:bg-black selection:text-paper">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 md:px-12 relative z-10">
        {/* Header */}
        <div className="border-b border-ash/20 pb-8 mb-12 sm:mb-16">
          <div className="flex items-center space-x-2 font-mono text-xs font-bold text-ash uppercase tracking-widest mb-3">
            <span className="w-2 h-2 bg-gold-dark inline-block" />
            <span>PAGE 18 / THE MANIFESTO — STUDIO DOCTRINE</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black text-ink tracking-tighter uppercase leading-none">
            RELEASE AS IMAGE.
          </h1>
          <p className="pullquote mt-6">
            “The garment, the visual fragment, and the motion become one unified experience.”
          </p>
          <div className="font-mono text-[9px] tracking-[0.25em] text-ash uppercase mt-4">
            FROM THE EDITOR — ISSUE 001, AUTUMN 2026
          </div>
        </div>

        {/* Story Section 1: The Ethos */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start py-8 border-b border-ash/20">
          <div className="md:col-span-4 font-mono text-xs font-bold text-ash uppercase tracking-wider">
            01 / THE CORE TENET
          </div>
          <div className="md:col-span-8 space-y-4 font-utility text-sm sm:text-base text-ink leading-relaxed">
            <p className="dropcap">
              LAWRENCE MONROE was established as a private-label design studio dedicated to pure form, substantial textile density, and uncompromising silhouette.
            </p>
            <p className="text-smoke">
              Rejecting seasonal commercial cycles and fast-fashion obsolescence, our releases are engineered as collectible editorial works. Each item is produced in limited allocations using bespoke double-faced cotton weaves and architectural tailoring.
            </p>
          </div>
        </div>

        {/* Visual Spread */}
        <div className="my-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="aspect-[4/5] bg-ash overflow-hidden relative border border-ash/30">
            <img
              src="/images/campaign-contact-fabric.jpg"
              alt="480GSM Textile density"
              className="w-full h-full object-cover grayscale contrast-125"
            />
            <div className="absolute bottom-2 left-2 font-mono text-[9px] bg-paper text-ink px-2 py-0.5 font-bold uppercase">
              PLATE A — 480GSM DENSITY
            </div>
          </div>
          <div className="aspect-[4/5] bg-ash overflow-hidden relative border border-ash/30">
            <img
              src="/images/campaign-contact-hardware.jpg"
              alt="Antique gold hardware"
              className="w-full h-full object-cover grayscale contrast-125"
            />
            <div className="absolute bottom-2 left-2 font-mono text-[9px] bg-paper text-ink px-2 py-0.5 font-bold uppercase">
              PLATE B — ANTIQUE GOLD METALWORK
            </div>
          </div>
        </div>

        {/* Story Section 2: Non-Geographic Philosophy */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start py-8 border-b border-ash/20">
          <div className="md:col-span-4 font-mono text-xs font-bold text-ash uppercase tracking-wider">
            02 / UNIVERSAL GEOMETRY
          </div>
          <div className="md:col-span-8 space-y-4 font-utility text-sm sm:text-base text-ink leading-relaxed">
            <p>
              We adhere strictly to non-geographic design principles. The brand operates in a boundless digital archive, free of regional tropes, localized branding, or geographic clichés.
            </p>
            <p className="text-smoke">
              Our visual language is drawn from brutalist architectural rhythm, high-contrast monochrome typography, and the physics of kinetic garment drape.
            </p>
          </div>
        </div>

        {/* Story Section 3: Release 001 Foundation */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start py-8 border-b border-ash/20">
          <div className="md:col-span-4 font-mono text-xs font-bold text-ash uppercase tracking-wider">
            03 / RELEASE 001: SHORTS
          </div>
          <div className="md:col-span-8 space-y-4 font-utility text-sm sm:text-base text-ink leading-relaxed">
            <p>
              Release 001 introduces the foundational LM Shorts in two distinct colorways: Pitch Black and Raw Bone. Crafted from 480GSM heavyweight French terry and custom twill, featuring elongated tubular drawstrings and brushed antique gold aglets.
            </p>
            <p className="text-smoke">
              Future concepts for Release 002 (Boxy Shirt) and Release 003 (Structured Headwear) are undergoing laboratory stress tests and will open to registered archive clients first.
            </p>
          </div>
        </div>

        {/* CTA to Shop */}
        <div className="pt-12 text-center space-y-6">
          <h3 className="font-display text-3xl font-extrabold uppercase text-ink">
            EXPLORE THE ACTIVE RELEASE.
          </h3>
          <div>
            <Link
              to="/shop"
              className="inline-flex items-center space-x-2 bg-ink hover:bg-gold-dark text-paper hover:text-white py-4 px-10 font-mono text-xs font-bold tracking-widest uppercase transition-colors"
            >
              <span>ACCESS CATALOG</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
