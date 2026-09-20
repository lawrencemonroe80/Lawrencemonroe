import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, ZoomIn, UserX } from 'lucide-react';
import { SHORTS_001_VISUALS, SHORTS_002_VISUALS, ProductVisual } from '../../data/assets';
import { EditorialFaceBlur } from '../common/EditorialFaceBlur';

interface ProductMediaStageProps {
  productId: string;
  productName: string;
}

export const ProductMediaStage: React.FC<ProductMediaStageProps> = ({ productId, productName }) => {
  const visuals: ProductVisual[] = productId === 'lm-shorts-002' ? SHORTS_002_VISUALS : SHORTS_001_VISUALS;

  const [activeVisualIndex, setActiveVisualIndex] = useState(0);
  const [focusMode, setFocusMode] = useState<'full' | 'shorts'>('full');
  const [showAnnotations, setShowAnnotations] = useState(false);
  const [activeAnnotationId, setActiveAnnotationId] = useState<number | null>(null);
  const [faceBlurActive, setFaceBlurActive] = useState(true);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const activeVisual = visuals[activeVisualIndex] || visuals[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
    setMousePos({ x, y });
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border border-hairline p-2.5 font-mono text-xs">
        <div className="flex items-center gap-1 border border-hairline">
          <button
            onClick={() => setFocusMode('full')}
            className={`px-3 py-1.5 uppercase font-medium text-[10px] tracking-[0.24em] transition-colors ${
              focusMode === 'full' ? 'bg-bone text-black' : 'text-bone/50 hover:text-bone'
            }`}
          >
            Full Look
          </button>
          <button
            onClick={() => setFocusMode('shorts')}
            className={`px-3 py-1.5 uppercase font-medium text-[10px] tracking-[0.24em] transition-colors flex items-center gap-1.5 ${
              focusMode === 'shorts' ? 'bg-bone text-black' : 'text-bone/50 hover:text-bone'
            }`}
          >
            <ZoomIn size={11} />
            Shorts Focus
          </button>
        </div>

        <div className="flex items-center gap-2">
          {focusMode === 'full' && (
            <button
              onClick={() => setFaceBlurActive(!faceBlurActive)}
              className={`px-2.5 py-1.5 uppercase font-mono text-[10px] tracking-[0.24em] transition-colors border flex items-center gap-1.5 ${
                faceBlurActive
                  ? 'border-gold bg-gold/10 text-gold font-medium'
                  : 'border-hairline text-bone/50 hover:text-bone hover:border-bone/40'
              }`}
            >
              <UserX size={11} strokeWidth={1.5} />
              <span>Face: {faceBlurActive ? 'Obscured' : 'Clear'}</span>
            </button>
          )}

          {activeVisual.annotations && activeVisual.annotations.length > 0 && (
            <button
              onClick={() => setShowAnnotations(!showAnnotations)}
              className={`px-3 py-1.5 uppercase font-mono text-[10px] tracking-[0.24em] transition-colors border flex items-center gap-1.5 ${
                showAnnotations
                  ? 'border-gold bg-gold/10 text-gold font-medium'
                  : 'border-hairline text-bone/50 hover:text-bone hover:border-bone/40'
              }`}
            >
              <Eye size={11} strokeWidth={1.5} />
              <span>{showAnnotations ? 'Hide Marks' : 'Inspection Marks'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main stage */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
        className="relative aspect-[4/5] bg-ink border border-hairline overflow-hidden group"
      >
        <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
          <motion.img
            key={activeVisual.id}
            src={activeVisual.src}
            alt={activeVisual.alt || productName}
            animate={{
              scale: focusMode === 'shorts' ? activeVisual.crop.desktop.scale : 1.02,
              x: mousePos.x,
              y: mousePos.y,
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              transformOrigin: focusMode === 'shorts' ? activeVisual.crop.desktop.objectPosition : '50% 50%',
            }}
            className="w-full h-full object-cover img-editorial select-none"
          />

          {faceBlurActive && focusMode === 'full' && (
            <EditorialFaceBlur
              top={activeVisual.id.includes('seated') ? '12%' : '8%'}
              left="50%"
              width={activeVisual.id.includes('seated') ? '120px' : '108px'}
              height="32px"
              label="Lawrence Monroe"
            />
          )}

          <div className="absolute inset-0 overlay-cinema opacity-70 pointer-events-none" />

          {/* Annotations */}
          <AnimatePresence>
            {showAnnotations && activeVisual.annotations && (
              <>
                {activeVisual.annotations.map((marker) => {
                  const isActive = activeAnnotationId === marker.id;
                  return (
                    <div
                      key={marker.id}
                      style={{ top: marker.top, left: marker.left }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-30"
                    >
                      <button
                        onClick={() => setActiveAnnotationId(isActive ? null : marker.id)}
                        className={`group flex items-center justify-center w-7 h-7 border font-mono text-[10px] transition-transform ${
                          isActive
                            ? 'bg-gold text-black border-gold scale-110'
                            : 'bg-black/90 text-gold border-gold/80 hover:bg-gold hover:text-black'
                        }`}
                        aria-label={`Annotation marker ${marker.id}`}
                      >
                        0{marker.id}
                      </button>

                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.95 }}
                          className="absolute bottom-9 left-1/2 -translate-x-1/2 w-52 bg-black border border-gold p-3 text-left pointer-events-none z-40"
                        >
                          <div className="font-mono text-[10px] text-gold font-medium uppercase border-b border-hairline pb-1.5 mb-1.5 tracking-[0.24em]">
                            {marker.label}
                          </div>
                          <p
                            className="text-[11px] text-bone/80 leading-snug"
                            style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
                          >
                            {marker.description}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Stage labels */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <div className="font-mono text-[9px] bg-black/85 border border-gold/60 text-gold px-2.5 py-1 tracking-[0.24em] uppercase">
            {focusMode === 'shorts' ? 'Shorts Focus' : 'Full Look'} · {activeVisualIndex + 1}/{visuals.length}
          </div>
        </div>

        <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between font-mono text-[9px] text-bone/40 pointer-events-none">
          <span className="bg-black/60 px-2 py-0.5 border border-hairline">
            {activeVisual.label}
          </span>
          <span className="text-gold uppercase tracking-[0.24em]">
            Real Archive Asset
          </span>
        </div>
      </div>

      {/* Thumbnail rail */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {visuals.map((vis, idx) => {
          const isActive = idx === activeVisualIndex;
          return (
            <button
              key={vis.id}
              onClick={() => {
                setActiveVisualIndex(idx);
                setActiveAnnotationId(null);
              }}
              className={`relative aspect-[4/3] border bg-ink overflow-hidden transition-all duration-300 group focus:outline-none ${
                isActive
                  ? 'border-gold'
                  : 'border-hairline hover:border-bone/40 opacity-60 hover:opacity-100'
              }`}
              aria-label={`Select ${vis.label}`}
            >
              <img
                src={vis.src}
                alt={vis.alt}
                className="w-full h-full object-cover img-bw"
              />
              <div className="absolute bottom-0 inset-x-0 bg-black/85 text-center font-mono text-[9px] py-1 text-bone tracking-[0.24em] uppercase border-t border-hairline">
                {vis.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
