import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { Wordmark, MonogramMark } from './BrandLogo';
import { ISSUE, CONTENTS } from '../../data/magazine';

/**
 * MAGAZINE MASTHEAD + CONTENTS OVERLAY
 * ------------------------------------
 * The nav reads as a printed masthead: a micro folio strip (issue no.,
 * season, established line) above the serif masthead bar. The menu is
 * the contents spread — page numbers, dotted leaders, hover plates.
 * Chrome is ink-on-paper everywhere; the noir treatment survives only
 * on the plate sections and commerce glass.
 */
export const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isIndexOpen, setIsIndexOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const { getItemCount, openCart } = useCartStore();
  const itemCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsIndexOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsIndexOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock scroll while the contents spread is open
  useEffect(() => {
    document.body.style.overflow = isIndexOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isIndexOpen]);

  const handleNavClick = (href: string) => {
    setIsIndexOpen(false);
    if (href.startsWith('/#')) {
      const elementId = href.replace('/#', '');
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth' });
        }, 260);
      } else {
        document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(href);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-paper/95 backdrop-blur-md border-b border-line-dark shadow-sm'
            : 'bg-paper fx-grain-light border-b border-line-dark'
        }`}
      >
        {/* Micro folio strip */}
        <div
          className={`overflow-hidden transition-all duration-500 ${
            isScrolled ? 'max-h-0 opacity-0' : 'max-h-10 opacity-100'
          }`}
        >
          <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 flex items-center justify-between py-1.5 font-mono text-[9px] tracking-[0.22em] text-ash uppercase">
            <span>ISSUE {ISSUE.number} — {ISSUE.title}</span>
            <span className="hidden sm:inline">{ISSUE.date} · {ISSUE.established}</span>
            <span>LAWRENCEMONROE.COM</span>
          </div>
        </div>

        {/* Masthead bar */}
        <div className={`max-w-7xl mx-auto px-5 sm:px-8 md:px-12 flex items-center justify-between transition-all duration-500 ${isScrolled ? 'py-3' : 'py-4'}`}>
          <div className="flex items-center gap-4">
            <Link to="/" aria-label="Lawrence Monroe — cover" className="group flex items-center gap-2.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-gold-dark">
              <MonogramMark tone="light" className="w-8 h-8 group-hover:border-gold-dark transition-colors" />
            </Link>
            <button
              onClick={() => setIsIndexOpen(true)}
              className="font-mono text-[11px] font-bold tracking-[0.25em] uppercase text-ink hover:text-gold-dark transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-gold-dark"
              aria-label="Open contents"
            >
              INDEX
            </button>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-auto">
            <Link to="/" className="group inline-block focus:outline-none focus-visible:ring-1 focus-visible:ring-gold-dark">
              <Wordmark
                color="#0A0A0A"
                className={isScrolled ? 'scale-90 transition-transform' : 'scale-100 transition-transform'}
              />
              <div className="w-0 group-hover:w-full h-[1px] bg-gold-dark mx-auto transition-all duration-300 mt-0.5" />
            </Link>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <nav className="hidden lg:flex items-center gap-6">
              <Link to="/shop" className="font-mono text-[11px] tracking-[0.2em] uppercase text-ash hover:text-ink transition-colors py-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-gold-dark">
                THE EDIT
              </Link>
              <Link to="/vault" className="font-mono text-[11px] tracking-[0.2em] uppercase text-ash hover:text-ink transition-colors py-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-gold-dark">
                THE PLATES
              </Link>
              <Link to="/telemetry" className="font-mono text-[11px] tracking-[0.2em] uppercase text-ash hover:text-ink transition-colors py-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-gold-dark">
                THE FEED
              </Link>
            </nav>

            <button
              onClick={openCart}
              className="group flex items-center gap-2 border border-line-dark bg-white/60 hover:border-gold-dark px-3 py-1.5 transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-gold-dark"
              aria-label={`Bag — ${itemCount} items`}
            >
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-ink group-hover:text-gold-dark transition-colors">
                BAG
              </span>
              <span className="inline-flex items-center justify-center font-mono text-[10px] font-bold text-paper bg-ink group-hover:bg-gold-dark px-1.5 min-w-[18px] transition-colors">
                {itemCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ——— CONTENTS SPREAD ——— */}
      <AnimatePresence>
        {isIndexOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-paper fx-grain-light text-ink flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Contents"
          >
            {/* Top bar */}
            <div className="max-w-7xl w-full mx-auto px-5 sm:px-8 md:px-12 py-5 flex items-center justify-between border-b border-line-dark">
              <div className="flex items-center gap-3">
                <MonogramMark tone="light" className="w-6 h-6" />
                <span className="font-mono text-[11px] tracking-[0.3em] text-gold-dark font-bold uppercase">
                  CONTENTS — ISSUE {ISSUE.number}
                </span>
              </div>
              <button
                onClick={() => setIsIndexOpen(false)}
                className="group flex items-center gap-2 border border-line-dark px-3 py-1.5 hover:border-gold-dark transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-gold-dark"
                aria-label="Close contents"
              >
                <span className="font-mono text-[11px] tracking-[0.25em] uppercase">CLOSE</span>
                <X size={15} />
              </button>
            </div>

            {/* The spread */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Entries */}
                <div className="lg:col-span-7">
                  {CONTENTS.map((entry, i) => (
                    <motion.button
                      key={entry.page}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 + i * 0.045, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      onClick={() => handleNavClick(entry.route)}
                      onMouseEnter={() => setHoveredIndex(i)}
                      className="group w-full text-left flex items-baseline border-b border-line-dark/70 py-4 sm:py-5 focus:outline-none focus-visible:ring-1 focus-visible:ring-gold-dark"
                      data-cursor="view"
                      data-cursor-label="TURN TO PAGE"
                    >
                      <span className="font-mono text-[11px] font-bold text-gold-dark tracking-[0.2em] shrink-0 w-14">
                        P.{entry.page}
                      </span>
                      <span className="font-serif font-bold uppercase text-2xl sm:text-4xl text-ink tracking-[-0.01em] group-hover:translate-x-2 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] whitespace-nowrap">
                        {entry.title}
                      </span>
                      <span className="toc-leader" aria-hidden />
                      <span className="hidden md:flex items-center gap-2 shrink-0">
                        <span className="font-mono text-[10px] tracking-[0.15em] text-ash uppercase">
                          {entry.subtitle}
                        </span>
                        <ArrowUpRight size={14} className="text-ash group-hover:text-gold-dark transition-colors" />
                      </span>
                    </motion.button>
                  ))}
                </div>

                {/* Hover plate */}
                <div className="hidden lg:block lg:col-span-5">
                  <div className="sticky top-10">
                    <motion.div
                      key={CONTENTS[hoveredIndex].page}
                      initial={{ opacity: 0, scale: 1.03, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="bg-white/60 border border-line-dark p-2.5 shadow-paper"
                    >
                      <div className="aspect-[4/5] overflow-hidden">
                        <img
                          src={CONTENTS[hoveredIndex].image}
                          alt={CONTENTS[hoveredIndex].title}
                          className="w-full h-full object-cover grayscale contrast-120"
                        />
                      </div>
                      <div className="flex items-center justify-between px-1 pt-2.5 pb-1 font-mono text-[9px] tracking-[0.2em] text-ash uppercase">
                        <span className="text-indigo font-bold">PAGE {CONTENTS[hoveredIndex].page}</span>
                        <span>{CONTENTS[hoveredIndex].subtitle.toUpperCase()}</span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom meta */}
            <div className="border-t border-line-dark">
              <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 py-4 flex items-center justify-between font-mono text-[9px] tracking-[0.2em] text-ash uppercase">
                <span>{ISSUE.date} · VOL. I</span>
                <span className="hidden sm:inline">SET IN CORMORANT GARAMOND & JETBRAINS MONO</span>
                <span>{ISSUE.priceLine}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
