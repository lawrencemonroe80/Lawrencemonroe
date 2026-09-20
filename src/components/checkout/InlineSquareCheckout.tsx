import React, { useEffect, useRef, useState } from 'react';
import { Lock, Zap, AlertCircle, Loader2 } from 'lucide-react';
import { CartItem } from '../../types';
import { formatCurrency } from '../../utils/format';

declare global {
  interface Window {
    Square?: any;
  }
}

/**
 * INLINE SQUARE EXPRESS CHECKOUT (cart drawer)
 * --------------------------------------------
 * Instant-pay lane embedded in the cart overlay: the Square Web Payments
 * SDK card fields mount directly in the drawer, tokenize client-side
 * (PCI SAQ-A — raw card data never touches our code), and the token is
 * charged server-side via POST /api/square/checkout.
 *
 * - Real SDK mode when window.Square + app credentials are available.
 * - Simulated token mode otherwise (sandbox/dev) so the full flow stays
 *   demonstrable; the server still validates and creates the order.
 */
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
              borderColor: 'rgba(231, 225, 215, 0.17)',
              borderRadius: '0px',
            },
            '.input-container.is-focus': { borderColor: '#AD8A48' },
            '.input-container.is-error': { borderColor: '#743530' },
            input: {
              backgroundColor: '#050505',
              color: '#E7E1D7',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
            },
            'input::placeholder': { color: '#9A958D' },
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
        } catch {
          /* noop */
        }
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
      let token = 'cnon:card-nonce-ok'; // simulated sandbox token

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
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line pb-3">
        <div className="flex items-center gap-2">
          <Zap size={12} className="text-gold" />
          <span className="font-mono text-[10px] text-gold tracking-[0.25em] uppercase font-bold">
            Express Lane / Instant Pay
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[9px] text-smoke uppercase">
          <Lock size={10} className="text-gold" />
          Square Secured
        </div>
      </div>

      {/* Email */}
      <label className="block space-y-1.5">
        <span className="font-mono text-[9px] text-smoke tracking-[0.2em] uppercase">
          Order Email (required)
        </span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="CLIENT@DOMAIN.COM"
          autoComplete="email"
          className="w-full bg-black border border-line focus:border-gold outline-none px-3 py-2.5 font-mono text-xs text-bone placeholder:text-smoke/50 uppercase tracking-wider transition-colors"
        />
      </label>

      {/* Square card mount (or simulated notice) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between font-mono text-[9px] text-smoke tracking-[0.2em] uppercase">
          <span>Card — Tokenized by Square</span>
          <span className="text-gold/80">{simulated ? 'SANDBOX SIMULATION' : 'HOSTED FIELDS'}</span>
        </div>
        <div
          ref={cardContainerRef}
          className={`min-h-[76px] border border-line bg-black p-2.5 ${simulated ? 'hidden' : 'block'}`}
        />
        {simulated && (
          <div className="border border-line bg-black p-3.5 font-mono text-[10px] text-smoke leading-relaxed">
            SQUARE SDK UNAVAILABLE IN THIS ENVIRONMENT — EXPRESS PAY WILL SUBMIT A SIMULATED
            SANDBOX TOKEN. THE SERVER STILL VALIDATES STOCK, PRICING, AND CREATES THE ORDER
            RECORD END-TO-END.
          </div>
        )}
      </div>

      {/* Error line */}
      {status === 'error' && error && (
        <div className="flex items-start gap-2 border border-archive-red/50 bg-archive-red/10 p-3 font-mono text-[10px] text-bone leading-relaxed">
          <AlertCircle size={12} className="text-archive-red shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Total + Pay */}
      <div className="space-y-3 border-t border-line pt-4">
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="text-smoke tracking-wider">TOTAL (SHIPPING COMPLIMENTARY)</span>
          <span className="text-gold font-bold text-base">{formatCurrency(subtotal)}</span>
        </div>

        <button
          onClick={handlePay}
          disabled={status === 'processing' || items.length === 0}
          className="w-full bg-gold hover:bg-gold-soft disabled:opacity-60 text-black py-3.5 px-6 font-mono text-xs font-bold tracking-[0.25em] uppercase flex items-center justify-center gap-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-bone"
        >
          {status === 'processing' ? (
            <>
              <Loader2 size={13} className="animate-spin" /> Processing…
            </>
          ) : (
            <>
              <Zap size={13} /> Pay {formatCurrency(subtotal)}
            </>
          )}
        </button>

        <div className="flex items-center justify-between">
          <button
            onClick={onCancel}
            className="font-mono text-[10px] text-smoke hover:text-bone tracking-[0.2em] uppercase transition-colors"
          >
            ← Back to bag
          </button>
          <span className="font-mono text-[9px] text-smoke/60 tracking-[0.15em] uppercase">
            Shipping confirmed by email
          </span>
        </div>
      </div>
    </div>
  );
};
