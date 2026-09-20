import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { ISSUE } from '../../data/magazine';

/**
 * §2 — BRAND STATEMENT
 * A single oversized typographic moment. Editorial tension between
 * bold display and italic serif accent.
 */
export const BrandStatement: React.FC = () => {
  return (
    <section
      id="statement"
      className="relative bg-black text-bone py-24 sm:py-36 lg:py-48 border-t border-hairline overflow-hidden"
    >
      {/* Massive statement */}
      <div className="max-w-[1760px] mx-auto px-5 sm:px-8 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end"
        >
          {/* Label column */}
          <div className="lg:col-span-3 space-y-4 order-2 lg:order-1">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-gold inline-block" />
              <span className="folio text-bone/70">Page 02 — The Feature</span>
            </div>
            <p
              className="text-lg sm:text-xl text-bone/55 max-w-xs leading-snug"
              style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
            >
              From Issue №{ISSUE.number}: a manifesto on heavyweight cotton and the architecture of form.
            </p>
            <Link to="/about" className="link-arrow text-bone/70 hover:text-gold inline-flex">
              Continue reading
              <ArrowUpRight size={14} className="arrow-icon" />
            </Link>
          </div>

          {/* Oversized statement */}
          <h2 className="lg:col-span-9 font-display-tight text-bone text-[14vw] sm:text-[11vw] lg:text-[9.5vw] leading-[0.84] tracking-[-0.005em] order-1 lg:order-2">
            <span className="block">Built to</span>
            <span className="block">
              hold{' '}
              <span
                className="italic text-gold-shine"
                style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
              >
                its form.
              </span>
            </span>
          </h2>
        </motion.div>
      </div>
    </section>
  );
};
