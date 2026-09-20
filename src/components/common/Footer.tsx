import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Instagram, Mail, ArrowUpRight } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { CONTENTS, ISSUE } from '../../data/magazine';
import { Wordmark } from './BrandLogo';

/**
 * FOOTER — Colophon / End matter
 * Massive outlined wordmark statement + dispatch + legal.
 */
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
      setIsSubscribed(false);
    }, 3500);
  };

  return (
    <footer
      id="colophon"
      className="relative bg-black text-bone border-t border-hairline pt-16 sm:pt-24 pb-10 overflow-hidden"
    >
      {/* Massive outlined wordmark — the closing statement */}
      <div className="max-w-[1760px] mx-auto px-5 sm:px-8 md:px-12 mb-16 sm:mb-24">
        <div className="border-y border-hairline py-8 sm:py-12 lg:py-16 flex items-center justify-center overflow-hidden">
          <Wordmark
            color="#FFFFFF"
            className="text-[18vw] sm:text-[14vw] lg:text-[11vw] leading-none"
            outline
            tracking="0.02em"
          />
        </div>
      </div>

      <div className="max-w-[1760px] mx-auto px-5 sm:px-8 md:px-12">
        {/* Top section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-hairline">
          {/* Brand statement */}
          <div className="lg:col-span-5 space-y-6">
            <div className="folio text-gold">Colophon — Page 20</div>
            <p className="font-editorial text-2xl sm:text-3xl lg:text-4xl text-bone leading-[1.1]">
              A private-label design studio, published each season as a printed issue — garment, image, and motion as one document.
            </p>
            <div className="pt-2">
              <a
                href="https://instagram.com/lawrencemonroe"
                target="_blank"
                rel="noreferrer"
                className="link-arrow text-bone/70"
              >
                <Instagram size={14} /> @lawrencemonroe
              </a>
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-1" />

          {/* Contents recap */}
          <div className="lg:col-span-3 space-y-4">
            <div className="folio">In this issue</div>
            <ul className="space-y-2">
              {CONTENTS.map((entry) => (
                <li key={entry.page}>
                  <Link
                    to={entry.route}
                    className="group flex items-baseline gap-2 font-mono text-[11px] tracking-[0.16em] uppercase"
                  >
                    <span className="text-gold font-medium w-10 shrink-0">P.{entry.page}</span>
                    <span className="text-bone/80 group-hover:text-gold transition-colors">
                      {entry.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Studio + services */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8">
            <div className="space-y-3">
              <div className="folio">The studio</div>
              <ul className="space-y-1.5 font-mono text-[10px] tracking-[0.16em] text-bone/60 uppercase">
                <li>Direction — LM</li>
                <li>Design — The Studio</li>
                <li>Photography — 35mm</li>
                <li>Commerce — Square</li>
                <li>Editorial — Sanity</li>
              </ul>
            </div>
            <div className="space-y-3">
              <div className="folio">Services</div>
              <ul className="space-y-1.5 font-mono text-[10px] tracking-[0.16em] uppercase">
                <li>
                  <button onClick={openSizeGuide} className="text-bone/80 hover:text-gold transition-colors">
                    Size guide
                  </button>
                </li>
                <li className="text-bone/50">Carbon-neutral courier</li>
                <li className="text-bone/50">14-day returns</li>
                <li className="text-bone/50">Numbered authentication</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Dispatch */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-12 sm:py-16 border-b border-hairline">
          <div className="lg:col-span-5 space-y-3">
            <div className="folio text-gold">Private dispatch</div>
            <h3
              className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-bone leading-[0.98]"
              style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
            >
              Get the next issue first.
            </h3>
            <p className="font-editorial text-lg text-bone/60 max-w-md">
              Direct telemetry on allocations, archival drops, and unreleased prototype openings. Zero noise.
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="lg:col-span-6 lg:col-start-7">
            <div className="flex items-center border-b-2 border-bone/20 focus-within:border-gold transition-colors py-3">
              <Mail size={15} className="text-bone/40 mr-3 shrink-0" strokeWidth={1.4} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                required
                className="w-full bg-transparent font-body text-base text-bone placeholder:text-bone/30 focus:outline-none"
                aria-label="Email for dispatch updates"
              />
              <button
                type="submit"
                className="ml-3 font-mono text-[10px] tracking-[0.32em] uppercase text-bone hover:text-gold transition-colors flex items-center gap-2"
              >
                {isSubscribed ? (
                  <>
                    <Check size={12} /> Logged
                  </>
                ) : (
                  <>
                    Submit <ArrowRight size={12} />
                  </>
                )}
              </button>
            </div>
            {isSubscribed && (
              <p className="font-mono text-[10px] text-gold mt-3 tracking-[0.18em] uppercase">
                Confirmed. You are enrolled in the private dispatch.
              </p>
            )}
          </form>
        </div>

        {/* Bottom legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[10px] tracking-[0.24em] text-bone/40 uppercase">
          <span>© {new Date().getFullYear()} Lawrence Monroe — All Rights Reserved</span>
          <span className="hidden md:inline">Printed on the Vercel edge network</span>
          <span>End of Issue {ISSUE.number}</span>
        </div>
      </div>
    </footer>
  );
};
