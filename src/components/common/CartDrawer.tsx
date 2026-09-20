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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) closeCart();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  useEffect(() => {
    document.body.style.overflow = isCartOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

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
        <div className="fixed inset-0 z-[70] overflow-hidden" role="dialog" aria-modal="true" aria-label="Shopping Cart">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.83, 0, 0.17, 1] }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/75 backdrop-blur-xl"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 280, damping: 32, mass: 0.8 }}
              className="glass-heavy w-screen max-w-md flex flex-col"
            >
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-hairline flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {mode === 'EXPRESS' ? (
                    <>
                      <Zap size={13} className="text-gold" />
                      <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-gold font-medium">
                        Express Checkout
                      </span>
                    </>
                  ) : mode === 'SUCCESS' ? (
                    <>
                      <CheckCircle2 size={13} className="text-gold" />
                      <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-gold font-medium">
                        Allocation Confirmed
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-bone">
                        Bag
                      </span>
                      <span className="font-mono text-[10px] text-bone/40">
                        {itemCount.toString().padStart(2, '0')} {itemCount === 1 ? 'piece' : 'pieces'}
                      </span>
                    </>
                  )}
                </div>
                <button
                  onClick={closeCart}
                  className="p-1.5 text-bone/60 hover:text-gold transition-colors"
                  aria-label="Close cart"
                >
                  <X size={18} strokeWidth={1.2} />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar">
                {mode === 'SUCCESS' ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-5">
                    <div className="w-16 h-16 border border-gold/60 flex items-center justify-center">
                      <CheckCircle2 size={26} className="text-gold" strokeWidth={1.2} />
                    </div>
                    <div className="space-y-2">
                      <h3
                        className="text-3xl text-bone uppercase leading-[0.9]"
                        style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
                      >
                        Order secured.
                      </h3>
                      <p className="font-body text-sm text-bone/60 leading-relaxed max-w-xs">
                        A confirmation record has been dispatched to your email.
                      </p>
                      {lastOrderId && (
                        <div className="inline-block font-mono text-[10px] text-gold border border-gold/50 px-3 py-1.5 mt-3 tracking-[0.24em]">
                          REF — {lastOrderId}
                        </div>
                      )}
                    </div>
                    <div className="space-y-3 pt-4 w-full">
                      <button onClick={closeCart} className="btn-mono w-full justify-center">
                        Continue exploring
                      </button>
                      <button onClick={() => navigate('/shop')} className="link-arrow w-full justify-center text-bone/40 hover:text-gold">
                        Return to catalog
                      </button>
                    </div>
                  </div>
                ) : items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                    <div className="w-16 h-16 border border-hairline flex items-center justify-center text-bone/40">
                      <ShoppingBag size={24} strokeWidth={1.2} />
                    </div>
                    <div className="space-y-2">
                      <h3
                        className="text-2xl text-bone uppercase leading-[0.95]"
                        style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
                      >
                        Your bag is empty.
                      </h3>
                      <p className="font-body text-sm text-bone/50 max-w-xs">
                        Return to Release 001 to allocate limited specimens.
                      </p>
                    </div>
                    <button onClick={handleContinueShopping} className="btn-mono mt-4">
                      View the pieces
                      <ArrowRight size={14} />
                    </button>
                  </div>
                ) : mode === 'EXPRESS' ? (
                  <InlineSquareCheckout
                    items={items}
                    subtotal={subtotal}
                    onSuccess={handleExpressSuccess}
                    onCancel={() => setMode('BAG')}
                  />
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.cartItemId}
                        className="border border-hairline p-4 flex gap-4 group hover:border-bone/30 transition-colors"
                      >
                        <div className="w-20 h-24 bg-ink overflow-hidden shrink-0 relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover img-mono"
                          />
                          <div className="absolute top-1 left-1 font-mono text-[8px] bg-black/85 px-1.5 py-0.5 text-gold tracking-wider">
                            {item.size}
                          </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div className="space-y-1">
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-mono text-[9px] text-bone/40 tracking-wider">
                                {item.code}
                              </span>
                              <button
                                onClick={() => removeItem(item.cartItemId)}
                                className="text-bone/40 hover:text-gold transition-colors p-0.5"
                                aria-label={`Remove ${item.name}`}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>

                            <h4
                              className="text-base text-bone leading-[0.95] uppercase"
                              style={{ fontFamily: "'PP Editorial New', serif", letterSpacing: "0.02em" }}
                            >
                              {item.name}
                            </h4>
                            <div className="font-mono text-[10px] text-bone/40 flex items-center gap-2">
                              <span>{item.color}</span>
                              <span className="text-gold">·</span>
                              <span>Size {item.size}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-hairline">
                            <div className="flex items-center border border-hairline">
                              <button
                                onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center text-bone/60 hover:text-bone"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={11} />
                              </button>
                              <span className="font-mono text-xs px-2 text-bone min-w-[26px] text-center">
                                {item.quantity.toString().padStart(2, '0')}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                disabled={item.quantity >= item.maxStock}
                                className="w-7 h-7 flex items-center justify-center text-bone/60 hover:text-bone disabled:opacity-30"
                                aria-label="Increase quantity"
                              >
                                <Plus size={11} />
                              </button>
                            </div>

                            <div className="font-mono text-xs font-medium text-gold">
                              {formatCurrency(item.price * item.quantity)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              {items.length > 0 && mode === 'BAG' && (
                <div className="px-6 py-6 border-t border-hairline space-y-4">
                  <div className="space-y-2 pb-3">
                    <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em] uppercase text-bone/50">
                      <span>Shipping</span>
                      <span className="text-gold">Complimentary</span>
                    </div>
                    <div className="flex items-baseline justify-between pt-3 border-t border-hairline">
                      <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-bone/70">
                        Subtotal
                      </span>
                      <span
                        className="text-3xl text-bone leading-none"
                        style={{ fontFamily: "'PP Editorial New', serif", letterSpacing: "0.02em" }}
                      >
                        {formatCurrency(subtotal)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setMode('EXPRESS')}
                    className="btn-gold w-full justify-center"
                  >
                    <Zap size={13} />
                    Instant Checkout
                  </button>

                  <button
                    onClick={handleCheckout}
                    className="btn-mono w-full justify-center"
                  >
                    Full secure checkout
                    <ArrowRight size={14} />
                  </button>

                  <button
                    onClick={closeCart}
                    className="w-full text-center font-mono text-[10px] text-bone/40 hover:text-bone tracking-[0.24em] uppercase transition-colors py-2"
                  >
                    Continue exploring
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
