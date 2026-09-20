import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Lock } from 'lucide-react';

/**
 * §6 — SECONDARY CONTENT
 * Quiet paired section. Two plates side by side with minimal text.
 * Preview of upcoming research pieces.
 */
export const SecondaryContent: React.FC = () => {
  return (
    <section className="relative bg-black text-bone py-24 sm:py-32 lg:py-40 border-t border-hairline overflow-hidden">
      <div className="max-w-[1760px] mx-auto px-5 sm:px-8 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-10 sm:pb-14 border-b border-hairline"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Lock size={12} className="text-gold" strokeWidth={1.5} />
              <span className="folio text-gold">Chapter IV — Archive Next</span>
            </div>
            <h2
              className="text-[12vw] sm:text-[8vw] lg:text-[6.5vw] leading-[0.92] tracking-[-0.005em] text-bone"
              style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic", letterSpacing: "0.005em" }}
            >
              What's{' '}
              <span
                className="italic text-hollow-gold"
                style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic", fontWeight: 400 }}
              >
                next.
              </span>
            </h2>
          </div>
          <span className="folio text-bone/40">In laboratory testing</span>
        </motion.div>

        {/* Two plates */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-12 sm:mt-20">
          {/* Left plate — Shirt */}
          <motion.figure
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="group relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-ink">
              <img
                src="/images/archive-shirt-teaser.jpg"
                alt="Release 002 — Boxy Shirt prototype"
                className="w-full h-full object-cover img-bw transition-transform duration-[1400ms] group-hover:scale-105"
              />
              <div className="absolute inset-0 overlay-bottom opacity-70" />
              <div className="absolute top-5 left-5 flex items-center gap-2">
                <span className="font-mono text-[9px] tracking-[0.28em] uppercase text-bone bg-black/70 border border-bone/20 px-2.5 py-1">
                  Release 002
                </span>
              </div>
              <div className="absolute bottom-6 left-6 right-6 space-y-2">
                <div
                  className="text-5xl sm:text-6xl text-bone leading-none"
                  style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic", letterSpacing: "0.01em" }}
                >
                  The Shirt
                </div>
                <p
                  className="text-base text-bone/70 leading-snug max-w-sm"
                  style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
                >
                  Boxy cut, heavyweight cotton, opening winter 2026.
                </p>
              </div>
            </div>
            <figcaption className="mt-3 flex items-baseline justify-between font-mono text-[10px] tracking-[0.28em] uppercase text-bone/40">
              <span>Prototype</span>
              <span>Tested in laboratory</span>
            </figcaption>
          </motion.figure>

          {/* Right plate — Headwear */}
          <motion.figure
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="group relative lg:mt-16"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-ink">
              <img
                src="/images/archive-hat-teaser.jpg"
                alt="Release 003 — Structured Headwear prototype"
                className="w-full h-full object-cover img-bw transition-transform duration-[1400ms] group-hover:scale-105"
              />
              <div className="absolute inset-0 overlay-bottom opacity-70" />
              <div className="absolute top-5 left-5 flex items-center gap-2">
                <span className="font-mono text-[9px] tracking-[0.28em] uppercase text-bone bg-black/70 border border-bone/20 px-2.5 py-1">
                  Release 003
                </span>
              </div>
              <div className="absolute bottom-6 left-6 right-6 space-y-2">
                <div
                  className="text-5xl sm:text-6xl text-bone leading-none"
                  style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic", letterSpacing: "0.01em" }}
                >
                  The Headwear
                </div>
                <p
                  className="text-base text-bone/70 leading-snug max-w-sm"
                  style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
                >
                  Structured silhouette, antique gold hardware, allocation TBA.
                </p>
              </div>
            </div>
            <figcaption className="mt-3 flex items-baseline justify-between font-mono text-[10px] tracking-[0.28em] uppercase text-bone/40">
              <span>Prototype</span>
              <span>Awaiting stress test</span>
            </figcaption>
          </motion.figure>
        </div>

        {/* Subtle CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-12 sm:mt-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-8 border-t border-hairline"
        >
          <p
            className="text-lg text-bone/60 max-w-md"
            style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
          >
            Future releases are restricted to enrolled clients. Receive priority dispatch before public allocation.
          </p>
          <Link to="/about" className="link-arrow text-bone hover:text-gold">
            Request access <ArrowUpRight size={14} className="arrow-icon" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
