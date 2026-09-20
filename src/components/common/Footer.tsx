import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, ArrowUpRight } from 'lucide-react';
import { CONTENTS, ISSUE } from '../../data/magazine';
import { Wordmark } from './BrandLogo';

/**
 * FOOTER — Slim colophon for the 4-page structure.
 * Outlined wordmark + minimal nav grid + signed legal line.
 */
export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-black text-bone border-t border-hairline pt-16 sm:pt-24 pb-10 overflow-hidden">
      {/* Massive outlined wordmark — closing statement */}
      <div className="max-w-[1760px] mx-auto px-5 sm:px-8 md:px-12 mb-12 sm:mb-20">
        <Link to="/" className="block border-y border-hairline py-8 sm:py-12 lg:py-16 flex items-center justify-center overflow-hidden hover:border-gold/40 transition-colors">
          <Wordmark
            color="#FFFFFF"
            className="text-[18vw] sm:text-[14vw] lg:text-[11vw] leading-none"
            outline
            tracking="0.02em"
          />
        </Link>
      </div>

      <div className="max-w-[1760px] mx-auto px-5 sm:px-8 md:px-12 space-y-12">
        {/* Top section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-12 border-b border-hairline">
          {/* Brand statement */}
          <div className="lg:col-span-7 space-y-6">
            <div className="font-folio text-gold">Colophon</div>
            <p
              className="text-2xl sm:text-3xl lg:text-4xl text-bone leading-[1.1]"
              style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
            >
              A private-label design studio, published each season as a printed issue — garment, image, and motion as one document.
            </p>
            <div className="pt-2">
              <a
                href="https://instagram.com/lawrencemonroe"
                target="_blank"
                rel="noreferrer"
                className="link-arrow text-bone/70 hover:text-gold"
              >
                <Instagram size={14} /> @lawrencemonroe
              </a>
            </div>
          </div>

          {/* Slim nav grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="font-folio">In this issue</div>
              <ul className="space-y-2">
                {CONTENTS.map((entry) => (
                  <li key={entry.page}>
                    <Link
                      to={entry.route}
                      className="group flex items-baseline gap-2 font-folio"
                    >
                      <span className="text-gold w-7 shrink-0">P.{entry.page}</span>
                      <span className="text-bone/80 group-hover:text-gold transition-colors">
                        {entry.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <div className="font-folio">Identity</div>
              <ul className="space-y-1.5 font-folio text-bone/50">
                <li>Direction — LM</li>
                <li>Design — The Studio</li>
                <li>Photography — 35mm</li>
                <li>Commerce — Square</li>
                <li>Set in PP Editorial New</li>
                <li>& Inter Tight</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom legal */}
        <div className="pt-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-folio text-bone/40">
          <span>© {new Date().getFullYear()} Lawrence Monroe</span>
          <span className="hidden sm:inline">studio@lawrencemonroe.com</span>
          <span>End of Issue {ISSUE.number}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
