import React, { useRef, useState, useEffect } from 'react';

export const Magnetic: React.FC<{
  children: React.ReactElement;
  strength?: number;
  className?: string;
}> = ({ children, strength = 0.3, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      setOffset({ x: x * strength, y: y * strength });
    };
    const handleLeave = () => setOffset({ x: 0, y: 0 });

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [strength]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        display: 'inline-block',
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {children}
    </div>
  );
};
