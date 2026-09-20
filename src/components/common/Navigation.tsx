import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { Wordmark } from './BrandLogo';
import { ISSUE, CONTENTS } from '../../data/magazine';

/**
 * FLOATING GLASS NAVIGATION — v5
 * ─────────────────────────────
 * Floating glass slab (pill) with thin gold edge detail.
 * Menu opens as full glass overlay with editorial layout.
 */

export const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { getItemCount, openCart } = useCartStore();
  const itemCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
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
      {/* Floating glass navigation bar */}
      <header className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] sm:w-[calc(100%-2rem)] max-w-[1500px] pointer-events-none">
        <nav
          className={`pointer-events-auto flex items-center justify-between h-12 sm:h-14 px-3 sm:px-5 rounded-full transition-all duration-700 ${
            isScrolled
              ? 'glass-gold border-gold-thin shadow-glass'
              : 'glass border-hairline'
          }`}
        >
          {/* LEFT — menu */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="group flex items-center gap-2 sm:gap-3 text-bone hover:text-gold transition-colors"
            aria-label="Open menu"
          >
            <div className="flex flex-col gap-[3px] w-5">
              <span className="block h-px bg-current transition-all duration-500 group-hover:w-3" />
              <span className="block h-px bg-current w-5" />
              <span className="block h-px bg-current transition-all duration-500 group-hover:w-3" />
            </div>
            <span className="hidden sm:inline font-folio text-bone/70 group-hover:text-gold">
              Index
            </span>
          </button>

          {/* CENTER — wordmark */}
          <Link
            to="/"
            aria-label="Lawrence Monroe — home"
            className="absolute left-1/2 -translate-x-1/2"
          >
            <Wordmark color="#FFFFFF" className="text-base md:text-lg" tracking="0.18em" />
          </Link>

          {/* RIGHT — bag */}
          <div className="flex items-center gap-3 sm:gap-5">
            <Link
              to="/about"
              className="hidden md:inline link-arrow text-bone/70 hover:text-gold text-[10px]"
            >
              Manifesto
            </Link>
            <button
              onClick={openCart}
              className="group flex items-center gap-2 nav-underline"
              aria-label={`Bag — ${itemCount} items`}
              data-cursor="view"
              data-cursor-label="Bag"
            >
              <ShoppingBag size={14} strokeWidth={1.4} className="text-bone group-hover:text-gold transition-colors" />
              <span className="font-folio text-bone group-hover:text-gold transition-colors">
                Bag ({itemCount.toString().padStart(2, '0')})
              </span>
            </button>
          </div>
        </nav>

        {/* Hairline gold underline when scrolled */}
        {isScrolled && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -bottom-px left-[8%] right-[8%] h-px bg-gold-line opacity-50"
          />
        )}
      </header>

      {/* ─── FULL-SCREEN GLASS MENU ─── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[60] glass-heavy text-bone flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            {/* Top bar */}
            <div className="max-w-[1760px] w-full mx-auto px-5 sm:px-8 md:px-12 h-14 md:h-16 flex items-center justify-between border-b border-hairline">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-gold inline-block" />
                <span className="font-folio text-bone/70">
                  Contents — Issue {ISSUE.number}
                </span>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="group flex items-center gap-3 text-bone hover:text-gold transition-colors"
                aria-label="Close menu"
              >
                <span className="font-folio hidden sm:inline">Close</span>
                <X size={18} strokeWidth={1.2} />
              </button>
            </div>

            {/* Menu content */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-[1760px] mx-auto px-5 sm:px-8 md:px-12 py-12 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                {/* Left: page entries */}
                <div className="lg:col-span-8 space-y-0">
                  {CONTENTS.map((entry, i) => (
                    <motion.div
                      key={entry.page}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.06 + i * 0.05, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <button
                        onClick={() => handleNavClick(entry.route)}
                        className="group w-full text-left flex items-baseline gap-4 sm:gap-6 lg:gap-8 py-4 sm:py-5 border-b border-hairline hover:border-gold/40 transition-colors"
                      >
                        <span className="font-folio text-gold shrink-0 w-10 sm:w-12 mt-2 sm:mt-3">
                          P.{entry.page}
                        </span>
                        <span className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-bone group-hover:text-gold transition-colors duration-500">
                          {entry.title}
                        </span>
                        <span className="hidden md:block flex-1 mx-2 border-b border-dotted border-bone/15 translate-y-[-12px]" />
                        <span className="hidden lg:flex items-center gap-2 shrink-0 font-folio text-bone/45 group-hover:text-gold transition-colors mt-2">
                          {entry.subtitle}
                          <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* Right: meta */}
                <div className="lg:col-span-4 space-y-10">
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="space-y-6"
                  >
                    <div className="aspect-[4/5] overflow-hidden border border-hairline">
                      <img
                        src="/images/campaign-contact-stride.jpg"
                        alt="Lawrence Monroe — campaign"
                        className="w-full h-full object-cover img-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="font-folio text-gold">Issue {ISSUE.number} — Cover Plate</div>
                      <p className="font-display text-xl sm:text-2xl text-bone leading-tight">
                        A private-label design studio, published each season as a printed issue.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="space-y-3 pt-6 border-t border-hairline"
                  >
                    <div className="font-folio text-bone/60">Studio</div>
                    <div className="space-y-1.5 font-folio text-bone/45">
                      <div>Direction — LM</div>
                      <div>Design — The Studio</div>
                      <div>Photography — 35mm Archive</div>
                      <div>Commerce — Square</div>
                      <div>Editorial — Sanity</div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="space-y-3 pt-6 border-t border-hairline"
                  >
                    <div className="font-folio text-bone/60">Contact</div>
                    <div className="space-y-1.5 font-folio text-bone/45">
                      <a className="block hover:text-gold transition-colors" href="https://instagram.com/lawrencemonroe" target="_blank" rel="noreferrer">@lawrencemonroe</a>
                      <div>studio@lawrencemonroe.com</div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="max-w-[1760px] w-full mx-auto px-5 sm:px-8 md:px-12 h-14 border-t border-hairline flex items-center justify-between font-folio text-bone/40">
              <span>{ISSUE.date} · Vol. I</span>
              <span className="hidden sm:inline">Set in PP Editorial New & Inter Tight</span>
              <span>{ISSUE.priceLine}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
