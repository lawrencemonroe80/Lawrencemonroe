import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight, MoveRight } from 'lucide-react';
import { PinnedHorizontalSection } from '../components/common/PinnedHorizontalSection';
import { EditorialPlate } from '../components/common/EditorialPlate';
import { ISSUE, CONTENTS } from '../data/magazine';
import { RELEASED_PRODUCTS } from '../data/products';

/**
 * LAWRENCE MONROE — HOMEPAGE v6
 * ─────────────────────────────
 * Editorial fashion magazine — 7 distinct spreads, no repetition.
 *
 *   1. COVER     — full-bleed hero with parallax cover image + magazine metadata
 *   2. EDITORIAL — pull-quote spread with sticky image + 3 quote variations
 *   3. LOOKBOOK  — pinned horizontal rail (3 plates, image alternates)
 *   4. STORY     — vertical reading flow w/ alternating plates + italic captions
 *   5. FEATURE   — pinned horizontal story chapters (3 plates)
 *   6. PIECES    — pinned horizontal product specimens (the catalog teaser)
 *   7. CLOSE     — minimal finale + In this issue index
 *
 * Every section is a different spread — different aspect, alignment, type scale.
 * Vertical scroll continues to drive horizontal translation in pinned rails.
 */

// ── §1 COVER ─────────────────────────────────────────────────────

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
      {/* Cover image w/ parallax */}
      <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
        <img
          src="/images/campaign-hero-motion.jpg"
          alt="Lawrence Monroe — Autumn 2026 cover"
          className="w-full h-full object-cover img-mono"
        />
        <div className="absolute inset-0 overlay-cinema opacity-90" />
      </motion.div>

      {/* Top magazine metadata strip */}
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

      {/* Editorial wordmark — split type */}
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

        {/* Cover lines — magazine-style sub-deck */}
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
              <Link to="/shop" className="btn-gold">
                Open Issue 001 <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-6 left-0 right-0 z-20 px-5 sm:px-8 md:px-12 pointer-events-none"
      >
        <div className="max-w-[1760px] mx-auto flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-bone/45">
            <span className="font-folio">Scroll · The Essay</span>
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

// ── §2 EDITORIAL — pull-quote spread ─────────────────────────────

const EditorialSpread: React.FC = () => {
  const quotes = [
    {
      eyebrow: 'On form',
      title: 'Built to hold its form.',
      body: 'Every release is engineered as a single garment — repeatable, collectible, and free from the season. The weave does the work; the drape does the talking.',
    },
    {
      eyebrow: 'On weight',
      title: '480 grams of nothing wasted.',
      body: 'A bespoke double-faced cotton milled in northern Portugal. Tubular drawstrings, brushed antique-gold aglets, and a single-needle saddle hem — built to outlast the issue.',
    },
    {
      eyebrow: 'On motion',
      title: 'Engineered for kinetic drape.',
      body: 'Photographed against neutral grey muslin on 35mm silver-gelatin. Garments rendered as sculpture in motion — never in repose.',
    },
  ];

  return (
    <section className="relative bg-black text-bone py-24 sm:py-40 grain overflow-hidden">
      <div className="max-w-[1760px] mx-auto px-5 sm:px-8 md:px-12">
        {/* Folio */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-12 sm:mb-20"
        >
          <div className="flex items-center gap-3">
            <span className="font-folio text-gold">Page 02 — The Essay</span>
            <span className="text-bone/20">—</span>
            <span className="font-folio text-bone/50">Editorial</span>
          </div>
          <div className="font-folio text-bone/40 hidden sm:flex items-center gap-2">
            <span className="w-1 h-1 bg-gold inline-block" />
            Read time — 4 min
          </div>
        </motion.div>

        {/* Three quotes — asymmetric */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 lg:col-start-1 space-y-8"
          >
            <h2
              className="text-[12vw] sm:text-[10vw] lg:text-[8vw] leading-[0.86] tracking-tight text-bone"
              style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
            >
              Built to hold
              <br />
              its{' '}
              <span className="text-gold-metallic">form.</span>
            </h2>
            <p
              className="text-2xl sm:text-3xl text-bone/75 leading-snug max-w-2xl"
              style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
            >
              The drape speaks. The weave holds. Lawrence Monroe publishes each season as a single issue — garment, image, and motion as one document.
            </p>
          </motion.div>

          <div className="lg:col-span-5 lg:col-start-8 space-y-12 lg:pt-12">
            {quotes.slice(1).map((q, i) => (
              <motion.div
                key={q.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.8, delay: 0.1 * i }}
                className="space-y-3 border-t border-hairline pt-6"
              >
                <div className="font-folio text-gold">{q.eyebrow}</div>
                <h3
                  className="text-2xl sm:text-3xl text-bone leading-tight"
                  style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
                >
                  {q.title}
                </h3>
                <p
                  className="text-base text-bone/60 leading-relaxed"
                  style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
                >
                  {q.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Anchor reading */}
        <div className="mt-16 sm:mt-24 flex flex-wrap items-center justify-between gap-4 pt-8 border-t border-hairline">
          <span className="font-folio text-bone/40">Continue reading — Section 03 The Lookbook</span>
          <Link to="/about" className="link-arrow text-bone hover:text-gold">
            Read the manifesto <MoveRight size={14} className="arrow-icon" />
          </Link>
        </div>
      </div>
    </section>
  );
};

// ── §3 LOOKBOOK — pinned horizontal plates ──────────────────────

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
          <div className="text-gold">Section 03 — Lookbook</div>
          <div className="text-bone/55">
            Plate {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full max-w-[1760px] mx-auto px-5 sm:px-8 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
            {/* Image plate */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className={`lg:col-span-7 ${isOdd ? 'lg:order-2' : 'lg:order-1'} lg:mt-${index % 4 === 0 ? '0' : index % 4 === 1 ? '12' : index % 4 === 2 ? '0' : '20'} ${index === 1 ? 'lg:mt-20' : ''}`}
            >
              <EditorialPlate
                src={image}
                alt={caption}
                aspect={index === 0 ? 'aspect-[5/6]' : index === 1 ? 'aspect-[4/5]' : 'aspect-[5/7]'}
                eyebrow={`Plate ${String(index + 1).padStart(2, '0')}`}
                caption={caption}
                meta={['35mm', 'Silver-gelatin', 'Issue 001']}
                lightbox={{
                  src: image,
                  alt: caption,
                  eyebrow: `Section 03 — Lookbook / Plate ${String(index + 1).padStart(2, '0')}`,
                  title: caption,
                  caption: subtitle,
                  meta: ['Photographed on 35mm silver-gelatin stock', 'Studio: Lawrence Monroe', `Plate ${String(index + 1).padStart(2, '0')} of ${String(total).padStart(2, '0')}`],
                }}
              />
            </motion.div>

            {/* Caption */}
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
                <div className="pt-6 flex items-center gap-3">
                  <span className="font-folio text-bone/45">480GSM · Cotton Terry</span>
                  <span className="text-bone/15">—</span>
                  <Link to="/shop" className="link-arrow text-bone/70 hover:text-gold">
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

// ── §4 STORY — vertical chapter reading ─────────────────────────

const StorySection: React.FC = () => {
  const chapters = [
    {
      n: 'I',
      title: 'The Fabric',
      body: '— 480 grams of double-faced French terry, milled in northern Portugal. Holds its line.',
      image: '/images/campaign-contact-fabric.jpg',
      label: '480GSM · Cotton Terry',
    },
    {
      n: 'II',
      title: 'The Hardware',
      body: '— Brushed antique-gold aglets, custom tubular drawstring, single-needle saddle hem.',
      image: '/images/campaign-contact-hardware.jpg',
      label: 'Antique Gold Aglets',
    },
    {
      n: 'III',
      title: 'The Stride',
      body: '— Engineered to drape against the body in motion, not in repose.',
      image: '/images/campaign-contact-stride.jpg',
      label: 'Kinetic Drape',
    },
  ];

  return (
    <section className="relative bg-black text-bone py-24 sm:py-40 grain overflow-hidden">
      <div className="max-w-[1760px] mx-auto px-5 sm:px-8 md:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-12 sm:mb-20"
        >
          <div className="flex items-center gap-3">
            <span className="font-folio text-gold">Section 04 — The Story</span>
            <span className="text-bone/20">—</span>
            <span className="font-folio text-bone/50">3 chapters</span>
          </div>
          <Link to="/about" className="link-arrow text-bone/60 hover:text-gold hidden sm:inline-flex">
            Continue <MoveRight size={14} className="arrow-icon" />
          </Link>
        </motion.div>

        <div className="space-y-24 sm:space-y-40">
          {chapters.map((c, i) => {
            const isReverse = i % 2 === 1;
            return (
              <motion.div
                key={c.n}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center"
              >
                <div className={`lg:col-span-6 ${isReverse ? 'lg:order-2' : 'lg:order-1'}`}>
                  <EditorialPlate
                    src={c.image}
                    alt={c.label}
                    aspect={i === 1 ? 'aspect-[5/6]' : 'aspect-[4/5]'}
                    eyebrow={`Chapter ${c.n}`}
                    caption={c.title}
                    meta={[c.label, 'Production note']}
                    lightbox={{
                      src: c.image,
                      alt: c.label,
                      eyebrow: `Chapter ${c.n}`,
                      title: c.title,
                      caption: c.body.replace(/^—\s*/, ''),
                      meta: [c.label, 'Photographed on 35mm', 'Issue 001'],
                    }}
                  />
                </div>

                <div className={`lg:col-span-5 ${isReverse ? 'lg:order-1 lg:col-start-1' : 'lg:order-2 lg:col-start-8'}`}>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <span
                        className="text-7xl sm:text-8xl text-gold-metallic leading-none"
                        style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
                      >
                        {c.n}
                      </span>
                      <span className="gold-bar w-16" />
                    </div>
                    <h3
                      className="text-[10vw] sm:text-[8vw] lg:text-[6vw] leading-[0.85] tracking-tight text-bone"
                      style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
                    >
                      {c.title}.
                    </h3>
                    <p
                      className="text-xl sm:text-2xl text-bone/75 leading-snug"
                      style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
                    >
                      {c.body}
                    </p>
                    <div className="pt-4">
                      <span className="font-folio text-bone/45 border border-hairline px-3 py-1.5">
                        {c.label}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ── §5 FEATURE — pinned horizontal chapters ─────────────────────

const FeaturePanel: React.FC<{ index: number; total: number; chapter: any }> = ({ index, total, chapter }) => {
  return (
    <section className="relative w-full h-full bg-black text-bone grain overflow-hidden">
      <div className="absolute top-16 sm:top-20 left-0 right-0 z-20 px-5 sm:px-8 md:px-12">
        <div className="max-w-[1760px] mx-auto flex items-center justify-between font-folio">
          <div className="text-gold">Section 05 — Feature</div>
          <div className="text-bone/55">
            Chapter {chapter.n} / {String(total).padStart(2, '0')}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full max-w-[1760px] mx-auto px-5 sm:px-8 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 lg:pr-12 lg:col-span-5"
            >
              <div className="font-folio text-gold">{chapter.eyebrow}</div>
              <h2
                className="text-[12vw] sm:text-[10vw] lg:text-[7vw] leading-[0.85] tracking-tight text-bone"
                style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
              >
                {chapter.title}.
              </h2>
              <p
                className="text-2xl sm:text-3xl text-bone/75 leading-snug"
                style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
              >
                {chapter.body}
              </p>
              <div className="pt-4">
                <span className="font-folio text-bone/45 border border-hairline px-3 py-1.5">
                  {chapter.label}
                </span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 lg:mt-12"
            >
              <EditorialPlate
                src={chapter.image}
                alt={chapter.label}
                aspect="aspect-[4/5]"
                eyebrow={chapter.eyebrow}
                caption={chapter.title}
                meta={[chapter.label, 'Production study']}
              />
            </motion.div>
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
          <Link to="/vault" className="link-arrow text-bone/60 hover:text-gold">
            View the archive <ArrowUpRight size={14} className="arrow-icon" />
          </Link>
        </div>
      </div>
    </section>
  );
};

// ── §6 PIECES — pinned horizontal product specimens ───────────

const ProductPanel: React.FC<{ product: any; index: number; total: number }> = ({ product, index, total }) => {
  return (
    <section className="relative w-full h-full bg-black text-bone grain overflow-hidden">
      <div className="absolute top-16 sm:top-20 left-0 right-0 z-20 px-5 sm:px-8 md:px-12">
        <div className="max-w-[1760px] mx-auto flex items-center justify-between font-folio">
          <div className="text-gold">Section 06 — The Pieces</div>
          <div className="text-bone/55">
            Specimen {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full max-w-[1760px] mx-auto px-5 sm:px-8 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <motion.figure
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 1 }}
              className="lg:col-span-7"
            >
              <EditorialPlate
                src={product.heroImage}
                alt={product.name}
                aspect="aspect-[4/5]"
                eyebrow={product.code}
                caption={product.name}
                meta={[product.colors?.[0]?.name ?? '—', '$' + product.price.toFixed(0)]}
                lightbox={{
                  src: product.heroImage,
                  alt: product.name,
                  eyebrow: `Specimen ${String(index + 1).padStart(2, '0')} — ${product.code}`,
                  title: product.name,
                  caption: product.shortDescription,
                  meta: [product.colors?.map((c: any) => c.name).join(' · ') ?? '', `$${product.price.toFixed(0)}`],
                  href: `/shop/${product.slug}`,
                }}
              />
            </motion.figure>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 0.9, delay: 0.15 }}
              className="lg:col-span-5 space-y-6 lg:pl-6"
            >
              <div className="font-folio text-gold">{product.code} — Cotton Terry</div>
              <h3
                className="text-[14vw] sm:text-[12vw] lg:text-[8vw] leading-[0.82] tracking-tight text-bone"
                style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
              >
                {product.name}.
              </h3>
              <p
                className="text-lg sm:text-xl text-bone/70 leading-snug max-w-md"
                style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
              >
                {product.shortDescription.slice(0, 140)}…
              </p>
              <div className="flex items-center gap-4 pt-2">
                <span
                  className="text-4xl text-bone leading-none"
                  style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
                >
                  ${product.price.toFixed(0)}
                </span>
                <span className="font-folio text-bone/45">
                  {product.colors.length} colorway{product.colors.length === 1 ? '' : 's'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {product.colors.slice(0, 3).map((c: any) => (
                  <span key={c.name} className="font-folio text-bone border border-hairline px-3 py-1.5">
                    {c.name}
                  </span>
                ))}
              </div>
              <div className="pt-4">
                <Link to={`/shop/${product.slug}`} className="btn-glass">
                  View specimen <ArrowUpRight size={14} />
                </Link>
              </div>
            </motion.div>
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
          <Link to="/shop" className="link-arrow text-bone/60 hover:text-gold">
            Full catalog <ArrowUpRight size={14} className="arrow-icon" />
          </Link>
        </div>
      </div>
    </section>
  );
};

// ── §7 CLOSE ────────────────────────────────────────────────────

const ClosingSection: React.FC = () => {
  return (
    <section className="relative bg-black text-bone py-32 sm:py-48 grain overflow-hidden">
      <div className="max-w-[1760px] mx-auto px-5 sm:px-8 md:px-12 space-y-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-3 space-y-2">
            <div className="font-folio text-gold">Section 07 — Close</div>
            <div className="font-folio text-bone/45">End / Beginning</div>
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
              className="text-2xl sm:text-3xl lg:text-4xl text-bone/80 leading-snug max-w-3xl"
              style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
            >
              The garment, the visual fragment, and the motion become one unified experience.
            </p>
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <Link to="/shop" className="btn-gold">
                Enter catalog <ArrowUpRight size={14} />
              </Link>
              <Link to="/vault" className="btn-glass">
                Browse the archive <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-hairline pt-12 sm:pt-16">
          <div className="flex items-center justify-between mb-8 sm:mb-12">
            <div className="font-folio text-gold">In this issue</div>
            <div className="font-folio text-bone/40">Pages 02 — 28</div>
          </div>
          <div className="space-y-0">
            {CONTENTS.map((entry) => (
              <Link
                key={entry.page}
                to={entry.route}
                className="group flex items-baseline gap-4 sm:gap-6 lg:gap-10 py-4 sm:py-5 border-b border-hairline hover:border-gold/30 transition-colors"
              >
                <span className="font-folio text-bone/45 shrink-0 w-10 sm:w-12">{entry.page}</span>
                <span
                  className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-bone group-hover:text-gold transition-colors duration-500"
                  style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
                >
                  {entry.title}
                </span>
                <span className="hidden md:block flex-1 mx-2 border-b border-dotted border-bone/15 translate-y-[-12px]" />
                <span className="hidden lg:flex items-center gap-2 shrink-0 font-folio text-bone/45 group-hover:text-gold transition-colors">
                  {entry.subtitle}
                  <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-hairline pt-12 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
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

// ── Page ─────────────────────────────────────────────────────────

export const HomePage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const lookbookImages = [
    { image: '/images/LM_P01_02_BLACK_BLACK.jpg', caption: 'Pitch Black', subtitle: 'Colorway I' },
    { image: '/images/LM_P01_02_GRAY_.jpg', caption: 'Heather Grey', subtitle: 'Colorway II' },
    { image: '/images/LM_P01_02_BLACK_BLACK_2.jpg', caption: 'In Motion', subtitle: 'Back View' },
  ];

  const featureChapters = [
    {
      n: 'I',
      eyebrow: 'The Fabric',
      title: 'The Fabric',
      body: '— 480 grams of double-faced French terry, milled in Portugal. Holds its line.',
      image: '/images/campaign-contact-fabric.jpg',
      label: '480GSM · Cotton Terry',
    },
    {
      n: 'II',
      eyebrow: 'The Hardware',
      title: 'The Hardware',
      body: '— Brushed antique-gold aglets, custom tubular drawstring, single-needle saddle hem.',
      image: '/images/campaign-contact-hardware.jpg',
      label: 'Antique Gold Aglets',
    },
    {
      n: 'III',
      eyebrow: 'The Stride',
      title: 'The Stride',
      body: '— Engineered to drape against the body in motion, not in repose.',
      image: '/images/campaign-contact-stride.jpg',
      label: 'Kinetic Drape',
    },
  ];

  return (
    <main className="bg-black">
      <CoverSection />
      <EditorialSpread />

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

      <StorySection />

      <PinnedHorizontalSection panelCount={featureChapters.length} durationVh={featureChapters.length}>
        {featureChapters.map((c, i) => (
          <FeaturePanel key={i} index={i} total={featureChapters.length} chapter={c} />
        ))}
      </PinnedHorizontalSection>

      {RELEASED_PRODUCTS.length > 0 && (
        <PinnedHorizontalSection
          panelCount={Math.min(3, RELEASED_PRODUCTS.length)}
          durationVh={Math.min(3, RELEASED_PRODUCTS.length)}
        >
          {RELEASED_PRODUCTS.slice(0, 3).map((p, i) => (
            <ProductPanel
              key={p.id}
              product={p}
              index={i}
              total={Math.min(3, RELEASED_PRODUCTS.length)}
            />
          ))}
        </PinnedHorizontalSection>
      )}

      <ClosingSection />
    </main>
  );
};

export default HomePage;
