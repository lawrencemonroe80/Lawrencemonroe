import React, { useEffect, useRef, useState } from 'react';
import { Lock, Zap, AlertCircle, Loader2 } from 'lucide-react';
import { CartItem } from '../../types';
import { formatCurrency } from '../../utils/format';

declare global {
  interface Window {
    Square?: any;
  }
}

export const InlineSquareCheckout: React.FC<{
  items: CartItem[];
  subtotal: number;
  onSuccess: (orderId: string) => void;
  onCancel: () => void;
}> = ({ items, subtotal, onSuccess, onCancel }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [simulated, setSimulated] = useState(false);

  const cardContainerRef = useRef<HTMLDivElement>(null);
  const cardInstanceRef = useRef<any>(null);

  const appId = import.meta.env.VITE_SQUARE_APP_ID || 'sandbox-sq0idb-mock-app-id';
  const locationId = import.meta.env.VITE_SQUARE_LOCATION_ID || 'mock-location-id';

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!window.Square) {
        if (mounted) setSimulated(true);
        return;
      }
      try {
        const payments = window.Square.payments(appId, locationId);
        const card = await payments.card({
          style: {
            '.input-container': {
              borderColor: 'rgba(255, 255, 255, 0.20)',
              borderRadius: '0px',
            },
            '.input-container.is-focus': { borderColor: '#C79F3D' },
            '.input-container.is-error': { borderColor: '#683B16' },
            input: {
              backgroundColor: '#000000',
              color: '#FFFFFF',
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: '12px',
            },
            'input::placeholder': { color: '#999999' },
          },
        });
        if (cardContainerRef.current && mounted) {
          cardContainerRef.current.innerHTML = '';
          await card.attach(cardContainerRef.current);
          cardInstanceRef.current = card;
          setSdkReady(true);
        }
      } catch {
        if (mounted) setSimulated(true);
      }
    };

    const timer = setTimeout(init, 250);
    return () => {
      mounted = false;
      clearTimeout(timer);
      if (cardInstanceRef.current) {
        try {
          cardInstanceRef.current.destroy();
        } catch {}
        cardInstanceRef.current = null;
      }
    };
  }, [appId, locationId]);

  const handlePay = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setError('A valid email is required for the order record.');
      return;
    }

    setStatus('processing');
    setError(null);

    try {
      let token = 'cnon:card-nonce-ok';

      if (sdkReady && cardInstanceRef.current) {
        const result = await cardInstanceRef.current.tokenize();
        if (result.status === 'OK') {
          token = result.token;
        } else {
          setStatus('error');
          setError(result.errors?.map((e: any) => e.message).join(', ') || 'Card tokenization failed.');
          return;
        }
      }

      const res = await fetch('/api/square/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceId: token,
          customer: { email, shippingOption: 'standard' },
          items: items.map((i) => ({
            productId: i.productId,
            size: i.size,
            quantity: i.quantity,
            color: i.color,
          })),
          idempotencyKey:
            globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `lm-${Date.now()}`,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.orderId) {
        onSuccess(data.orderId);
      } else {
        setStatus('error');
        setError(data?.error || 'Express checkout failed. Try the full checkout page.');
      }
    } catch (err: any) {
      setStatus('error');
      setError(err?.message || 'Unexpected error during express checkout.');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <Zap size={12} className="text-gold" />
          <span className="font-mono text-[10px] text-gold tracking-[0.25em] uppercase">
            Express Lane — Instant Pay
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[9px] text-white/40 uppercase tracking-[0.2em]">
          <Lock size={10} className="text-gold" />
          Square secured
        </div>
      </div>

      <label className="block space-y-2">
        <span className="folio">Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          autoComplete="email"
          className="w-full bg-transparent border-b border-hairline focus:border-gold outline-none py-2 font-body text-base text-white placeholder:text-white/30 transition-colors"
        />
      </label>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="folio">Card</span>
          <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/40">
            {simulated ? 'Sandbox simulation' : 'Hosted fields'}
          </span>
        </div>
        <div ref={cardContainerRef} className={`min-h-[76px] border border-hairline bg-black p-3 ${simulated ? 'hidden' : 'block'}`} />
        {simulated && (
          <div className="border border-hairline p-3.5 font-mono text-[10px] text-white/50 leading-relaxed">
            Square SDK unavailable in this environment — express pay will submit a simulated sandbox token. The server still validates stock, pricing, and creates the order record end-to-end.
          </div>
        )}
      </div>

      {status === 'error' && error && (
        <div className="flex items-start gap-2 border border-gold/40 bg-gold/5 p-3 font-mono text-[10px] text-white leading-relaxed">
          <AlertCircle size={12} className="text-gold shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-3 border-t border-hairline pt-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/50">Total</span>
          <span className="font-display text-2xl text-white">{formatCurrency(subtotal)}</span>
        </div>

        <button
          onClick={handlePay}
          disabled={status === 'processing' || items.length === 0}
          className="btn-gold w-full justify-center disabled:opacity-50"
        >
          {status === 'processing' ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              Processing
            </>
          ) : (
            <>
              <Zap size={13} />
              Pay {formatCurrency(subtotal)}
            </>
          )}
        </button>

        <div className="flex items-center justify-between">
          <button onClick={onCancel} className="link-arrow text-white/40 hover:text-white text-[10px]">
            <ArrowLeftIcon /> Back to bag
          </button>
          <span className="font-mono text-[9px] text-white/40 tracking-[0.2em] uppercase">
            Shipping confirmed by email
          </span>
        </div>
      </div>
    </div>
  );
};

const ArrowLeftIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);
