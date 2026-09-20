import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Minimal editorial cursor — gold dot + ring.
 * Auto-disabled on coarse pointers / reduced motion.
 */
type CursorState = 'default' | 'link' | 'pill';

const PILL_LABEL: Partial<Record<string, string>> = {
  view: 'View',
  drag: 'Drag',
  inspect: 'Inspect',
};

export const CustomCursor: React.FC = () => {
  const [state, setState] = useState<CursorState>('default');
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const coreX = useSpring(x, { stiffness: 800, damping: 40, mass: 0.1 });
  const coreY = useSpring(y, { stiffness: 800, damping: 40, mass: 0.1 });
  const ringX = useSpring(x, { stiffness: 220, damping: 26, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 220, damping: 26, mass: 0.6 });

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    if (reduced || coarse) return;

    setEnabled(true);
    document.body.classList.add('lm-cursor-active');

    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const tagged = target.closest<HTMLElement>('[data-cursor]');
      if (tagged) {
        const value = tagged.dataset.cursor ?? 'link';
        if (value === 'view' || value === 'drag' || value === 'inspect') {
          setState('pill');
          setLabel(tagged.dataset.cursorLabel ?? PILL_LABEL[value] ?? null);
        } else {
          setState('pill');
          setLabel(tagged.dataset.cursorLabel ?? null);
        }
        return;
      }

      const interactive = target.closest('a, button, input, select, textarea, [role="button"], label');
      setState(interactive ? 'link' : 'default');
      setLabel(null);
    };

    const handleLeave = () => setVisible(false);

    window.addEventListener('mousemove', handleMove, { passive: true });
    document.addEventListener('mouseleave', handleLeave);

    return () => {
      document.body.classList.remove('lm-cursor-active');
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
    };
  }, [x, y]);

  if (!enabled) return null;

  const isPill = state === 'pill' && label;

  return (
    <>
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 z-[10000] pointer-events-none"
        style={{ x: coreX, y: coreY }}
      >
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-gold"
          animate={{
            width: visible ? (isPill ? 4 : 5) : 0,
            height: visible ? (isPill ? 4 : 5) : 0,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      </motion.div>

      <motion.div
        aria-hidden
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full border"
          animate={{
            width: isPill ? 110 : 32,
            height: isPill ? 110 : 32,
            borderColor: isPill ? 'rgba(199,159,61,0.95)' : 'rgba(255,255,255,0.5)',
            backgroundColor: isPill ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0)',
            opacity: visible ? 1 : 0,
          }}
          transition={{ type: 'spring', stiffness: 320, damping: 26, mass: 0.5 }}
        >
          {isPill && (
            <span className="font-mono text-[9px] font-medium tracking-[0.28em] text-bone text-center leading-tight px-2 uppercase">
              {label}
            </span>
          )}
        </motion.div>
      </motion.div>
    </>
  );
};
