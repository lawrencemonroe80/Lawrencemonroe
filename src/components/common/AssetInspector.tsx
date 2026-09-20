import React, { useRef, useState } from 'react';

/**
 * Asset Inspector — magnifier lens on hover for product photos.
 */
export const AssetInspector: React.FC<{
  image: string;
  macroImage?: string;
  zoom?: number;
  alt?: string;
  className?: string;
  imgClassName?: string;
}> = ({ image, macroImage, zoom = 2.4, alt = '', className = '', imgClassName = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [lens, setLens] = useState<{ x: number; y: number; visible: boolean }>({ x: 50, y: 50, visible: false });
  const [activeImage, setActiveImage] = useState(image);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLens({ x, y, visible: true });
    if (macroImage) setActiveImage(macroImage);
  };

  const handleLeave = () => {
    setLens((l) => ({ ...l, visible: false }));
    setActiveImage(image);
  };

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <img src={activeImage} alt={alt} className={`w-full h-full object-cover transition-all duration-500 ${imgClassName}`} />
      {lens.visible && macroImage && (
        <div
          className="absolute pointer-events-none border border-gold"
          style={{
            top: `${lens.y}%`,
            left: `${lens.x}%`,
            width: '140px',
            height: '140px',
            transform: 'translate(-50%, -50%)',
            backgroundImage: `url(${macroImage})`,
            backgroundSize: `${zoom * 100}%`,
            backgroundPosition: `${lens.x}% ${lens.y}%`,
            backgroundRepeat: 'no-repeat',
            borderRadius: '50%',
            boxShadow: '0 0 0 1px rgba(199,159,61,0.4), 0 4px 20px rgba(0,0,0,0.4)',
            transition: 'opacity 0.2s',
          }}
        />
      )}
    </div>
  );
};
