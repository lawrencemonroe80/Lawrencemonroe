import React from 'react';

interface WordmarkProps {
  className?: string;
  outline?: boolean;
  color?: string;
  tracking?: string;
  italic?: boolean;
}

/**
 * PP EDITORIAL NEW WORDMARK — v5
 * Editorial serif wordmark, italic by default.
 */
export const Wordmark: React.FC<WordmarkProps> = ({
  className = '',
  outline = false,
  color = '#FFFFFF',
  tracking = '0.18em',
  italic = true,
}) => {
  return (
    <span
      className={`inline-block select-none whitespace-nowrap ${className}`}
      style={{
        fontFamily: "'PP Editorial New', 'Playfair Display', serif",
        fontWeight: 400,
        letterSpacing: tracking,
        color: outline ? 'transparent' : color,
        WebkitTextStroke: outline ? `1px ${color}` : 'unset',
        fontStyle: italic ? 'italic' : 'normal',
        lineHeight: 0.9,
        textTransform: 'uppercase',
      }}
    >
      Lawrence Monroe
    </span>
  );
};

interface PillBadgeProps {
  variant?: 'white' | 'blue' | 'gold';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PillBadge: React.FC<PillBadgeProps> = ({
  variant = 'white',
  className = '',
  size = 'md',
}) => {
  const styles =
    variant === 'blue'
      ? { bg: 'bg-[#3D5089]', text: 'text-bone' }
      : variant === 'gold'
        ? { bg: 'bg-gold', text: 'text-black' }
        : { bg: 'bg-white', text: 'text-black' };

  const sizeClasses = {
    sm: 'px-3 py-0.5 text-[10px]',
    md: 'px-4 py-1 text-xs sm:text-sm',
    lg: 'px-5 py-1.5 text-base sm:text-lg',
  };

  return (
    <div className={`inline-flex items-center gap-1 select-none ${className}`}>
      <div
        className={`rounded-full ${styles.bg} ${sizeClasses[size]} relative flex items-center justify-center`}
        style={{ boxShadow: '0 0 0 1px black' }}
      >
        <span
          className={`${styles.text}`}
          style={{
            fontFamily: "'PP Editorial New', serif",
            fontStyle: 'italic',
            letterSpacing: '0.05em',
            fontWeight: 400,
          }}
        >
          Lawrence Monroe
        </span>
      </div>
    </div>
  );
};

export const MonogramMark: React.FC<{
  className?: string;
  tone?: 'dark' | 'light';
  gold?: boolean;
}> = ({ className = 'w-9 h-9', tone = 'light', gold = false }) => {
  const baseColor = gold ? '#C79F3D' : tone === 'light' ? '#FFFFFF' : '#0A0A0A';
  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      <span
        style={{
          fontFamily: "'PP Editorial New', serif",
          fontStyle: 'italic',
          fontWeight: 400,
          color: baseColor,
          letterSpacing: '0.02em',
          fontSize: '1.1em',
          lineHeight: 1,
        }}
      >
        LM
      </span>
    </div>
  );
};
