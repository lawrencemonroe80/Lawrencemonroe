import React from 'react';

export const GoldAccent: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span className={`inline-block w-2 h-2 bg-gold ${className}`} />
);
