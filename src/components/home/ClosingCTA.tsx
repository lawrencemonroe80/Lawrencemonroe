import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Magnetic } from '../common/Magnetic';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { ISSUE, CONTENTS } from '../../data/magazine';

/**
 * §7 — CLOSING CTA
 * A minimal finale: one statement, one CTA, and a small
 * in-this-issue index. Almost all type, very little chrome.
 */
export const ClosingCTA: React.FC = () => {
  return (
    <section
      id="backpage"
      className="relative bg-black text-bone py-24 sm:py-32 lg:py-44 border-t border-hairline"
    >
      {/* Subtle gold ambient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(199,159,61,0.05),transparent_60%)] pointer-events-none" />

      <div className="max-w-[1760px] mx-auto px-5 sm:px-8 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-4xl mx-auto space-y-10 sm:space-y-14"
        >
          <div className="flex items-center justify-center gap-4">
            <span className="w-12 h-px bg-bone/20" />
            <span className="folio text-gold">The Back Page</span>
            <span className="w-12 h-px bg-bone/20" />
          </div>

          <h2
            className="text-[16vw] sm:text-[12vw] lg:text-[9.5vw] leading-[0.86] tracking-[-0.005em] text-bone"
            style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic", letterSpacing: "0.005em" }}
          >
            The release
            <br />
            <span
              className="italic text-gold-shine"
              style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic", fontWeight: 400 }}
            >
              is open.
            </span>
          </h2>

          <p
            className="text-2xl sm:text-3xl text-bone/70 max-w-2xl mx-auto leading-snug"
            style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
          >
            Every piece serialized. Heavyweight cotton crafted for perpetual form — while the allocation lasts.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Magnetic strength={0.2}>
              <Link to="/shop" className="btn-gold" data-cursor="view" data-cursor-label="Open Issue">
                Open Issue {ISSUE.number}
                <ArrowUpRight size={14} />
              </Link>
            </Magnetic>
            <Link to="/vault" className="link-arrow text-bone/70 hover:text-gold">
              View the lookbook <ArrowRight size={14} className="arrow-icon" />
            </Link>
          </div>
        </motion.div>

        {/* In this issue index */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, delay: 0.1 }}
          className="mt-24 sm:mt-32 pt-12 border-t border-hairline grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          <div>
            <div className="folio text-gold mb-6">In this issue — №{ISSUE.number}</div>
            <p
              className="text-lg text-bone/70 max-w-md"
              style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
            >
              The complete contents of the autumn issue — garment, image, and motion.
            </p>
          </div>
          <ul className="space-y-1">
            {CONTENTS.map((entry) => (
              <li key={entry.page}>
                <Link
                  to={entry.route}
                  className="group flex items-center gap-4 sm:gap-6 py-4 border-b border-hairline hover:border-gold transition-colors"
                >
                  <span className="font-mono text-[10px] font-medium text-gold tracking-[0.28em] shrink-0 w-10">
                    P.{entry.page}
                  </span>
                  <span
                    className="text-2xl sm:text-3xl text-bone group-hover:text-gold transition-colors duration-500 leading-none uppercase"
                    style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic", letterSpacing: "0.01em" }}
                  >
                    {entry.title}
                  </span>
                  <span className="hidden md:block flex-1 mx-2 border-b border-dotted border-bone/15 translate-y-[-6px]" />
                  <span className="hidden md:inline font-mono text-[10px] tracking-[0.2em] uppercase text-bone/40 group-hover:text-gold transition-colors shrink-0">
                    {entry.subtitle}
                  </span>
                  <ArrowUpRight size={14} className="text-bone/40 group-hover:text-gold transition-colors shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
};
