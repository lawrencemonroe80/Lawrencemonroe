import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { brandAssets } from '../../data/assets';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { openSizeGuide } = useCartStore();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setEmail('');
    }, 3000);
  };

  return (
    <footer className="bg-black border-t border-line text-bone pt-16 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12">
        {/* Top Grid: Newsletter & Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-line/50">
          {/* Newsletter Column */}
          <div className="md:col-span-6 lg:col-span-5 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-gold inline-block" />
              <span className="font-mono text-xs text-gold tracking-widest uppercase">
                RELEASE DISPATCH
              </span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-bone">
              RECEIVE PRIVATE INVENTORY NOTIFICATIONS.
            </h3>
            <p className="font-utility text-xs text-smoke max-w-md leading-relaxed">
              Direct telemetry on active allocations, archival drops, and unreleased prototype openings. Zero spam.
            </p>

            <form onSubmit={handleSubscribe} className="pt-2 max-w-md">
              <div className="relative flex items-center border border-line focus-within:border-gold transition-colors bg-graphite/40">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ENTER EMAIL ADDRESS"
                  required
                  className="w-full bg-transparent px-4 py-3 font-mono text-xs text-bone placeholder:text-smoke/60 focus:outline-none"
                  aria-label="Email for dispatch updates"
                />
                <button
                  type="submit"
                  className="px-4 py-3 text-gold hover:text-bone hover:bg-gold/10 transition-colors flex items-center space-x-1 font-mono text-xs"
                  aria-label="Subscribe"
                >
                  {isSubscribed ? (
                    <span className="flex items-center text-gold space-x-1 font-mono text-xs">
                      <Check size={14} />
                      <span>LOGGED</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 font-mono text-xs font-bold">
                      <span>ENTER</span>
                      <ArrowRight size={14} />
                    </span>
                  )}
                </button>
              </div>
              {isSubscribed && (
                <p className="font-mono text-[10px] text-gold mt-2">
                  CONFIRMATION LOGGED. YOU ARE ENROLLED IN THE PRIVATE DISPATCH.
                </p>
              )}
            </form>
          </div>

          {/* Navigation Links Columns */}
          <div className="md:col-span-6 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 pt-2">
            {/* Release Navigation */}
            <div className="space-y-3">
              <div className="font-mono text-[11px] text-gold tracking-widest uppercase">
                RELEASE
              </div>
              <ul className="space-y-2 font-mono text-xs text-smoke">
                <li>
                  <Link to="/#pieces" className="hover:text-bone transition-colors block">
                    RELEASE 001
                  </Link>
                </li>
                <li>
                  <Link to="/shop" className="hover:text-bone transition-colors block">
                    ACTIVE SHOP
                  </Link>
                </li>
                <li>
                  <Link to="/#archive" className="hover:text-bone transition-colors block">
                    ARCHIVE NEXT
                  </Link>
                </li>
                <li>
                  <Link to="/vault" className="hover:text-bone transition-colors block">
                    EDITORIAL VAULT
                  </Link>
                </li>
                <li>
                  <Link to="/telemetry" className="hover:text-bone transition-colors block">
                    RAW FEEDS
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-bone transition-colors block">
                    MANIFESTO
                  </Link>
                </li>
              </ul>
            </div>

            {/* Client Services & Sizing */}
            <div className="space-y-3">
              <div className="font-mono text-[11px] text-gold tracking-widest uppercase">
                SERVICES
              </div>
              <ul className="space-y-2 font-mono text-xs text-smoke">
                <li>
                  <button
                    onClick={openSizeGuide}
                    className="hover:text-bone transition-colors text-left font-mono text-xs"
                  >
                    SIZE GUIDE
                  </button>
                </li>
                <li>
                  <span className="text-smoke/60 cursor-default block">
                    CARBON-NEUTRAL COURIER
                  </span>
                </li>
                <li>
                  <span className="text-smoke/60 cursor-default block">
                    14-DAY RETURNS
                  </span>
                </li>
                <li>
                  <span className="text-smoke/60 cursor-default block">
                    ENCRYPTED CHECKOUT
                  </span>
                </li>
              </ul>
            </div>

            {/* Archival Legal */}
            <div className="space-y-3 col-span-2 sm:col-span-1">
              <div className="font-mono text-[11px] text-gold tracking-widest uppercase">
                CONNECT
              </div>
              <ul className="space-y-2 font-mono text-xs text-smoke">
                <li>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-bone transition-colors block"
                  >
                    INSTAGRAM
                  </a>
                </li>
                <li>
                  <span className="text-smoke/60 cursor-default block">
                    PRIVATE LABEL
                  </span>
                </li>
                <li>
                  <span className="text-smoke/60 cursor-default block">
                    TERMS & PRIVACY
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Official Wordmark Strip in Footer */}
        <div className="pt-12 pb-8 flex flex-col md:flex-row items-baseline justify-between gap-6">
          <div className="w-full max-w-xl opacity-30 hover:opacity-60 transition-opacity">
            <img
              src={brandAssets.wordmark}
              alt="LAWRENCE MONROE"
              className="w-full h-auto object-contain"
            />
          </div>

          <div className="font-mono text-[10px] text-smoke space-y-1 text-left md:text-right">
            <div className="text-gold tracking-widest">PRIVATE LABEL / RELEASE 001</div>
            <div>ALL RIGHTS RESERVED © {new Date().getFullYear()}</div>
          </div>
        </div>
      </div>
    </footer>
  );
};
