import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { PinnedHorizontalSection } from '../components/common/PinnedHorizontalSection';
import { EditorialPlate } from '../components/common/EditorialPlate';
import { ISSUE, CONTENTS } from '../data/magazine';

/**
 * LAWRENCE MONROE — HOMEPAGE v7 (short)
 * ─────────────────────────────────────
 * 3 sections, ~3 viewports of vertical scroll:
 *   §1 COVER     — full-bleed hero with parallax, magazine metadata, wordmark
 *   §2 LOOKBOOK  — pinned horizontal rail, 3 plates
 *   §3 CLOSE     — minimal finale, no index
 *
 * Still magazine-first: glass, metallic gold, PP Editorial New italic, hybrid
 * pinned rails. Just shorter.
 */

const CoverSection: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-[100svh] min-h-[700px] bg-black text-bone overflow-hidden grain"
    >
      <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
        <img
          src="/images/campaign-hero-motion.jpg"
          alt="Lawrence Monroe — Autumn 2026 cover"
          className="w-full h-full object-cover img-mono"
        />
        <div className="absolute inset-0 overlay-cinema opacity-90" />
      </motion.div>

      <div className="absolute top-16 sm:top-20 left-0 right-0 z-20 px-5 sm:px-8 md:px-12">
        <div className="max-w-[1760px] mx-auto flex items-center justify-between font-folio">
          <div className="flex items-center gap-2">
            <span className="gold-dot" />
            <span className="text-gold">Issue №{ISSUE.number} — {ISSUE.title}</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-bone/55">
            <span>{ISSUE.date}</span>
            <span className="text-bone/20">·</span>
            <span>{ISSUE.established}</span>
          </div>
        </div>
      </div>

      <motion.div
        style={{ y: titleY, opacity }}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 pointer-events-none"
      >
        <motion.div
          initial={{ opacity: 0, y: 60, filter: 'blur(20px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          className="text-center"
        >
          <div
            className="text-[22vw] sm:text-[18vw] lg:text-[15vw] leading-[0.82] tracking-tight text-bone"
            style={{ fontFamily: "'PP Editorial New', serif", fontWeight: 400 }}
          >
            Lawrence
          </div>
          <div
            className="text-[22vw] sm:text-[18vw] lg:text-[15vw] leading-[0.82] tracking-tight text-gold-metallic"
            style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
          >
            Monroe.
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.9 }}
          className="absolute bottom-[18%] sm:bottom-[16%] left-0 right-0 px-5 sm:px-8 md:px-12 pointer-events-auto"
        >
          <div className="max-w-[1760px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-end">
            <div className="md:col-span-7 space-y-2">
              <div className="font-folio text-bone/50">The cover essay</div>
              <p
                className="text-xl sm:text-2xl md:text-3xl text-bone/90 leading-snug max-w-xl"
                style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
              >
                Two pieces, one uniform — 480 grams of double-faced cotton, milled in Portugal.
              </p>
            </div>
            <div className="md:col-span-5 flex md:justify-end items-end gap-3">
              <Link to="/drop" className="btn-gold">
                Open Issue 001 <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-6 left-0 right-0 z-20 px-5 sm:px-8 md:px-12 pointer-events-none"
      >
        <div className="max-w-[1760px] mx-auto flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-bone/45">
            <span className="font-folio">Scroll · The Drop</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-px h-10 bg-gradient-to-b from-gold to-transparent"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const LookbookPanel: React.FC<{ index: number; total: number; image: string; caption: string; subtitle: string }> = ({
  index,
  total,
  image,
  caption,
  subtitle,
}) => {
  const isOdd = index % 2 === 1;
  return (
    <section className="relative w-full h-full bg-black text-bone grain overflow-hidden">
      <div className="absolute top-16 sm:top-20 left-0 right-0 z-20 px-5 sm:px-8 md:px-12">
        <div className="max-w-[1760px] mx-auto flex items-center justify-between font-folio">
          <div className="text-gold">Section 02 — The Drop</div>
          <div className="text-bone/55">
            Plate {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full max-w-[1760px] mx-auto px-5 sm:px-8 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className={`lg:col-span-7 ${isOdd ? 'lg:order-2' : 'lg:order-1'}`}
            >
              <EditorialPlate
                src={image}
                alt={caption}
                aspect={index === 1 ? 'aspect-[4/5]' : 'aspect-[5/6]'}
                eyebrow={`Plate ${String(index + 1).padStart(2, '0')}`}
                caption={caption}
                meta={['35mm', 'Silver-gelatin', 'Issue 001']}
                lightbox={{
                  src: image,
                  alt: caption,
                  eyebrow: `Section 02 — The Drop / Plate ${String(index + 1).padStart(2, '0')}`,
                  title: caption,
                  caption: subtitle,
                  meta: ['Photographed on 35mm silver-gelatin stock', 'Studio: Lawrence Monroe', `Plate ${String(index + 1).padStart(2, '0')} of ${String(total).padStart(2, '0')}`],
                  href: '/drop',
                }}
              />
            </motion.div>

            <div className={`lg:col-span-5 ${isOdd ? 'lg:order-1' : 'lg:order-2'} space-y-8`}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.4 }}
                transition={{ duration: 0.9, delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="gold-bar w-12" />
                  <span className="font-folio text-gold">{subtitle}</span>
                </div>
                <h2
                  className="text-[12vw] sm:text-[10vw] lg:text-[7vw] leading-[0.85] tracking-tight text-bone"
                  style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
                >
                  {caption}
                </h2>
                <p
                  className="mt-6 text-lg sm:text-xl text-bone/70 max-w-md leading-snug"
                  style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
                >
                  Photographed on 35mm silver-gelatin stock against neutral grey muslin. Form in repose.
                </p>
                <div className="pt-6">
                  <Link to="/drop" className="link-arrow text-bone/70 hover:text-gold">
                    View the pieces <ArrowUpRight size={12} className="arrow-icon" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 z-20 px-5 sm:px-8 md:px-12">
        <div className="max-w-[1760px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                className={`h-px transition-all duration-700 ${
                  i === index ? 'w-12 bg-gold' : 'w-6 bg-bone/20'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 font-folio text-bone/45">
            <ChevronLeft size={14} className="opacity-50" />
            <span>Scroll to advance</span>
            <ChevronRight size={14} className="opacity-50" />
          </div>
        </div>
      </div>
    </section>
  );
};

const ClosingSection: React.FC = () => {
  return (
    <section className="relative bg-black text-bone py-24 sm:py-40 grain overflow-hidden">
      <div className="max-w-[1760px] mx-auto px-5 sm:px-8 md:px-12 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-3 space-y-2">
            <div className="font-folio text-gold">Section 03 — Close</div>
            <div className="font-folio text-bone/45">End of Issue</div>
          </div>
          <div className="lg:col-span-9 space-y-8">
            <h2
              className="text-[14vw] sm:text-[11vw] lg:text-[9vw] leading-[0.82] tracking-tight text-bone"
              style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
            >
              Release as{' '}
              <span className="text-gold-metallic">image.</span>
            </h2>
            <p
              className="text-2xl sm:text-3xl text-bone/80 leading-snug max-w-3xl"
              style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
            >
              The garment, the visual fragment, and the motion become one unified experience.
            </p>
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <Link to="/drop" className="btn-gold">
                Enter the drop <ArrowUpRight size={14} />
              </Link>
              <Link to="/feed" className="btn-glass">
                View the feed <ArrowUpRight size={14} />
              </Link>
              <Link to="/contact" className="link-arrow text-bone/70 hover:text-gold">
                Get in touch <ArrowUpRight size={12} className="arrow-icon" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-hairline pt-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <div
            className="text-3xl sm:text-4xl text-gold-metallic italic"
            style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
          >
            The drape speaks. The weave holds.
          </div>
          <div className="font-folio text-bone/40 text-right">
            <div>The Studio · Issue {ISSUE.number}</div>
            <div className="text-bone/30 mt-1">{ISSUE.date}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const HomePage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const lookbookImages = [
    { image: '/images/LM_P01_02_BLACK_BLACK.jpg', caption: 'Pitch Black', subtitle: 'Colorway I' },
    { image: '/images/LM_P01_02_GRAY_.jpg', caption: 'Heather Grey', subtitle: 'Colorway II' },
    { image: '/images/LM_P01_02_BLACK_BLACK_2.jpg', caption: 'In Motion', subtitle: 'Back View' },
  ];

  return (
    <main className="bg-black">
      <CoverSection />

      <PinnedHorizontalSection panelCount={lookbookImages.length} durationVh={lookbookImages.length}>
        {lookbookImages.map((l, i) => (
          <LookbookPanel
            key={i}
            index={i}
            total={lookbookImages.length}
            image={l.image}
            caption={l.caption}
            subtitle={l.subtitle}
          />
        ))}
      </PinnedHorizontalSection>

      <ClosingSection />
    </main>
  );
};

export default HomePage;
