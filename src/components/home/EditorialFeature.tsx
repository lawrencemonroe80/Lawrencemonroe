import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

/**
 * §5 — EDITORIAL FEATURE
 * Sticky image with text column. Pull-quote, stat grid, and
 * secondary navigation.
 */
export const EditorialFeature: React.FC = () => {
  return (
    <section className="relative bg-black text-bone py-24 sm:py-32 lg:py-40 border-t border-hairline overflow-hidden">
      <div className="max-w-[1760px] mx-auto px-5 sm:px-8 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left — large image */}
          <motion.figure
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 lg:sticky lg:top-32"
          >
            <div className="aspect-[5/6] lg:aspect-[4/5] overflow-hidden bg-ink relative">
              <img
                src="/images/campaign-hero-motion.jpg"
                alt="Lawrence Monroe — Motion campaign"
                className="w-full h-full object-cover img-bw"
              />
              <div className="absolute inset-0 overlay-cinema opacity-80" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="folio text-gold mb-2">Chapter III — The Plates</div>
                <p
                  className="text-2xl sm:text-3xl text-bone/90 leading-snug max-w-md"
                  style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
                >
                  Motion study. Silver-gelatin. The drape speaks.
                </p>
              </div>
            </div>
            <figcaption className="mt-3 flex items-baseline justify-between font-mono text-[10px] tracking-[0.28em] uppercase text-bone/40">
              <span>Plate III — Motion study</span>
              <span>35mm · 1/125</span>
            </figcaption>
          </motion.figure>

          {/* Right — text content */}
          <div className="lg:col-span-5 space-y-10 lg:pl-8 lg:pt-12">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-4">
                <span className="folio text-gold">Chapter III</span>
                <span className="text-bone/20">—</span>
                <span className="folio text-bone/50">The Plates</span>
              </div>
              <h2
                className="text-[13vw] sm:text-[9vw] lg:text-[6.5vw] leading-[0.95] tracking-[-0.005em] text-bone"
                style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic", letterSpacing: "0.005em" }}
              >
                The
                <span
                  className="italic text-gold-shine"
                  style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic", fontWeight: 400 }}
                >
                  {' '}lookbook
                </span>
                <br />
                is the
                <br />
                <span className="text-bone">garment.</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="space-y-7 max-w-md"
            >
              <div className="border-l-2 border-gold pl-5 space-y-2">
                <div className="folio text-gold">Editorial note</div>
                <p
                  className="text-xl sm:text-2xl text-bone/85 leading-snug"
                  style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
                >
                  “Each piece is published as one document — image, motion, and material as a single editorial argument.”
                </p>
              </div>

              <p className="text-base text-bone/60 leading-relaxed">
                The campaign photography is shot on 35mm silver-gelatin stock — natural light, real grain, real drape. No CGI, no AI-generated finishes, no synthetic collapse.
              </p>

              <div className="grid grid-cols-3 gap-4 pt-4">
                {[
                  { n: '02', l: 'Pieces' },
                  { n: '04', l: 'Sizes' },
                  { n: '480', l: 'GSM' },
                ].map((s) => (
                  <div key={s.l} className="border-t border-bone/20 pt-4">
                    <div
                      className="text-4xl text-gold leading-none"
                      style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
                    >
                      {s.n}
                    </div>
                    <div className="folio text-bone/40 mt-2">{s.l}</div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-wrap gap-5">
                <Link to="/vault" className="link-arrow text-bone hover:text-gold">
                  See the plates <ArrowUpRight size={14} className="arrow-icon" />
                </Link>
                <Link to="/telemetry" className="link-arrow text-bone hover:text-gold">
                  The feed <ArrowUpRight size={14} className="arrow-icon" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
