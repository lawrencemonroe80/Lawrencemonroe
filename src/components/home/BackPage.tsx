import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Magnetic } from '../common/Magnetic';
import { revealUp } from '../../motion/tokens';
import { CONTENTS, ISSUE } from '../../data/magazine';

/**
 * THE BACK PAGE — end of the issue.
 * ---------------------------------
 * The closing spread: one oversized statement, the primary CTA, and a
 * compact "in this issue" index with page references. The colophon
 * (footer) follows as PAGE 20.
 */
export const BackPage: React.FC = () => {
  return (
    <section
      id="backpage"
      className="fx-grain-light relative bg-paper text-ink border-t border-line-dark overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 relative z-10 py-24 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Statement + CTA */}
          <motion.div
            variants={revealUp()}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="lg:col-span-7 space-y-7"
          >
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-gold inline-block" />
              <span className="font-mono text-[11px] text-ash tracking-[0.3em] uppercase font-semibold">
                The back page / Issue {ISSUE.number}
              </span>
            </div>
            <h2 className="font-serif font-bold uppercase text-5xl sm:text-7xl text-ink leading-[0.94] tracking-[-0.02em]">
              The release
              <br />
              is open.
            </h2>
            <p className="font-serif italic text-lg sm:text-xl text-ash max-w-md leading-relaxed">
              Every piece serialized. Heavyweight cotton crafted for perpetual form — while the
              allocation lasts.
            </p>
            <div className="pt-2">
              <Magnetic strength={0.2}>
                <Link
                  to="/shop"
                  className="btn-metal-light inline-flex items-center gap-3 px-10 py-4 font-mono text-xs font-bold tracking-[0.25em] uppercase focus:outline-none"
                >
                  Shop the issue
                  <ArrowRight size={15} />
                </Link>
              </Magnetic>
            </div>
          </motion.div>

          {/* In this issue */}
          <motion.div
            variants={revealUp(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="lg:col-span-5 lg:pt-24"
          >
            <div className="border-t-2 border-ink pt-4">
              <div className="font-mono text-[10px] tracking-[0.3em] text-ash uppercase font-semibold pb-2">
                In this issue
              </div>
              {CONTENTS.map((entry) => (
                <Link
                  key={entry.page}
                  to={entry.route}
                  className="group flex items-baseline border-b border-line-dark/70 py-2.5 hover:border-gold-dark/60 transition-colors"
                >
                  <span className="font-mono text-[10px] font-bold text-gold-dark tracking-[0.18em] w-12 shrink-0">
                    P.{entry.page}
                  </span>
                  <span className="font-serif font-bold uppercase text-base text-ink group-hover:text-gold-dark transition-colors">
                    {entry.title}
                  </span>
                  <span className="toc-leader" aria-hidden />
                  <ArrowUpRight
                    size={12}
                    className="self-center text-ash group-hover:text-gold-dark transition-colors shrink-0"
                  />
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
