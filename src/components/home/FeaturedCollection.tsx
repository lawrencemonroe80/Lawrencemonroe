import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

/**
 * §3 — FEATURED COLLECTION
 * Asymmetric lookbook spread. Tall left image + smaller plates on right
 * with editorial type.
 */
export const FeaturedCollection: React.FC = () => {
  return (
    <section
      id="feature"
      className="relative bg-black text-bone py-24 sm:py-32 lg:py-40 border-t border-hairline overflow-hidden"
    >
      <div className="max-w-[1760px] mx-auto px-5 sm:px-8 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-10 sm:pb-14 border-b border-hairline"
        >
          <div className="flex items-center gap-4">
            <span className="folio text-gold">Chapter I</span>
            <span className="text-bone/20">—</span>
            <span className="folio text-bone/50">The Pieces</span>
          </div>
          <span className="folio text-bone/40">Plates 01 — 02</span>
        </motion.div>

        {/* Asymmetric editorial layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-12 sm:mt-20">
          {/* Tall left image */}
          <motion.figure
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 lg:row-span-2"
          >
            <Link to="/shop/lm-shorts-001" className="group block">
              <div className="aspect-[4/5] overflow-hidden bg-ink relative">
                <img
                  src="/images/campaign-contact-stride.jpg"
                  alt="Stride study — Pitch Black"
                  className="w-full h-full object-cover img-bw transition-transform duration-[1400ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 overlay-bottom opacity-60" />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                  <div className="space-y-1">
                    <div className="folio text-gold">Plate 01</div>
                    <div className="folio text-bone">Pitch Black</div>
                  </div>
                  <ArrowUpRight size={16} className="text-bone/60 group-hover:text-gold transition-colors" />
                </div>
              </div>
            </Link>
          </motion.figure>

          {/* Right column */}
          <div className="lg:col-span-7 space-y-8 lg:space-y-12 lg:pl-8">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, delay: 0.1 }}
            >
              <p
                className="text-[9vw] sm:text-[6.5vw] lg:text-[5.5vw] text-bone leading-[0.96] tracking-[-0.005em]"
                style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
              >
                Heavyweight
                <br />
                cotton.
                <span className="text-hollow-gold">
                  {' '}Pure form.
                </span>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12"
            >
              <div className="space-y-4">
                <div className="folio text-gold">Concept</div>
                <p
                  className="text-xl sm:text-2xl text-bone/80 leading-snug"
                  style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
                >
                  480 grams per square meter. Engineered to maintain rigid architectural lines across daily movement.
                </p>
              </div>
              <div className="space-y-4">
                <div className="folio text-gold">Construction</div>
                <p className="text-sm sm:text-base text-bone/60 leading-relaxed">
                  Boxy streetwear cut. Raw edge knee finish. Distressed screenprinted graphics on the left leg. Garment washed and pre-shrunk to preserve graphic alignment.
                </p>
              </div>
            </motion.div>

            {/* Wide secondary image — fabric macro */}
            <motion.figure
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1.1, delay: 0.3 }}
              className="grid grid-cols-12 gap-4 lg:gap-6 items-end"
            >
              <div className="col-span-7 aspect-[16/10] overflow-hidden bg-ink">
                <img
                  src="/images/campaign-contact-fabric.jpg"
                  alt="480GSM weave"
                  className="w-full h-full object-cover img-bw"
                />
              </div>
              <div className="col-span-5 space-y-3 pb-2">
                <div className="folio text-gold">Plate 02</div>
                <p
                  className="text-base text-bone/60 leading-snug"
                  style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
                >
                  The weave holds. The drape speaks.
                </p>
                <Link to="/about" className="link-arrow text-bone/50 hover:text-gold text-[10px]">
                  See construction <ArrowUpRight size={12} className="arrow-icon" />
                </Link>
              </div>
            </motion.figure>
          </div>
        </div>
      </div>
    </section>
  );
};
