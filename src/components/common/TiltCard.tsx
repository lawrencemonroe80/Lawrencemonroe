import React, { useRef, useState } from 'react';

export const TiltCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}> = ({ children, className = '', maxTilt = 4 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const tiltX = (y - 0.5) * -maxTilt;
    const tiltY = (x - 0.5) * maxTilt;
    setTransform(`perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`);
  };

  const handleLeave = () => setTransform('perspective(900px) rotateX(0deg) rotateY(0deg)');

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transform,
        transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </div>
  );
};
