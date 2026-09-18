import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { formatCurrency } from '../../utils/format';
import { InlineSquareCheckout } from '../checkout/InlineSquareCheckout';

/**
 * CART DRAWER — slide-over bag + INSTANT SQUARE CHECKOUT
 * ------------------------------------------------------
 * Modes:
 *   BAG     — line items, quantity steppers, subtotal → full /checkout
 *   EXPRESS — inline Square Web Payments SDK card form; tokenize + charge
 *             through /api/square/checkout without leaving the overlay
 *   SUCCESS — order confirmation receipt (order id, continue links)
 *
 * Motion: spring slide (210/30/0.9) + spec-exact blur(20px) backdrop,
 * gold seam on the leading edge.
 */

type DrawerMode = 'BAG' | 'EXPRESS' | 'SUCCESS';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getSubtotal,
    getItemCount,
    clearCart,
  } = useCartStore();

  const navigate = useNavigate();
  const [mode, setMode] = useState<DrawerMode>('BAG');
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  const subtotal = getSubtotal();
  const itemCount = getItemCount();

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) closeCart();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Lock body scroll when cart is open
  useEffect(() => {
    document.body.style.overflow = isCartOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  // Reset to BAG whenever the drawer closes
  useEffect(() => {
    if (!isCartOpen) {
      const t = setTimeout(() => setMode('BAG'), 400);
      return () => clearTimeout(t);
    }
  }, [isCartOpen]);

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleExpressSuccess = (orderId: string) => {
    setLastOrderId(orderId);
    clearCart();
    setMode('SUCCESS');
  };

  const handleContinueShopping = () => {
    closeCart();
    navigate('/shop');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Shopping Cart">
          {/* Backdrop — spec-exact glass blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.83, 0, 0.17, 1] }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-[20px]"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            {/* Slide-over panel with fine gold seam line */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 210, damping: 30, mass: 0.9 }}
              className="w-screen max-w-md bg-graphite border-l border-line shadow-2xl flex flex-col justify-between relative"
            >
              {/* Fine gold edge seam line */}
              <div className="absolute top-0 left-0 bottom-0 w-[1px] bg-gradient-to-b from-gold via-gold/40 to-transparent" />

              {/* Drawer Header */}
              <div className="p-6 border-b border-line flex items-center justify-between bg-black/40">
                <div className="flex items-center space-x-3">
                  {mode === 'EXPRESS' ? (
                    <>
                      <Zap size={13} className="text-gold" />
                      <span className="font-mono text-xs text-gold tracking-widest uppercase font-bold">
                        EXPRESS CHECKOUT
                      </span>
                    </>
                  ) : mode === 'SUCCESS' ? (
                    <>
                      <CheckCircle2 size={13} className="text-gold" />
                      <span className="font-mono text-xs text-gold tracking-widest uppercase font-bold">
                        ALLOCATION CONFIRMED
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="font-mono text-xs text-gold tracking-widest uppercase">
                        BAG ALLOCATION
                      </span>
                      <span className="font-mono text-[10px] text-smoke">
                        [{itemCount} {itemCount === 1 ? 'PIECE' : 'PIECES'}]
                      </span>
                    </>
                  )}
                </div>

                <button
                  onClick={closeCart}
                  className="p-1.5 border border-line text-bone hover:text-gold hover:border-gold transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-gold"
                  aria-label="Close cart"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                {mode === 'SUCCESS' ? (
                  /* ---- SUCCESS RECEIPT ---- */
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-5">
                    <div className="w-16 h-16 border border-gold/60 bg-black/60 flex items-center justify-center">
                      <CheckCircle2 size={26} className="text-gold" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-display text-xl font-bold text-bone uppercase tracking-wide">
                        ORDER SECURED.
                      </h3>
                      <p className="font-mono text-[11px] text-smoke leading-relaxed max-w-xs">
                        A CONFIRMATION RECORD HAS BEEN DISPATCHED TO YOUR EMAIL. FULFILLMENT
                        TELEMETRY FOLLOWS VIA THE SQUARE ORDER DESK.
                      </p>
                      {lastOrderId && (
                        <div className="inline-block font-mono text-[10px] text-gold border border-gold/50 bg-black/60 px-3 py-1.5 mt-2 tracking-[0.2em]">
                          REF: {lastOrderId}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 pt-2">
                      <button
                        onClick={closeCart}
                        className="border border-gold bg-black px-6 py-3 font-mono text-xs font-bold text-gold hover:bg-gold hover:text-black transition-colors uppercase tracking-widest"
                      >
                        CONTINUE EXPLORING
                      </button>
                      <div>
                        <button
                          onClick={() => navigate('/shop')}
                          className="font-mono text-[10px] text-smoke hover:text-bone tracking-widest uppercase transition-colors"
                        >
                          RETURN TO CATALOG →
                        </button>
                      </div>
                    </div>
                  </div>
                ) : items.length === 0 ? (
                  /* ---- EMPTY STATE ---- */
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                    <div className="w-16 h-16 border border-line flex items-center justify-center text-smoke/50 bg-black/40">
                      <ShoppingBag size={24} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-display text-lg font-bold text-bone uppercase tracking-wide">
                        YOUR CART IS EMPTY.
                      </h3>
                      <p className="font-mono text-xs text-smoke max-w-xs">
                        RETURN TO RELEASE 001 TO ALLOCATE LIMITED SPECIMENS.
                      </p>
                    </div>
                    <button
                      onClick={handleContinueShopping}
                      className="mt-4 inline-flex items-center space-x-2 border border-gold bg-black px-6 py-3 font-mono text-xs font-bold text-bone hover:bg-gold hover:text-black transition-colors uppercase tracking-widest"
                    >
                      <span>VIEW THE PIECES</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                ) : mode === 'EXPRESS' ? (
                  /* ---- INLINE SQUARE EXPRESS CHECKOUT ---- */
                  <InlineSquareCheckout
                    items={items}
                    subtotal={subtotal}
                    onSuccess={handleExpressSuccess}
                    onCancel={() => setMode('BAG')}
                  />
                ) : (
                  /* ---- BAG LINE ITEMS ---- */
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.cartItemId}
                        className="border border-line bg-black/50 p-3.5 flex space-x-4 relative group hover:border-line/80 transition-colors"
                      >
                        {/* Thumbnail */}
                        <div className="w-20 h-24 bg-graphite border border-line/60 overflow-hidden flex-shrink-0 relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover grayscale brightness-95 contrast-105"
                          />
                          <div className="absolute top-1 left-1 font-mono text-[8px] bg-black/80 px-1 text-gold">
                            {item.size}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="space-y-1">
                            <div className="flex items-start justify-between">
                              <span className="font-mono text-[9px] text-smoke tracking-wider">
                                {item.code}
                              </span>
                              <button
                                onClick={() => removeItem(item.cartItemId)}
                                className="text-smoke hover:text-archive-red transition-colors p-0.5"
                                aria-label={`Remove ${item.name}`}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>

                            <h4 className="font-display text-sm font-bold text-bone leading-tight">
                              {item.name}
                            </h4>
                            <div className="font-mono text-[10px] text-smoke flex items-center space-x-2">
                              <span>COLOR: {item.color}</span>
                              <span className="text-gold">•</span>
                              <span>SIZE: {item.size}</span>
                            </div>
                          </div>

                          {/* Price and Quantity Stepper */}
                          <div className="flex items-center justify-between pt-2 border-t border-line/40">
                            <div className="flex items-center border border-line bg-black">
                              <button
                                onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                className="px-2 py-1 text-smoke hover:text-bone transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={11} />
                              </button>
                              <span className="font-mono text-xs px-2 text-bone font-medium min-w-[20px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                disabled={item.quantity >= item.maxStock}
                                className="px-2 py-1 text-smoke hover:text-bone transition-colors disabled:opacity-30"
                                aria-label="Increase quantity"
                              >
                                <Plus size={11} />
                              </button>
                            </div>

                            <div className="font-mono text-xs font-bold text-bone">
                              {formatCurrency(item.price * item.quantity)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Drawer Footer with Subtotal & Checkout — BAG mode only */}
              {items.length > 0 && mode === 'BAG' && (
                <div className="p-6 border-t border-line bg-black/60 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between font-mono text-xs text-smoke">
                      <span>SHIPPING</span>
                      <span className="text-gold">COMPLIMENTARY</span>
                    </div>
                    <div className="flex items-center justify-between font-mono text-sm text-bone pt-1 border-t border-line/40">
                      <span className="font-bold tracking-wider">SUBTOTAL</span>
                      <span className="font-bold text-gold text-base">{formatCurrency(subtotal)}</span>
                    </div>
                  </div>

                  {/* Instant pay — Square inline form inside the drawer */}
                  <button
                    onClick={() => setMode('EXPRESS')}
                    className="w-full group relative bg-black border border-gold text-gold hover:bg-gold hover:text-black py-3.5 px-6 font-mono text-xs font-bold tracking-[0.25em] uppercase flex items-center justify-center space-x-2 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    <Zap size={13} />
                    <span>INSTANT CHECKOUT — PAY IN BAG</span>
                  </button>

                  {/* Full checkout with shipping details */}
                  <button
                    onClick={handleCheckout}
                    className="w-full relative group overflow-hidden bg-bone text-black py-3.5 px-6 font-mono text-xs font-bold tracking-widest uppercase flex items-center justify-center space-x-2 hover:bg-gold transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    <span>FULL SECURE CHECKOUT</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={closeCart}
                    className="w-full text-center font-mono text-[10px] text-smoke hover:text-bone tracking-widest uppercase transition-colors"
                  >
                    CONTINUE EXPLORING RELEASE 001
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
