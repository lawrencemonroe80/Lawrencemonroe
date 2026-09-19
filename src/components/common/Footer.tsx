import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { CONTENTS, ISSUE } from '../../data/magazine';

/**
 * THE COLOPHON — PAGE 20
 * ----------------------
 * Magazine back matter: masthead statement, contents recap, studio
 * credits, client services, and the private dispatch sign-up. Ends with
 * the printing line — the honest kind.
 */
export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { openSizeGuide } = useCartStore();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubscribed(true);
    setTimeout(() => setEmail(''), 3000);
  };

  return (
    <footer
      id="colophon"
      className="fx-grain-light bg-paper text-ink border-t-2 border-ink pt-14 pb-10 overflow-hidden selection:bg-gold-dark selection:text-paper"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12">
        {/* Masthead statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-line-dark">
          <div className="lg:col-span-5 space-y-4">
            <div className="font-mono text-[10px] tracking-[0.3em] text-gold-dark font-bold uppercase">
              COLOPHON — PAGE 20
            </div>
            <h2 className="font-serif font-bold uppercase text-3xl sm:text-4xl text-ink tracking-[-0.01em] leading-[0.95]">
              Lawrence Monroe
            </h2>
            <p className="font-serif italic text-base text-ash max-w-sm leading-relaxed">
              A private-label design studio, published each season as a printed issue — garment,
              image, and motion as one document.
            </p>
            <div className="barcode max-w-[150px]" />
            <div className="font-mono text-[8px] tracking-[0.25em] text-ash uppercase pt-1">
              ISSUE {ISSUE.number} · {ISSUE.date} · {ISSUE.established}
            </div>
          </div>

          {/* Contents recap */}
          <div className="lg:col-span-3 space-y-3">
            <div className="font-mono text-[10px] tracking-[0.25em] text-ash uppercase font-semibold">
              In this issue
            </div>
            <ul className="space-y-2">
              {CONTENTS.map((entry) => (
                <li key={entry.page}>
                  <Link
                    to={entry.route}
                    className="group flex items-baseline font-mono text-[11px] tracking-[0.12em] uppercase"
                  >
                    <span className="text-gold-dark font-bold w-10 shrink-0">P.{entry.page}</span>
                    <span className="text-ink/80 group-hover:text-gold-dark transition-colors">
                      {entry.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Studio credits */}
          <div className="lg:col-span-2 space-y-3">
            <div className="font-mono text-[10px] tracking-[0.25em] text-ash uppercase font-semibold">
              The studio
            </div>
            <ul className="space-y-1.5 font-mono text-[10px] tracking-[0.12em] text-ink/70 uppercase leading-relaxed">
              <li>DIRECTION — LM</li>
              <li>DESIGN — THE STUDIO</li>
              <li>PHOTOGRAPHY — 35MM ARCHIVE</li>
              <li>COMMERCE — SQUARE</li>
              <li>EDITORIAL — SANITY</li>
              <li>TYPE — CORMORANT / JETBRAINS</li>
            </ul>
          </div>

          {/* Client services */}
          <div className="lg:col-span-2 space-y-3">
            <div className="font-mono text-[10px] tracking-[0.25em] text-ash uppercase font-semibold">
              Client services
            </div>
            <ul className="space-y-2 font-mono text-[10px] tracking-[0.12em] uppercase">
              <li>
                <button
                  onClick={openSizeGuide}
                  className="text-ink/80 hover:text-gold-dark transition-colors text-left"
                >
                  SIZE GUIDE
                </button>
              </li>
              <li className="text-ink/50">CARBON-NEUTRAL COURIER</li>
              <li className="text-ink/50">14-DAY RETURNS</li>
              <li className="text-ink/50">NUMBERED AUTHENTICATION</li>
              <li>
                <a
                  href="https://instagram.com/lawrencemonroe"
                  target="_blank"
                  rel="noreferrer"
                  className="text-ink/80 hover:text-gold-dark transition-colors"
                >
                  @LAWRENCEMONROE
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Private dispatch */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-10 border-b border-line-dark">
          <div className="lg:col-span-5 space-y-2">
            <h3 className="font-serif font-bold uppercase text-xl text-ink">Private dispatch.</h3>
            <p className="font-utility text-xs text-ash leading-relaxed max-w-sm">
              Direct telemetry on allocations, archival drops, and unreleased prototype openings.
              Zero noise.
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="lg:col-span-5 lg:col-start-7">
            <div className="flex items-center border border-line-dark focus-within:border-gold-dark transition-colors bg-white/60">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ENTER EMAIL ADDRESS"
                required
                className="w-full bg-transparent px-4 py-3 font-mono text-xs text-ink placeholder:text-smoke/60 focus:outline-none"
                aria-label="Email for dispatch updates"
              />
              <button
                type="submit"
                className="px-4 py-3 hover:bg-gold-dark hover:text-paper transition-colors flex items-center gap-1.5 font-mono text-xs font-bold text-ink"
                aria-label="Subscribe"
              >
                {isSubscribed ? (
                  <>
                    <Check size={14} /> LOGGED
                  </>
                ) : (
                  <>
                    ENTER <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>
            {isSubscribed && (
              <p className="font-mono text-[10px] text-gold-dark mt-2 tracking-[0.15em] uppercase">
                Confirmed. You are enrolled in the private dispatch.
              </p>
            )}
          </form>
        </div>

        {/* Printing line */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[9px] tracking-[0.2em] text-ash uppercase">
          <span>© {new Date().getFullYear()} LAWRENCE MONROE — ALL RIGHTS RESERVED</span>
          <span className="hidden md:inline">PRINTED ON THE VERCEL EDGE NETWORK</span>
          <span>END OF ISSUE {ISSUE.number}</span>
        </div>
      </div>
    </footer>
  );
};
