import React from 'react';
import { CartItem } from '../../types';
import { formatCurrency } from '../../utils/format';
import { ShieldCheck, Truck } from 'lucide-react';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  subtotal,
  shippingCost,
  tax,
  total
}) => {
  return (
    <div className="bg-black border border-hairline p-6 sm:p-8 space-y-8">
      <div className="flex items-center justify-between border-b border-hairline pb-4">
        <span className="folio text-gold">Order specification</span>
        <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/40">
          {items.length.toString().padStart(2, '0')} {items.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div className="space-y-4 max-h-80 overflow-y-auto pr-1 no-scrollbar">
        {items.map((item) => (
          <div key={item.cartItemId} className="flex items-center gap-4 border-b border-hairline pb-4 last:border-0 last:pb-0">
            <div className="w-16 h-20 bg-ink border border-hairline overflow-hidden shrink-0 relative">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover img-bw" />
              <div className="absolute top-1 left-1 font-mono text-[8px] bg-black/85 px-1 py-0.5 text-gold tracking-wider">
                {item.size}
              </div>
            </div>

            <div className="flex-1 space-y-1 min-w-0">
              <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/40">{item.code}</div>
              <h4 className="font-display-mega text-sm text-white leading-[0.95]">{item.name}</h4>
              <div className="font-mono text-[10px] text-white/40 tracking-[0.15em] uppercase">
                {item.color} · Qty {item.quantity}
              </div>
            </div>

            <div className="font-display text-base text-gold shrink-0">
              {formatCurrency(item.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-hairline pt-5 space-y-3">
        <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em] uppercase text-white/50">
          <span>Subtotal</span>
          <span className="text-white">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em] uppercase text-white/50">
          <span>Shipping</span>
          <span className="text-gold">{shippingCost === 0 ? 'Complimentary' : formatCurrency(shippingCost)}</span>
        </div>
        <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em] uppercase text-white/50">
          <span>Estimated tax</span>
          <span className="text-white">{formatCurrency(tax)}</span>
        </div>

        <div className="flex items-baseline justify-between pt-4 border-t border-hairline">
          <span className="folio text-white">Total</span>
          <span className="font-display text-3xl text-white">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      <div className="border-t border-hairline pt-4 space-y-2 font-mono text-[10px] tracking-[0.2em] uppercase text-white/40">
        <div className="flex items-center gap-2">
          <ShieldCheck size={12} className="text-gold" />
          <span>Square encrypted transaction</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck size={12} className="text-gold" />
          <span>Ships in 2–4 business days with signature</span>
        </div>
      </div>
    </div>
  );
};
