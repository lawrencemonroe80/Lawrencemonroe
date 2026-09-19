import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { Magnetic } from '../common/Magnetic';
import { revealUp } from '../../motion/tokens';

/**
 * HOMEPAGE V2 — THE NETWORK + CLOSE
 * ---------------------------------
 * Four index rows (one per channel), text-first with a single hover
 * gesture — then a quiet closing CTA. Replaces v1's four image cards
 * with a refined gallery-index list.
 */
const CHANNELS = [
  {
    to: '/shop',
    code: 'CAT-001',
    title: 'THE SHOP',
    subtitle: 'ACTIVE CATALOG — SQUARE LIVE',
  },
  {
    to: '/vault',
    code: 'ARC-001',
    title: 'THE VAULT',
    subtitle: 'EDITORIAL ARCHIVE — SANITY LIVE',
  },
  {
    to: '/telemetry',
    code: 'TEL-001',
    title: 'THE TELEMETRY',
    subtitle: 'RAW FEEDS — INSTAGRAM LIVE',
  },
  {
    to: '/about',
    code: 'DOC-001',
    title: 'THE MANIFESTO',
    subtitle: 'THE BRAND DOCUMENT',
  },
];

export const NetworkLinks: React.FC = () => {
  return (
    <section
      id="network"
      className="fx-grain-light relative bg-paper text-ink border-t border-line-dark overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 relative z-10 py-24 sm:py-28">
        {/* Header */}
        <motion.div
          variants={revealUp()}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="flex items-end justify-between gap-6 border-b border-line-dark pb-7"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-gold inline-block" />
              <span className="font-mono text-[11px] text-ash tracking-[0.3em] uppercase font-semibold">
                The Network / Index 001
              </span>
            </div>
            <h2 className="font-serif font-bold uppercase text-4xl sm:text-6xl text-ink leading-[0.95] tracking-[-0.01em]">
              Four channels.
            </h2>
          </div>
          <p className="hidden sm:block font-mono text-[10px] tracking-[0.2em] text-ash uppercase pb-2">
            Select a channel to enter
          </p>
        </motion.div>

        {/* Index rows */}
        {CHANNELS.map((channel, i) => (
          <motion.div
            key={channel.to}
            variants={revealUp(0.05 * i)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            <Link
              to={channel.to}
              data-cursor="view"
              data-cursor-label={`ENTER ${channel.title.replace('THE ', '')}`}
              className="group flex items-baseline justify-between gap-4 border-b border-line-dark py-6 sm:py-7 hover:border-gold-dark/60 transition-colors"
            >
              <div className="flex items-baseline gap-5 sm:gap-8 min-w-0">
                <span className="font-mono text-[10px] text-gold-dark font-bold tracking-[0.2em] shrink-0">
                  {channel.code}
                </span>
                <span className="gold-text-hover font-serif font-bold uppercase text-2xl sm:text-4xl lg:text-5xl text-ink tracking-[-0.01em] group-hover:translate-x-2 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] whitespace-nowrap">
                  {channel.title}
                </span>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className="hidden md:inline font-mono text-[10px] tracking-[0.18em] text-ash uppercase">
                  {channel.subtitle}
                </span>
                <ArrowUpRight
                  size={18}
                  className="text-ash group-hover:text-gold-dark group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                />
              </div>
            </Link>
          </motion.div>
        ))}

        {/* Closing CTA */}
        <motion.div
          variants={revealUp(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="pt-20 sm:pt-24 pb-2 text-center space-y-6"
        >
          <div className="font-mono text-[10px] tracking-[0.3em] text-ash uppercase">
            001 / Limited Run
          </div>
          <h2 className="font-serif font-bold uppercase text-4xl sm:text-6xl text-ink leading-[0.95]">
            The release is open.
          </h2>
          <div className="pt-2">
            <Magnetic strength={0.2}>
              <Link
                to="/shop"
                className="btn-metal-light inline-flex items-center gap-3 px-10 py-4 font-mono text-xs font-bold tracking-[0.25em] uppercase focus:outline-none"
              >
                Shop Release 001
                <ArrowRight size={15} />
              </Link>
            </Magnetic>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
