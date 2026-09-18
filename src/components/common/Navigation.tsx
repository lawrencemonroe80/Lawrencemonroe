import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../../store/cartStore';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { brandAssets } from '../../data/assets';
import { Wordmark, MonogramMark } from './BrandLogo';

const MENU_ITEMS = [
  {
    title: 'RELEASE 001',
    subtitle: 'ACTIVE PRIVATE RELEASE',
    href: '/#pieces',
    image: '/images/shorts-001-cutout.jpg',
    code: 'REL-001'
  },
  {
    title: 'SHOP PIECES',
    subtitle: 'VIEW CATALOG & ORDER',
    href: '/shop',
    image: '/images/shorts-002-cutout.jpg',
    code: 'CAT-001'
  },
  {
    title: 'ARCHIVE NEXT',
    subtitle: 'UNRELEASED CONCEPTS & SPECIMENS',
    href: '/#archive',
    image: '/images/archive-shirt-teaser.jpg',
    code: 'ARC-002'
  },
  {
    title: 'EDITORIAL VAULT',
    subtitle: 'CAMPAIGNS / GEN EFFECTS / SILVER-GELATIN',
    href: '/vault',
    image: '/images/campaign-contact-fabric.jpg',
    code: 'ARC-001'
  },
  {
    title: 'RAW FEEDS',
    subtitle: 'INSTAGRAM LIVE / COMMUNITY TELEMETRY',
    href: '/telemetry',
    image: '/images/campaign-contact-stride.jpg',
    code: 'TEL-001'
  },
  {
    title: 'BRAND MANIFESTO',
    subtitle: 'RELEASE AS IMAGE / PRIVATE LABEL',
    href: '/about',
    image: '/images/campaign-hero-motion.jpg',
    code: 'DOC-001'
  }
];

export const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredMenuIndex, setHoveredMenuIndex] = useState<number>(0);
  const location = useLocation();
  const navigate = useNavigate();

  const { getItemCount, openCart } = useCartStore();
  const itemCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith('/#')) {
      const elementId = href.replace('/#', '');
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(elementId);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        const el = document.getElementById(elementId);
        el?.scrollIntoView({ behavior: 'smooth' });
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
            ? 'bg-black/95 backdrop-blur-md border-b border-line py-3.5 shadow-2xl'
            : 'bg-transparent py-6 md:py-8'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 flex items-center justify-between">
          {/* Left: Official LM Monogram */}
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="group flex items-center space-x-2.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-gold"
              aria-label="Lawrence Monroe Home"
            >
              <MonogramMark className="w-8 h-8 group-hover:border-gold transition-colors" />
              <span className="hidden sm:inline-block font-mono text-[10px] text-smoke tracking-ultra">
                [001]
              </span>
            </Link>
          </div>

          {/* Center: Official LAWRENCE MONROE Wordmark */}
          <div className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-auto">
            <Link
              to="/"
              className="group inline-block focus:outline-none focus-visible:ring-1 focus-visible:ring-gold"
            >
              <Wordmark
                className={isScrolled ? 'scale-90 transition-transform' : 'scale-100 transition-transform'}
              />
              <div className="w-0 group-hover:w-full h-[1px] bg-gold mx-auto transition-all duration-300 mt-0.5" />
            </Link>
          </div>

          {/* Right: SHOP & Cart trigger + Menu trigger */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            <nav className="hidden lg:flex items-center gap-6">
              <Link
                to="/shop"
                className="inline-flex items-center gap-1 font-mono text-xs text-smoke hover:text-bone tracking-widest uppercase transition-colors py-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-gold"
              >
                <span>SHOP</span>
                <span className="text-gold text-[9px] font-mono font-bold">001</span>
              </Link>
              <Link
                to="/vault"
                className="font-mono text-xs text-smoke hover:text-bone tracking-widest uppercase transition-colors py-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-gold"
              >
                VAULT
              </Link>
              <Link
                to="/telemetry"
                className="font-mono text-xs text-smoke hover:text-bone tracking-widest uppercase transition-colors py-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-gold"
              >
                TELEMETRY
              </Link>
            </nav>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="group flex items-center space-x-2 border border-line bg-graphite/40 hover:border-gold px-3 py-1.5 transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-gold"
              aria-label={`Shopping Cart with ${itemCount} items`}
            >
              <span className="font-mono text-xs text-bone tracking-widest uppercase group-hover:text-gold transition-colors">
                BAG
              </span>
              <span className="inline-flex items-center justify-center font-mono text-[10px] font-bold text-black bg-gold px-1.5 py-0.2 min-w-[18px] rounded-none">
                {itemCount}
              </span>
            </button>

            {/* Hamburger / Campaign Menu Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 border border-line bg-graphite/40 hover:border-gold transition-colors text-bone hover:text-gold focus:outline-none focus-visible:ring-1 focus-visible:ring-gold"
              aria-label="Open Navigation Menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Campaign Navigation Experience */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-black flex flex-col justify-between"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
          >
            {/* Top Bar inside menu */}
            <div className="max-w-7xl w-full mx-auto px-5 sm:px-8 md:px-12 py-6 md:py-8 flex items-center justify-between border-b border-line">
              <div className="flex items-center space-x-3">
                <MonogramMark className="w-6 h-6" />
                <span className="font-mono text-xs tracking-widest text-gold font-bold">
                  LM / ARCHIVE INDEX
                </span>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="group flex items-center space-x-2 border border-line px-3 py-1.5 hover:border-gold transition-colors text-bone hover:text-gold focus:outline-none focus-visible:ring-1 focus-visible:ring-gold"
                aria-label="Close navigation"
              >
                <span className="font-mono text-xs tracking-widest">CLOSE</span>
                <X size={16} />
              </button>
            </div>

            {/* Main Menu Body: Split Desktop Experience */}
            <div className="max-w-7xl w-full mx-auto px-5 sm:px-8 md:px-12 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1">
              {/* Left Column: Huge Links */}
              <div className="lg:col-span-7 flex flex-col space-y-4 md:space-y-6">
                {MENU_ITEMS.map((item, idx) => (
                  <div
                    key={item.title}
                    onMouseEnter={() => setHoveredMenuIndex(idx)}
                    className="group"
                  >
                    <button
                      onClick={() => handleNavClick(item.href)}
                      className="w-full text-left flex items-baseline justify-between py-2 border-b border-line/40 group-hover:border-gold transition-colors focus:outline-none"
                    >
                      <div className="flex items-baseline space-x-4 sm:space-x-6">
                        <span className="font-mono text-xs sm:text-sm text-gold font-bold">
                          0{idx + 1}
                        </span>
                        <span className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-bone group-hover:text-gold transition-colors duration-300">
                          {item.title}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <span className="font-mono text-[10px] text-smoke hidden md:inline">
                          {item.code}
                        </span>
                        <ArrowUpRight size={20} className="text-gold" />
                      </div>
                    </button>
                    <p className="font-mono text-[11px] text-smoke mt-1 pl-8 sm:pl-10">
                      {item.subtitle}
                    </p>
                  </div>
                ))}

                {/* Direct Bag Action inside menu */}
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openCart();
                    }}
                    className="w-full text-left flex items-baseline justify-between py-2 border-b border-line/40 hover:border-gold transition-colors"
                  >
                    <div className="flex items-baseline space-x-4 sm:space-x-6">
                      <span className="font-mono text-xs sm:text-sm text-gold font-bold">05</span>
                      <span className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-bone hover:text-gold transition-colors">
                        CART BAG
                      </span>
                    </div>
                    <span className="font-mono text-xs px-2 py-1 bg-gold text-black font-bold">
                      {itemCount} PIECES
                    </span>
                  </button>
                </div>
              </div>

              {/* Right Column: Visual Campaign Collage / Preview */}
              <div className="hidden lg:block lg:col-span-5 relative h-[380px] w-full border border-line bg-graphite overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={hoveredMenuIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0"
                  >
                    <img
                      src={MENU_ITEMS[hoveredMenuIndex].image}
                      alt={MENU_ITEMS[hoveredMenuIndex].title}
                      className="w-full h-full object-cover grayscale brightness-90 contrast-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    
                    {/* Editorial Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                      <div>
                        <div className="font-mono text-[10px] text-gold tracking-widest">
                          {MENU_ITEMS[hoveredMenuIndex].code}
                        </div>
                        <div className="font-display text-sm font-bold text-bone uppercase tracking-wider">
                          {MENU_ITEMS[hoveredMenuIndex].title}
                        </div>
                      </div>
                      <div className="font-mono text-[9px] text-smoke border border-line px-2 py-1 bg-black/60 backdrop-blur-sm">
                        LM ARCHIVE
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Menu Footer */}
            <div className="max-w-7xl w-full mx-auto px-5 sm:px-8 md:px-12 py-5 border-t border-line flex flex-col sm:flex-row items-center justify-between text-smoke font-mono text-[11px] gap-3">
              <div className="flex items-center space-x-4">
                <span>FORM IN MOTION</span>
                <span className="text-gold">•</span>
                <span>LIMITED RUN</span>
                <span className="text-gold">•</span>
                <span>PRIVATE LABEL</span>
              </div>
              <div>© {new Date().getFullYear()} LAWRENCE MONROE</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
