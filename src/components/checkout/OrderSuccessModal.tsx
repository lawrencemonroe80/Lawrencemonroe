import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Printer, ShieldCheck } from 'lucide-react';
import { OrderResult } from '../../types';
import { formatCurrency } from '../../utils/format';

interface OrderSuccessModalProps {
  order: OrderResult;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-black/90 backdrop-blur-xl p-4 sm:p-6 md:p-10 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-3xl bg-black border border-hairline-strong relative"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

        <div className="text-center space-y-5 border-b border-hairline p-6 sm:p-10">
          <div className="w-14 h-14 border border-gold mx-auto flex items-center justify-center text-gold">
            <Check size={26} strokeWidth={1.2} />
          </div>

          <div className="inline-block font-mono text-[10px] text-gold tracking-[0.3em] uppercase border border-gold/40 px-3 py-1">
            Order authorized & serialized
          </div>

          <h2 className="font-display-mega text-4xl sm:text-6xl text-white uppercase leading-[0.92]">
            Allocation{' '}
            <span
              className="italic text-gold-shine"
              style={{ fontFamily: "'PP Editorial New', serif" }}
            >
              confirmed.
            </span>
          </h2>

          <p className="text-sm text-white/60 max-w-md mx-auto leading-relaxed">
            Your telemetry and shipping record has been sealed. A confirmation dispatch has been sent to{' '}
            <span className="text-white font-mono">{order.customer.email}</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-hairline p-6 sm:p-10">
          <div className="space-y-2">
            <div className="folio text-white/40">Order serial</div>
            <div className="font-display text-lg text-gold tracking-wider">{order.orderId}</div>
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40">
              Payment ref · {order.paymentId}
            </div>
          </div>
          <div className="space-y-2">
            <div className="folio text-white/40">Shipping destination</div>
            <div className="font-display-mega text-lg text-white">{order.customer.firstName} {order.customer.lastName}</div>
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/50 leading-relaxed">
              {order.customer.address}, {order.customer.city}, {order.customer.postalCode}, {order.customer.country}
            </div>
          </div>
        </div>

        <div className="space-y-3 p-6 sm:p-10 border-b border-hairline">
          <div className="folio text-gold">Serialized specimens</div>
          <div className="border border-hairline">
            {order.items.map((item) => (
              <div key={item.cartItemId} className="p-4 flex items-center justify-between border-b border-hairline last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-14 bg-ink border border-hairline overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover img-mono" />
                  </div>
                  <div>
                    <div className="font-display-mega text-base text-white">{item.name}</div>
                    <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 mt-1">
                      {item.code} · {item.color} · Size {item.size} · Qty {item.quantity}
                    </div>
                  </div>
                </div>
                <div className="font-display-mega text-base text-white">
                  {formatCurrency(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline p-6 sm:p-10">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase text-white/60">
            <ShieldCheck size={12} className="text-gold" />
            <span>Dispatch within 2–4 business days</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/50">Total billed</span>
            <span className="font-display text-3xl text-gold">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 p-6 sm:p-10">
          <button
            onClick={handlePrint}
            className="btn-ghost flex items-center justify-center gap-2"
          >
            <Printer size={14} />
            Print dossier receipt
          </button>
          <button onClick={onClose} className="btn-mono flex-1 justify-center">
            <span>Return to release</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
