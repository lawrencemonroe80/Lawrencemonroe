import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ruler, ShieldCheck, Check, ArrowRight, Truck } from 'lucide-react';
import { Product, Size } from '../../types';
import { ProductAccordion } from './ProductAccordion';
import { formatCurrency } from '../../utils/format';
import { useCartStore } from '../../store/cartStore';

interface ProductPurchasingPanelProps {
  product: Product;
}

export const ProductPurchasingPanel: React.FC<ProductPurchasingPanelProps> = ({ product }) => {
  const [selectedColor, setSelectedColor] = useState<string>(product.selectedColorDefault);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const navigate = useNavigate();
  const { addItem, openCart, openSizeGuide } = useCartStore();

  const handleColorChange = (colorName: string) => {
    setSelectedColor(colorName);
    if (colorName.toLowerCase().includes('bone') && product.slug === 'lm-shorts-001') {
      navigate('/drop/lm-shorts-002');
    } else if (colorName.toLowerCase().includes('black') && product.slug === 'lm-shorts-002') {
      navigate('/drop/lm-shorts-001');
    }
  };

  const handleSizeSelect = (size: Size) => {
    setSelectedSize(size);
    setSizeError(false);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }

    setIsAdded(true);
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      code: product.code,
      color: selectedColor,
      size: selectedSize,
      price: product.price,
      image: product.cutoutImage,
      maxStock: product.stockCount,
      quantity: 1,
    });

    setTimeout(() => {
      setIsAdded(false);
      openCart();
    }, 500);
  };

  const accordionItems = [
    { id: 'story', title: 'Story & Design Concept', content: product.story },
    { id: 'fit', title: 'Silhouette & Fit Spec', content: product.fit },
    { id: 'construction', title: 'Craft & Construction', content: product.construction },
    { id: 'fabric', title: '480GSM Textile & Care', content: product.fabricAndCare },
    { id: 'shipping', title: 'Shipping & Returns', content: product.shippingAndReturns },
  ];

  return (
    <div className="space-y-8 bg-black border border-hairline p-6 sm:p-8 lg:p-10 sticky top-32">
      {/* Header */}
      <div className="space-y-3 border-b border-hairline pb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-gold" />
            <span className="folio text-gold">{product.release}</span>
          </div>
          <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-bone/40">
            {product.code}
          </span>
        </div>

        <h1
          className="text-6xl sm:text-7xl lg:text-8xl text-bone uppercase leading-[0.9] tracking-[-0.005em]"
          style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic", letterSpacing: "0.005em" }}
        >
          {product.name}
        </h1>

        <div
          className="text-3xl text-bone pt-2 leading-none"
          style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
        >
          {formatCurrency(product.price)}
        </div>
      </div>

      <p
        className="text-base text-bone/60 leading-relaxed"
        style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
      >
        {product.shortDescription}
      </p>

      {/* Color selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="folio">Colorway</span>
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-bone/70">
            {selectedColor}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {product.colors.map((color) => {
            const isSelected = selectedColor === color.name;
            return (
              <button
                key={color.name}
                onClick={() => handleColorChange(color.name)}
                className={`flex items-center gap-2.5 px-3 py-2 border transition-colors ${
                  isSelected
                    ? 'border-gold bg-gold/5 text-bone'
                    : 'border-hairline text-bone/60 hover:border-bone/50 hover:text-bone'
                }`}
                aria-label={`Select color ${color.name}`}
              >
                <span
                  className="w-4 h-4 border"
                  style={{
                    backgroundColor: color.hex,
                    borderColor: color.borderHex || '#333',
                  }}
                />
                <span className="font-mono text-[10px] tracking-[0.18em] uppercase">
                  {color.code}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Size selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="folio">Select size</span>
          <button
            onClick={openSizeGuide}
            className="link-arrow text-bone/60 hover:text-gold text-[10px]"
          >
            <Ruler size={11} strokeWidth={1.5} />
            Size guide
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {product.sizes.map((sizeObj) => {
            const isSelected = selectedSize === sizeObj.size;
            return (
              <button
                key={sizeObj.size}
                disabled={!sizeObj.available}
                onClick={() => handleSizeSelect(sizeObj.size)}
                className={`py-3.5 border transition-colors relative ${
                  isSelected
                    ? 'border-bone bg-bone text-black'
                    : sizeObj.available
                      ? 'border-hairline text-bone hover:border-bone'
                      : 'border-hairline/50 text-bone/30 cursor-not-allowed line-through'
                }`}
                aria-label={`Size ${sizeObj.size} ${sizeObj.available ? 'available' : 'unavailable'}`}
              >
                <span
                  className="text-lg leading-none"
                  style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic", letterSpacing: "0.02em" }}
                >
                  {sizeObj.size}
                </span>
                {isSelected && (
                  <span className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-gold" />
                )}
              </button>
            );
          })}
        </div>

        {sizeError && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-[10px] text-gold tracking-[0.28em] uppercase pt-1"
          >
            Select a size to continue.
          </motion.div>
        )}
      </div>

      {/* Inventory */}
      <div className="border border-hairline p-4 space-y-2 font-mono text-[10px] tracking-[0.18em] uppercase">
        <div className="flex items-center justify-between">
          <span className="text-bone/40">Production</span>
          <span className="text-gold font-medium">Limited run</span>
        </div>
        <div className="flex items-center justify-between text-bone/40">
          <span>Dispatch</span>
          <span className="text-bone">Ships 2–4 days</span>
        </div>
      </div>

      {/* Add to bag */}
      <div className="space-y-3">
        <button
          onClick={handleAddToCart}
          className={`w-full py-4 font-mono text-[11px] font-medium tracking-[0.28em] uppercase transition-colors flex items-center justify-center gap-2 border ${
            isAdded
              ? 'border-gold bg-gold text-black'
              : 'border-bone text-bone hover:bg-bone hover:text-black'
          }`}
        >
          {isAdded ? (
            <>
              <Check size={14} /> Added to bag
            </>
          ) : (
            <>
              Add to bag <ArrowRight size={14} />
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-4 font-mono text-[10px] text-bone/50 tracking-[0.24em] uppercase pt-1">
          <span className="flex items-center gap-1.5">
            <Truck size={11} className="text-gold" strokeWidth={1.5} /> Complimentary
          </span>
          <span className="text-gold">·</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={11} className="text-gold" strokeWidth={1.5} /> Serialized
          </span>
        </div>
      </div>

      {/* Accordions */}
      <div className="pt-2">
        <ProductAccordion items={accordionItems} />
      </div>
    </div>
  );
};
