import React, { useRef } from 'react';
import { motion, useMotionTemplate, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AssetInspector } from '../common/AssetInspector';
import { VelocityText } from '../common/VelocityText';
import { EditorialFaceBlur } from '../common/EditorialFaceBlur';
import { SCROLL } from '../../motion/tokens';

/**
 * SECTION — LOOKBOOK / CAMPAIGN SHOWCASE (STICKY STACKING CARDS)
 *
 * Scroll mechanics:
 *  - Each LOOK card is `position: sticky` at the same top offset; incoming
 *    cards slide over the previous ones like plates stacking on a lightbox.
 *  - Covered cards recede with a friction-based scale + opacity falloff
 *    (scale 1 → 0.955·depth, brightness dims), driven by container
 *    scroll progress — not raw scroll position, so the motion is eased.
 *  - Image plates carry the <AssetInspector /> macro lens ("INSPECT"
 *    cursor state) and the card face advertises "VIEW LOOKBOOK".
 */

interface LookCard {
  index: string;
  title: string;
  subtitle: string;
  image: string;
  macroImage: string;
  alt: string;
  faceBlur: boolean;
  href: string;
  specs: { label: string; value: string }[];
  price: string;
}

const LOOKS: LookCard[] = [
  {
    index: '01',
    title: 'BLACK ARCH',
    subtitle: 'LM SHORTS 001 / PITCH BLACK',
    image: '/models/LM_P01_02_BLACK_BLACK_2.jpg',
    macroImage: '/images/campaign-contact-fabric.jpg',
    alt: 'Look 01 — LM Shorts 001 pitch black with white arch graphic',
    faceBlur: true,
    href: '/shop/lm-shorts-001',
    specs: [
      { label: 'FABRIC', value: '480GSM COMBED COTTON' },
      { label: 'PRINT', value: 'DISTRESSED WHITE SCREENPRINT' },
      { label: 'CUT', value: 'BOXY / RAW KNEE HEM' },
      { label: 'EDITION', value: 'REL-001 / 14 UNITS' },
    ],
    price: '$165',
  },
  {
    index: '02',
    title: 'HEATHER COBALT',
    subtitle: 'LM SHORTS 002 / ATHLETIC HEATHER',
    image: '/models/LM_P01_02_GRAY_2.jpg',
    macroImage: '/images/campaign-contact-hardware.jpg',
    alt: 'Look 02 — LM Shorts 002 heather grey with cobalt blue arch graphic',
    faceBlur: true,
    href: '/shop/lm-shorts-002',
    specs: [
      { label: 'FABRIC', value: '480GSM FLECKED HEATHER' },
      { label: 'PRINT', value: 'COBALT BLUE SCREENPRINT' },
      { label: 'CUT', value: 'BOXY / RAW KNEE HEM' },
      { label: 'EDITION', value: 'REL-001 / 9 UNITS' },
    ],
    price: '$165',
  },
  {
    index: '03',
    title: 'OBJECT / INERT',
    subtitle: 'SEATED STUDY — CHROME CANTILEVER',
    image: '/images/campaign-hero-motion.jpg',
    macroImage: '/images/shorts-002-detail.jpg',
    alt: 'Look 03 — seated study of LM Shorts on chrome cantilever chair',
    faceBlur: true,
    href: '/shop',
    specs: [
      { label: 'DIRECTION', value: 'REMBrandT / SINGLE KEY' },
      { label: 'STOCK', value: 'SILVER-GELATIN GRADE' },
      { label: 'TREATMENT', value: 'GRAIN + SCAN ARTIFACT' },
      { label: 'STATUS', value: 'CAMPAIGN PLATE' },
    ],
    price: 'ARCHIVE',
  },
];

/** Falloff curve: how much each covered card shrinks per position from top. */
const SCALE_FALLOFF = 0.045;

const StackCard: React.FC<{
  look: LookCard;
  i: number;
  total: number;
  progress: MotionValue<number>;
}> = ({ look, i, total, progress }) => {
  // This card's slice of the container timeline
  const targetScale = 1 - (total - 1 - i) * SCALE_FALLOFF;
  const range = [i * (1 / total), 1];
  const scale = useTransform(progress, range, [1, targetScale]);
  // Covered cards dim like plates dropped from the light
  const brightness = useTransform(progress, range, [1, 0.45]);
  const filter = useMotionTemplate`brightness(${brightness})`;

  return (
    <div className="sticky top-[88px] flex justify-center pb-[9vh]" style={{ transformOrigin: 'top center' }}>
      <motion.article
        style={{ scale, filter }}
        className="group metal-frame shadow-material-deep relative w-full max-w-7xl origin-top will-change-transform overflow-hidden"
      >
        {/* Card head strip */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 border-b border-line bg-black/70">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] font-bold tracking-[0.22em] text-gold">
              LOOK {look.index}
            </span>
            <span className="w-1 h-1 bg-smoke" />
            <span className="font-mono text-[10px] tracking-[0.18em] text-smoke uppercase hidden sm:inline">
              {look.subtitle}
            </span>
          </div>
          <span className="font-mono text-[10px] tracking-[0.22em] text-smoke">
            {look.index} / 0{total}
          </span>
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-12">
          {/* Ghost index numeral */}
          <div className="absolute -bottom-6 right-2 lg:right-6 z-0 pointer-events-none select-none">
            <span className="text-hollow font-condensed font-extrabold text-[26vw] lg:text-[15rem] leading-none">
              {look.index}
            </span>
          </div>

          {/* Image plate with macro inspector */}
          <div className="lg:col-span-7 relative overflow-hidden fx-chromatic">
            <AssetInspector
              image={look.image}
              macroImage={look.macroImage}
              alt={look.alt}
              className="aspect-[4/5] lg:aspect-auto lg:h-[62vh] border-r border-line"
              imgClassName="grayscale contrast-125 brightness-90 group-hover:brightness-100 transition-[filter] duration-500"
              spec={{
                title: `MACRO INSPECTION / LOOK ${look.index}`,
                lines: look.specs.slice(0, 2).map((s) => `${s.label}: ${s.value}`),
              }}
            >
              {look.faceBlur && (
                <EditorialFaceBlur top="10%" left="50%" width="84px" height="28px" label="LM / ARCHIVE" />
              )}
              {/* Moiré glitch accent on hover */}
              <div className="fx-moire fx-moire-hover absolute inset-0 z-[6] opacity-0 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/40 pointer-events-none" />
            </AssetInspector>
          </div>

          {/* Spec column */}
          <div className="lg:col-span-5 relative z-10 flex flex-col justify-between p-6 sm:p-10 bg-graphite/80 backdrop-blur-[2px]">
            <div className="space-y-8">
              <div>
                <div className="font-mono text-[10px] tracking-[0.25em] text-gold uppercase mb-3">
                  CAMPAIGN 001 / {look.subtitle}
                </div>
                <h3 className="font-serif font-bold uppercase text-bone text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-tight">
                  {look.title}
                </h3>
              </div>

              <dl className="divide-y divide-line/70 border-y border-line/70">
                {look.specs.map((spec) => (
                  <div key={spec.label} className="flex items-baseline justify-between py-2.5 gap-4">
                    <dt className="font-mono text-[10px] tracking-[0.2em] text-smoke uppercase">{spec.label}</dt>
                    <dd className="font-mono text-[10px] sm:text-[11px] tracking-[0.12em] text-bone/90 uppercase text-right">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-10 flex items-center justify-between">
              <div className="font-mono text-xs text-smoke">
                <span className="text-bone font-bold text-sm">{look.price}</span>
                <span className="mx-2 text-line">|</span>
                <span>REL-001</span>
              </div>
              <Link
                to={look.href}
                data-cursor="view"
                data-cursor-label="VIEW LOOKBOOK"
                className="group/cta inline-flex items-center gap-2 font-mono text-[11px] font-bold tracking-[0.22em] uppercase text-bone hover:text-gold border border-line hover:border-gold px-4 py-2.5 transition-colors"
              >
                OPEN LOOK
                <ArrowUpRight size={13} className="group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  );
};

export const SectionLookbookStack: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: [...SCROLL.stackLifecycle],
  });

  return (
    <section id="lookbook" className="relative w-full bg-black text-bone border-b border-line">
      {/* Section header */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 pt-24 sm:pt-32 pb-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-line pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gold inline-block" />
              <span className="font-mono text-xs text-gold tracking-[0.25em] uppercase font-bold">
                LOOKBOOK / CAMPAIGN 001
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl uppercase text-bone">
              <VelocityText>THE LOOKBOOK</VelocityText>
            </h2>
          </div>
          <div className="font-mono text-[11px] text-smoke tracking-[0.15em] uppercase text-left md:text-right leading-relaxed">
            SCROLL — PLATES STACK ON THE LIGHTBOX
            <br />
            HOVER A PLATE — MACRO INSPECTION LENS
          </div>
        </div>
      </div>

      {/* Sticky stacking runway — cards are direct sticky children so each
          incoming plate slides over the previous while it recedes */}
      <div ref={containerRef} className="relative px-5 sm:px-8 md:px-12 pb-[14vh]">
        {LOOKS.map((look, i) => (
          <StackCard key={look.index} look={look} i={i} total={LOOKS.length} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
};
