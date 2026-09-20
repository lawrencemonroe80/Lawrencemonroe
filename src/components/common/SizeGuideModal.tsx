import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Ruler } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, closeSizeGuide } = useCartStore();
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSizeGuideOpen) closeSizeGuide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSizeGuideOpen, closeSizeGuide]);

  const sizesInInches = [
    { size: 'S', waist: '28 – 31"', outseam: '18.5"', inseam: '6.5"', legOpening: '24.0"' },
    { size: 'M', waist: '31 – 34"', outseam: '19.0"', inseam: '7.0"', legOpening: '25.0"' },
    { size: 'L', waist: '34 – 37"', outseam: '19.5"', inseam: '7.5"', legOpening: '26.0"' },
    { size: 'XL', waist: '37 – 40"', outseam: '20.0"', inseam: '8.0"', legOpening: '27.0"' },
  ];

  const sizesInCm = [
    { size: 'S', waist: '71 – 79 cm', outseam: '47.0 cm', inseam: '16.5 cm', legOpening: '61.0 cm' },
    { size: 'M', waist: '79 – 86 cm', outseam: '48.3 cm', inseam: '17.8 cm', legOpening: '63.5 cm' },
    { size: 'L', waist: '86 – 94 cm', outseam: '49.5 cm', inseam: '19.0 cm', legOpening: '66.0 cm' },
    { size: 'XL', waist: '94 – 102 cm', outseam: '50.8 cm', inseam: '20.3 cm', legOpening: '68.5 cm' },
  ];

  const data = unit === 'in' ? sizesInInches : sizesInCm;

  return (
    <AnimatePresence>
      {isSizeGuideOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Size and Measurement Guide"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSizeGuide}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-2xl bg-black border border-line-strong overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-hairline">
              <div className="flex items-center gap-2">
                <Ruler size={14} className="text-gold" strokeWidth={1.5} />
                <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-gold">
                  Size Matrix — Release 001 Shorts
                </span>
              </div>
              <button onClick={closeSizeGuide} className="text-bone/60 hover:text-gold transition-colors" aria-label="Close">
                <X size={18} strokeWidth={1.2} />
              </button>
            </div>

            <div className="px-6 sm:px-10 py-8 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-2">
                  <h3
                    className="text-4xl sm:text-5xl text-bone leading-[0.95]"
                    style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
                  >
                    Architectural fit spec.
                  </h3>
                  <p className="font-editorial text-lg text-bone/60 max-w-md">
                    Engineered with an elastic waistband and extended drawstrings for variable waist fit.
                  </p>
                </div>

                <div className="flex border border-hairline">
                  {(['in', 'cm'] as const).map((u) => (
                    <button
                      key={u}
                      onClick={() => setUnit(u)}
                      className={`px-3 py-1.5 font-mono text-[10px] tracking-[0.22em] uppercase transition-colors ${
                        unit === u ? 'bg-bone text-black' : 'text-bone/50 hover:text-bone'
                      }`}
                    >
                      {u === 'in' ? 'Inches' : 'Centimeters'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto border border-hairline">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-hairline text-bone/40 bg-white/[0.02]">
                      <th className="py-3 px-4 font-medium uppercase tracking-[0.22em] text-[10px]">Size</th>
                      <th className="py-3 px-4 font-medium uppercase tracking-[0.22em] text-[10px]">Waist</th>
                      <th className="py-3 px-4 font-medium uppercase tracking-[0.22em] text-[10px]">Outseam</th>
                      <th className="py-3 px-4 font-medium uppercase tracking-[0.22em] text-[10px]">Inseam</th>
                      <th className="py-3 px-4 font-medium uppercase tracking-[0.22em] text-[10px]">Leg Open.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    {data.map((row) => (
                      <tr key={row.size} className="hover:bg-white/[0.02] transition-colors">
                        <td
                          className="py-3 px-4 text-gold text-2xl"
                          style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic", letterSpacing: "0.02em" }}
                        >
                          {row.size}
                        </td>
                        <td className="py-3 px-4 text-bone/80">{row.waist}</td>
                        <td className="py-3 px-4 text-bone/60">{row.outseam}</td>
                        <td className="py-3 px-4 text-bone/60">{row.inseam}</td>
                        <td className="py-3 px-4 text-bone/60">{row.legOpening}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-l-2 border-gold pl-5 py-2 space-y-2">
                <div className="folio text-gold">Silhouette note</div>
                <p className="font-editorial text-base sm:text-lg text-bone/70 leading-snug">
                  LM Shorts feature a dropped crotch and relaxed boxy thigh cut. If you prefer a traditional streetwear drape, choose your standard true waist size. For a more tailored silhouette, size down one step.
                </p>
              </div>

              <button onClick={closeSizeGuide} className="btn-mono w-full justify-center">
                Return to garment
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
