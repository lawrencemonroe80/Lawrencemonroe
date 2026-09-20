import React from 'react';

interface WordmarkProps {
  className?: string;
  outline?: boolean;
  color?: string;
}

export const Wordmark: React.FC<WordmarkProps> = ({
  className = 'h-6 sm:h-8 w-auto',
  outline = false,
  color = '#FFFFFF',
}) => {
  return (
    <div className={`inline-flex items-center justify-center select-none ${className}`}>
      <span
        style={{
          fontFamily: "'Cormorant Garamond', 'Didot', 'Bodoni MT', 'Times New Roman', serif",
          fontWeight: 700,
          letterSpacing: '0.14em',
          color: outline ? 'transparent' : color,
          WebkitTextStroke: outline ? '1px #FFFFFF' : 'unset',
          textTransform: 'uppercase',
          lineHeight: 1,
        }}
        className="text-xl sm:text-2xl md:text-3xl font-bold tracking-[0.14em] text-center"
      >
        LAWRENCE MONROE
      </span>
    </div>
  );
};

interface PillBadgeProps {
  variant?: 'white' | 'blue';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PillBadge: React.FC<PillBadgeProps> = ({
  variant = 'white',
  className = '',
  size = 'md',
}) => {
  const isBlue = variant === 'blue';
  const bgColor = isBlue ? 'bg-[#00A3FF]' : 'bg-white';
  const textColor = 'text-black';
  const borderColor = isBlue ? 'border-[#00A3FF]' : 'border-white';

  const sizeClasses = {
    sm: 'px-3 py-0.5 text-xs border-[2px]',
    md: 'px-5 py-1.5 text-sm sm:text-base border-[3px]',
    lg: 'px-7 py-2 text-lg sm:text-xl border-[4px]',
  };

  return (
    <div className={`inline-flex items-center space-x-1 select-none ${className}`}>
      {/* Outer Pill Container */}
      <div
        className={`rounded-full border-black shadow-lg ${bgColor} ${sizeClasses[size]} relative overflow-hidden flex items-center justify-center`}
        style={{
          boxShadow: '0 0 0 2px black, 0 4px 12px rgba(0,0,0,0.8)',
        }}
      >
        {/* Inner Border Ring */}
        <div className="absolute inset-[3px] rounded-full border border-black pointer-events-none" />
        
        {/* "LawrenceMonroe" Typography */}
        <span
          className={`font-serif font-extrabold ${textColor} tracking-tight z-10 px-2 py-0.5`}
          style={{
            fontFamily: "'Cormorant Garamond', 'Didot', 'Times New Roman', serif",
            letterSpacing: '-0.02em',
          }}
        >
          LawrenceMonroe
        </span>
      </div>

      {/* Registered Trademark (R) */}
      <span
        className={`font-mono text-[9px] font-bold ${isBlue ? 'text-[#00A3FF]' : 'text-white'} border border-current rounded-full w-3.5 h-3.5 flex items-center justify-center`}
      >
        R
      </span>
    </div>
  );
};

export const MonogramMark: React.FC<{ className?: string; tone?: 'dark' | 'light' }> = ({
  className = 'w-8 h-8',
  tone = 'dark',
}) => {
  const light = tone === 'light';
  return (
    <div
      className={`relative border flex items-center justify-center p-1.5 select-none ${
        light ? 'border-line-dark bg-white/70' : 'border-line bg-graphite'
      } ${className}`}
    >
      <span
        className={`font-serif font-extrabold text-base tracking-widest ${light ? 'text-ink' : 'text-bone'}`}
        style={{ fontFamily: "'Cormorant Garamond', 'Didot', serif" }}
      >
        LM
      </span>
      <div className="absolute bottom-1 left-2 right-2 h-[1px] bg-gold" />
    </div>
  );
};
