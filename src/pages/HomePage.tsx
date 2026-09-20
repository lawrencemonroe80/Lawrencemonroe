import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight, MoveRight } from 'lucide-react';
import { PinnedHorizontalSection } from '../components/common/PinnedHorizontalSection';
import { ISSUE, CONTENTS } from '../data/magazine';
import { RELEASED_PRODUCTS } from '../data/products';

/**
 * LAWRENCE MONROE — HOMEPAGE v5
 * ─────────────────────────────
 * Hybrid pinned-section design:
 *   1. Hero (vertical, full-bleed)
 *   2. LOOKBOOK  — pinned horizontal rail (3 editorial plates)
 *   3. STORY     — pinned horizontal sequence (chapter + plates)
 *   4. PRODUCT   — pinned horizontal lineup (3 specimens)
 *   5. CLOSE     — vertical finale + contents index
 *
 * Vertical scroll drives horizontal translation through each pinned region.
 * On mobile/tablet the pinned regions collapse to vertical stacks.
 */

// ── Sub-components ────────────────────────────────────────────────

const HeroSection: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen bg-black text-bone overflow-hidden grain"
    >
      {/* Hero background image */}
      <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
        <img
          src="/images/campaign-hero-motion.jpg"
          alt="Lawrence Monroe — Autumn 2026"
          className="w-full h-full object-cover img-bw opacity-50"
        />
        <div className="absolute inset-0 overlay-cinema opacity-80" />
      </motion.div>

      {/* Magazine metadata strip */}
      <div className="absolute top-20 sm:top-24 left-0 right-0 z-20 px-5 sm:px-8 md:px-12">
        <div className="max-w-[1760px] mx-auto flex items-center justify-between font-folio">
          <div className="flex items-center gap-2">
            <span className="gold-dot" />
            <span className="text-gold">Issue №{ISSUE.number} — {ISSUE.title}</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-bone/60">
            <span>{ISSUE.date}</span>
            <span className="text-bone/20">·</span>
            <span>{ISSUE.established}</span>
          </div>
        </div>
      </div>

      {/* Wordmark */}
      <motion.div
        style={{ y: titleY, opacity }}
        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none px-4"
      >
        <div className="text-center">
          <div className="font-display text-[18vw] sm:text-[16vw] lg:text-[15vw] leading-[0.82] tracking-tight text-bone">
            Lawrence
          </div>
          <div className="font-display-roman text-[18vw] sm:text-[16vw] lg:text-[15vw] leading-[0.82] tracking-tight text-gold-metallic">
            Monroe.
          </div>
        </div>
      </motion.div>

      {/* Bottom strip */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-5 sm:px-8 md:px-12 pb-8 sm:pb-12">
        <div className="max-w-[1760px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="md:col-span-7"
          >
            <p
              className="font-display text-2xl sm:text-3xl md:text-4xl text-bone/85 leading-snug max-w-2xl"
            >
              A private-label design studio — published each season as a printed issue.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="md:col-span-5 flex md:justify-end items-end gap-3"
          >
            <div className="space-y-2">
              <div className="font-folio text-bone/45">Issue {ISSUE.number} / {ISSUE.date}</div>
              <Link to="/shop" className="btn-gold inline-flex">
                Open Release <ArrowUpRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="max-w-[1760px] mx-auto mt-10 flex items-center justify-center"
        >
          <div className="flex flex-col items-center gap-2 text-bone/40">
            <span className="font-folio">Scroll · Section 02</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-px h-10 bg-gradient-to-b from-gold to-transparent"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Lookbook panel — uses one of the campaign images
const LookbookPanel: React.FC<{ index: number; total: number; image: string; caption: string; subtitle: string }> = ({
  index,
  total,
  image,
  caption,
  subtitle,
}) => {
  const positions = ['justify-start', 'justify-end', 'justify-start'];
  return (
    <section className="relative w-full h-full bg-black text-bone grain overflow-hidden">
      {/* Slide index */}
      <div className="absolute top-20 sm:top-24 left-0 right-0 z-20 px-5 sm:px-8 md:px-12">
        <div className="max-w-[1760px] mx-auto flex items-center justify-between font-folio">
          <div className="text-gold">Section 02 — Lookbook</div>
          <div className="text-bone/60">
            Plate {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`w-full max-w-[1760px] mx-auto px-5 sm:px-8 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center`}>
          {/* Image plate */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className={`lg:col-span-7 ${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'} aspect-[4/5] overflow-hidden border border-hairline`}
          >
            <img
              src={image}
              alt={caption}
              className="w-full h-full object-cover img-bw"
            />
          </motion.div>

          {/* Caption */}
          <div className={`lg:col-span-5 ${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'} space-y-8`}>
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
              <h2 className="font-display text-[10vw] sm:text-[8vw] lg:text-[5.5vw] leading-[0.86] tracking-tight text-bone">
                {caption}
              </h2>
              <p className="mt-6 font-display text-lg sm:text-xl text-bone/70 max-w-md leading-snug">
                Photographed on 35mm silver-gelatin stock against neutral grey muslin. Form in repose.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-8 left-0 right-0 z-20 px-5 sm:px-8 md:px-12">
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
          <div className="flex items-center gap-2 font-folio text-bone/40">
            <ChevronLeft size={14} className="opacity-50" />
            <span>Scroll to advance</span>
            <ChevronRight size={14} className="opacity-50" />
          </div>
        </div>
      </div>
    </section>
  );
};

// Story panel
const StoryPanel: React.FC<{ index: number; total: number }> = ({ index, total }) => {
  const chapters = [
    {
      eyebrow: 'Chapter I',
      title: 'The Fabric',
      italic: '— 480 grams of double-faced French terry, milled in Portugal. Holds its line.',
      image: '/images/campaign-contact-fabric.jpg',
      label: '480GSM · Cotton Terry',
    },
    {
      eyebrow: 'Chapter II',
      title: 'The Hardware',
      italic: '— Brushed antique-gold aglets, custom tubular drawstring, single-needle saddle hem.',
      image: '/images/campaign-contact-hardware.jpg',
      label: 'Antique Gold Aglets',
    },
    {
      eyebrow: 'Chapter III',
      title: 'The Stride',
      italic: '— Engineered to drape against the body in motion, not in repose.',
      image: '/images/campaign-contact-stride.jpg',
      label: 'Kinetic Drape',
    },
  ];
  const c = chapters[index];

  return (
    <section className="relative w-full h-full bg-black text-bone grain overflow-hidden">
      <div className="absolute top-20 sm:top-24 left-0 right-0 z-20 px-5 sm:px-8 md:px-12">
        <div className="max-w-[1760px] mx-auto flex items-center justify-between font-folio">
          <div className="text-gold">Section 03 — The Story</div>
          <div className="text-bone/60">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full max-w-[1760px] mx-auto px-5 sm:px-8 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 lg:pr-12"
            >
              <div className="font-folio text-gold">{c.eyebrow}</div>
              <h2 className="font-display text-[12vw] sm:text-[10vw] lg:text-[8vw] leading-[0.86] tracking-tight text-bone">
                {c.title}.
              </h2>
              <p className="font-display text-2xl sm:text-3xl lg:text-4xl text-bone/75 leading-snug">
                {c.italic}
              </p>
              <div className="pt-4">
                <span className="font-folio text-bone/45 border border-hairline px-3 py-1.5">
                  {c.label}
                </span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="aspect-[4/5] overflow-hidden border border-hairline"
            >
              <img src={c.image} alt={c.label} className="w-full h-full object-cover img-bw" />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 z-20 px-5 sm:px-8 md:px-12">
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
          <Link to="/about" className="link-arrow text-bone/70 hover:text-gold">
            Read manifesto <MoveRight size={14} className="arrow-icon" />
          </Link>
        </div>
      </div>
    </section>
  );
};

// Product specimen panel
const ProductPanel: React.FC<{ product: typeof RELEASED_PRODUCTS[0]; index: number; total: number }> = ({
  product,
  index,
  total,
}) => {
  return (
    <section className="relative w-full h-full bg-black text-bone grain overflow-hidden">
      <div className="absolute top-20 sm:top-24 left-0 right-0 z-20 px-5 sm:px-8 md:px-12">
        <div className="max-w-[1760px] mx-auto flex items-center justify-between font-folio">
          <div className="text-gold">Section 04 — The Pieces</div>
          <div className="text-bone/60">
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
              className="lg:col-span-7 aspect-[4/5] overflow-hidden border border-hairline bg-ink"
            >
              <img src={product.heroImage} alt={product.name} className="w-full h-full object-cover img-bw" />
            </motion.figure>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 0.9, delay: 0.15 }}
              className="lg:col-span-5 space-y-6 lg:pl-6"
            >
              <div className="font-folio text-gold">{product.code} — Cotton Terry</div>
              <h3 className="font-display text-[12vw] sm:text-[10vw] lg:text-[7vw] leading-[0.85] tracking-tight text-bone">
                {product.name}.
              </h3>
              <p className="font-display text-lg sm:text-xl text-bone/70 leading-snug max-w-md">
                {product.shortDescription.slice(0, 140)}…
              </p>
              <div className="flex items-center gap-4 pt-2">
                <span className="font-display text-3xl text-bone">${product.price.toFixed(0)}</span>
                <span className="font-folio text-bone/45">
                  {product.colors.length} colorway{product.colors.length === 1 ? '' : 's'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {product.colors.slice(0, 3).map((c) => (
                  <span key={c.name} className="font-folio text-bone border border-hairline px-3 py-1.5">
                    {c.name}
                  </span>
                ))}
              </div>
              <div className="pt-4">
                <Link to={`/shop/${product.slug}`} className="btn-glass inline-flex">
                  View specimen <ArrowUpRight size={14} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 z-20 px-5 sm:px-8 md:px-12">
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
          <Link to="/shop" className="link-arrow text-bone/70 hover:text-gold">
            Full catalog <ArrowUpRight size={14} className="arrow-icon" />
          </Link>
        </div>
      </div>
    </section>
  );
};

const ClosingSection: React.FC = () => {
  return (
    <section className="relative bg-black text-bone py-32 sm:py-48 grain overflow-hidden">
      <div className="max-w-[1760px] mx-auto px-5 sm:px-8 md:px-12 space-y-20">
        {/* Final statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-3">
            <div className="font-folio text-gold">Section 05 — Close</div>
            <div className="font-folio text-bone/45 mt-1">The End / The Beginning</div>
          </div>
          <div className="lg:col-span-9 space-y-8">
            <h2 className="font-display text-[12vw] sm:text-[10vw] lg:text-[8vw] leading-[0.86] tracking-tight text-bone">
              Release as{' '}
              <span className="text-gold-metallic">image.</span>
            </h2>
            <p className="font-display text-2xl sm:text-3xl lg:text-4xl text-bone/80 leading-snug max-w-3xl">
              The garment, the visual fragment, and the motion become one unified experience.
            </p>
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <Link to="/shop" className="btn-gold">Enter catalog <ArrowUpRight size={14} /></Link>
              <Link to="/vault" className="btn-glass">Browse the archive <ArrowUpRight size={14} /></Link>
            </div>
          </div>
        </div>

        {/* In this issue index */}
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
                <span className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-bone group-hover:text-gold transition-colors duration-500">
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

        {/* Signed colophon */}
        <div className="border-t border-hairline pt-12 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <div className="font-display text-3xl sm:text-4xl text-gold-metallic italic">
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

  return (
    <main className="bg-black">
      <HeroSection />

      {/* Section 02 — Lookbook pinned horizontal */}
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

      {/* Section 03 — Story pinned horizontal */}
      <PinnedHorizontalSection panelCount={3} durationVh={3}>
        <StoryPanel index={0} total={3} />
        <StoryPanel index={1} total={3} />
        <StoryPanel index={2} total={3} />
      </PinnedHorizontalSection>

      {/* Section 04 — Products pinned horizontal */}
      {RELEASED_PRODUCTS.length > 0 && (
        <PinnedHorizontalSection panelCount={Math.min(3, RELEASED_PRODUCTS.length)} durationVh={Math.min(3, RELEASED_PRODUCTS.length)}>
          {RELEASED_PRODUCTS.slice(0, 3).map((p, i) => (
            <ProductPanel key={p.id} product={p} index={i} total={Math.min(3, RELEASED_PRODUCTS.length)} />
          ))}
        </PinnedHorizontalSection>
      )}

      <ClosingSection />
    </main>
  );
};

export default HomePage;
