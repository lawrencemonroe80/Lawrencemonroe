import React from 'react';

/**
 * Minimalist editorial redactor — black bar with monogram + label.
 */
export const EditorialFaceBlur: React.FC<{
  top?: string;
  left?: string;
  width?: string;
  height?: string;
  label?: string;
}> = ({ top = '10%', left = '50%', width = '88px', height = '24px', label = 'LM' }) => {
  return (
    <div
      className="absolute z-10 backdrop-blur-md bg-black/80 border border-bone/15 flex items-center justify-center"
      style={{
        top,
        left,
        width,
        height,
        transform: 'translateX(-50%)',
      }}
    >
      <span className="font-mono text-[9px] tracking-[0.28em] uppercase text-gold font-medium">
        {label}
      </span>
    </div>
  );
};
