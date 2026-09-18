import React, { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { INSPECTOR, SPRING } from '../../motion/tokens';

/**
 * <AssetInspector /> — high-resolution macro zoom reveal.
 *
 * Wrap any campaign frame. On hover a telemetry lens tracks the pointer:
 *  - `macroImage` set  → lens swaps to the hi-res macro plate (fabric knit,
 *    stitching, logo lockup) for an instant inspection reveal.
 *  - `macroImage` unset → true optical magnifier over the same frame.
 *
 * The zone advertises itself to the magnetic cursor via data-cursor="inspect".
 */
export const AssetInspector: React.FC<{
  image: string;
  macroImage?: string;
  zoom?: number;
  alt: string;
  className?: string;
  imgClassName?: string;
  spec?: {
    title: string;
    lines: string[];
  };
  children?: React.ReactNode;
}> = ({ image, macroImage, zoom = INSPECTOR.zoom, alt, className = '', imgClassName = '', spec, children }) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  // Pointer position within the frame, in %
  const originX = useMotionValue(50);
  const originY = useMotionValue(50);
  // Lens position in px — raw values feed springs so the lens trails
  // with the inspector spring physics
  const rawLensX = useMotionValue(0);
  const rawLensY = useMotionValue(0);
  const lensX = useSpring(rawLensX, SPRING.inspectorLens);
  const lensY = useSpring(rawLensY, SPRING.inspectorLens);

  // Zoomed plate geometry: keep the frame point under the cursor centered
  const zx = useTransform(originX, (v) => v * zoom);
  const zy = useTransform(originY, (v) => v * zoom);
  const plateLeft = useMotionTemplate`calc(50% - ${zx}%)`;
  const plateTop = useMotionTemplate`calc(50% - ${zy}%)`;
  const plateWidth = `${zoom * 100}%`;
  const plateHeight = `${zoom * 100}%`;

  // Telemetry readout values
  const coordX = useTransform(originX, (v) => String(Math.round(v)).padStart(3, '0'));
  const coordY = useTransform(originY, (v) => String(Math.round(v)).padStart(3, '0'));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    originX.set(Math.min(Math.max(px, 2), 98));
    originY.set(Math.min(Math.max(py, 2), 98));
    rawLensX.set(e.clientX - rect.left);
    rawLensY.set(e.clientY - rect.top);
  };

  const lensSize = 'min(300px, 38vw)';
  const showPlate = macroImage ?? image;

  return (
    <div
      ref={frameRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      data-cursor="inspect"
      className={`relative overflow-hidden select-none ${className}`}
    >
      {/* Base campaign plate */}
      <img
        src={image}
        alt={alt}
        draggable={false}
        className={`h-full w-full object-cover pointer-events-none ${imgClassName}`}
      />
      {children}

      {/* MACRO LENS */}
      <motion.div
        aria-hidden
        className="absolute left-0 top-0 z-20 pointer-events-none"
        style={{ x: lensX, y: lensY }}
      >
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2"
          initial={false}
          animate={{
            opacity: active ? 1 : 0,
            scale: active ? 1 : 0.82,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 0.5 }}
        >
          <div
            className="relative overflow-hidden border border-gold/60 bg-black shadow-[0_18px_50px_rgba(0,0,0,0.85)]"
            style={{ width: lensSize, height: lensSize }}
          >
            {/* Magnified / macro plate */}
            <motion.img
              src={showPlate}
              alt=""
              draggable={false}
              className="absolute pointer-events-none object-cover"
              style={{ left: plateLeft, top: plateTop, width: plateWidth, height: plateHeight }}
            />
            {/* Chromatic fringe + crosshair */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15" />
            <div className="absolute left-1/2 top-0 h-full w-px bg-gold/25" />
            <div className="absolute top-1/2 left-0 w-full h-px bg-gold/25" />
            <div className="absolute left-1/2 top-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 border border-gold/70 rounded-full" />
            {/* Corner registration ticks */}
            <span className="absolute top-1 left-1 w-2 h-2 border-t border-l border-bone/70" />
            <span className="absolute top-1 right-1 w-2 h-2 border-t border-r border-bone/70" />
            <span className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-bone/70" />
            <span className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-bone/70" />
            {/* Coordinate footer bar */}
            <div className="absolute bottom-0 inset-x-0 flex items-center justify-between px-2 py-1 bg-black/75 backdrop-blur-[4px] border-t border-gold/40 font-mono text-[8px] tracking-[0.18em] text-bone/90">
              <span>
                X <motion.span>{coordX}</motion.span> / Y <motion.span>{coordY}</motion.span>
              </span>
              <span className="text-gold font-semibold">MAG {zoom.toFixed(1)}×</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* SPEC READOUT — bottom-left plate */}
      {spec && (
        <motion.div
          initial={false}
          animate={{ opacity: active ? 1 : 0, y: active ? 0 : 8 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-3 left-3 z-10 max-w-[68%] glass-panel px-3 py-2 pointer-events-none"
        >
          <div className="font-mono text-[9px] font-bold tracking-[0.2em] text-gold uppercase">
            {spec.title}
          </div>
          {spec.lines.map((line) => (
            <div key={line} className="font-mono text-[9px] tracking-[0.12em] text-bone/80 uppercase mt-0.5">
              {line}
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};
