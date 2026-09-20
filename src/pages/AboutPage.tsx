import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

/**
 * THE MANIFESTO — /about
 * Editorial reading layout with drop cap, pull quote, and
 * spread images.
 */
export const AboutPage: React.FC = () => {
  return (
    <div className="relative bg-black text-bone pt-24 sm:pt-32 pb-24 min-h-screen">
      <div className="max-w-[1760px] mx-auto px-5 sm:px-8 md:px-12">
        {/* ─── HEADER ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 pb-12 sm:pb-20 border-b border-hairline">
          <div className="lg:col-span-3 space-y-3">
            <div className="folio text-gold">Page 18 — The Manifesto</div>
            <div className="folio text-bone/50">Studio Doctrine</div>
          </div>

          <div className="lg:col-span-9 space-y-8">
            <h1
              className="text-[16vw] sm:text-[11vw] lg:text-[10vw] leading-[0.82] tracking-[-0.005em] text-bone"
              style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic", letterSpacing: "0.005em" }}
            >
              Release{' '}
              <span
                className="italic text-gold-shine"
                style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic", fontWeight: 400 }}
              >
                as image.
              </span>
            </h1>
            <p
              className="text-2xl sm:text-3xl lg:text-4xl leading-snug max-w-3xl"
              style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic", color: "#3D5089" }}
            >
              “The garment, the visual fragment, and the motion become one unified experience.”
            </p>
            <div className="font-mono text-[10px] tracking-[0.28em] uppercase text-bone/40">
              From the editor — Issue 001, Autumn 2026
            </div>
          </div>
        </div>

        {/* ─── CORE TENET ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 py-16 sm:py-24 border-b border-hairline">
          <div className="lg:col-span-3">
            <div className="folio text-gold">01 — The Core Tenet</div>
          </div>
          <div className="lg:col-span-9 space-y-6 max-w-3xl">
            <p
              className="dropcap text-lg sm:text-xl text-bone/85 leading-[1.7]"
              style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
            >
              Lawrence Monroe was established as a private-label design studio dedicated to pure form, substantial textile density, and uncompromising silhouette.
            </p>
            <p className="text-base sm:text-lg text-bone/55 leading-[1.7]">
              Rejecting seasonal commercial cycles and fast-fashion obsolescence, our releases are engineered as collectible editorial works. Each item is produced in limited allocations using bespoke double-faced cotton weaves and architectural tailoring.
            </p>
          </div>
        </div>

        {/* ─── VISUAL SPREAD ─── */}
        <div className="py-16 sm:py-24 border-b border-hairline">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
            <figure className="sm:col-span-7 aspect-[5/4] overflow-hidden bg-ink border border-hairline">
              <img
                src="/images/campaign-contact-fabric.jpg"
                alt="480GSM textile density"
                className="w-full h-full object-cover img-bw"
              />
            </figure>
            <figure className="sm:col-span-5 aspect-[5/4] sm:mt-16 overflow-hidden bg-ink border border-hairline">
              <img
                src="/images/campaign-contact-hardware.jpg"
                alt="Antique gold hardware"
                className="w-full h-full object-cover img-bw"
              />
            </figure>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-6">
            <figcaption className="folio text-bone/50">Plate A — 480GSM Density</figcaption>
            <figcaption className="folio text-bone/50 text-right sm:text-left sm:ml-12">Plate B — Antique Gold Hardware</figcaption>
          </div>
        </div>

        {/* ─── UNIVERSAL GEOMETRY ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 py-16 sm:py-24 border-b border-hairline">
          <div className="lg:col-span-3">
            <div className="folio text-gold">02 — Universal Geometry</div>
          </div>
          <div className="lg:col-span-9 space-y-6 max-w-3xl">
            <p
              className="text-lg sm:text-xl text-bone/85 leading-[1.7]"
              style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
            >
              We adhere strictly to non-geographic design principles. The brand operates in a boundless digital archive, free of regional tropes, localized branding, or geographic clichés.
            </p>
            <p className="text-base sm:text-lg text-bone/55 leading-[1.7]">
              Our visual language is drawn from brutalist architectural rhythm, high-contrast monochrome typography, and the physics of kinetic garment drape.
            </p>
          </div>
        </div>

        {/* ─── RELEASE 001 ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 py-16 sm:py-24 border-b border-hairline">
          <div className="lg:col-span-3">
            <div className="folio text-gold">03 — Release 001</div>
            <div className="folio text-bone/50 mt-1">The Shorts</div>
          </div>
          <div className="lg:col-span-9 space-y-6 max-w-3xl">
            <p
              className="text-lg sm:text-xl text-bone/85 leading-[1.7]"
              style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
            >
              Release 001 introduces the foundational LM Shorts in two distinct colorways: Pitch Black and Heather Grey. Crafted from 480GSM heavyweight French terry and custom twill, featuring elongated tubular drawstrings and brushed antique gold aglets.
            </p>
            <p className="text-base sm:text-lg text-bone/55 leading-[1.7]">
              Future concepts for Release 002 (Boxy Shirt) and Release 003 (Structured Headwear) are undergoing laboratory stress tests and will open to registered archive clients first.
            </p>
          </div>
        </div>

        {/* ─── SIGNED CALLOUT ─── */}
        <div className="py-20 sm:py-32 text-center border-b border-hairline">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="folio text-gold">Signed</div>
            <p
              className="text-5xl sm:text-7xl lg:text-8xl leading-[1.02]"
              style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic", color: "#C79F3D" }}
            >
              “The drape speaks. The weave holds.”
            </p>
            <div className="font-mono text-[10px] tracking-[0.28em] uppercase text-bone/40">
              The Studio · Issue 001
            </div>
          </div>
        </div>

        {/* ─── CTA ─── */}
        <div className="py-16 sm:py-24 text-center space-y-8">
          <h3
            className="text-6xl sm:text-8xl lg:text-9xl text-bone uppercase leading-[0.9] tracking-[-0.005em]"
            style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic", letterSpacing: "0.005em" }}
          >
            Explore the{' '}
            <span
              className="italic text-hollow-gold"
              style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic", fontWeight: 400 }}
            >
              active release.
            </span>
          </h3>
          <Link to="/shop" className="btn-gold mx-auto inline-flex">
            Access catalog <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
