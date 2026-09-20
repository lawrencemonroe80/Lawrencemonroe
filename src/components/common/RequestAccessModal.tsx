import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Lock } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

export const RequestAccessModal: React.FC = () => {
  const { isRequestAccessOpen, closeRequestAccess, requestAccessCategory } = useCartStore();
  const [email, setEmail] = useState('');
  const [shirtSelected, setShirtSelected] = useState(true);
  const [hatSelected, setHatSelected] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (requestAccessCategory === 'SHIRT') {
      setShirtSelected(true);
      setHatSelected(false);
    } else if (requestAccessCategory === 'HEADWEAR') {
      setShirtSelected(false);
      setHatSelected(true);
    } else {
      setShirtSelected(true);
      setHatSelected(true);
    }
    setIsSubmitted(false);
    setEmail('');
  }, [requestAccessCategory, isRequestAccessOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isRequestAccessOpen) {
        closeRequestAccess();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRequestAccessOpen, closeRequestAccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubmitted(true);
  };

  return (
    <AnimatePresence>
      {isRequestAccessOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Request Access to Unreleased Archive"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeRequestAccess}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl bg-black border border-line-strong z-10 overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

            <div className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-hairline">
              <div className="flex items-center gap-2">
                <Lock size={13} className="text-gold" strokeWidth={1.5} />
                <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-gold">
                  Specimen Access — Archive Next
                </span>
              </div>
              <button
                onClick={closeRequestAccess}
                className="text-bone/60 hover:text-gold transition-colors"
                aria-label="Close"
              >
                <X size={18} strokeWidth={1.2} />
              </button>
            </div>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-16 px-6 sm:px-10 text-center space-y-4"
              >
                <div className="w-14 h-14 rounded-full border border-gold mx-auto flex items-center justify-center">
                  <Check size={22} className="text-gold" strokeWidth={1.2} />
                </div>
                <h3
                  className="text-4xl sm:text-5xl text-bone uppercase leading-[0.95]"
                  style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
                >
                  Access requested.
                </h3>
                <p className="font-editorial text-lg text-bone/60 max-w-md mx-auto">
                  The next release will arrive first. Your telemetry key has been recorded for unreleased allocations.
                </p>
                <button onClick={closeRequestAccess} className="btn-mono mt-6 mx-auto">
                  Return to archive
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="px-6 sm:px-10 py-8 space-y-8">
                <div className="space-y-3">
                  <h3
                    className="text-5xl sm:text-7xl text-bone uppercase leading-[0.92]"
                    style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic", letterSpacing: "0.005em" }}
                  >
                    Request<br />
                    <span style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic", fontSize: "0.6em" }}>
                      release access.
                    </span>
                  </h3>
                  <p className="font-editorial text-lg text-bone/60 leading-relaxed">
                    Receive private allocation access when the next piece opens. Protocol is restricted to enrolled clients.
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="folio">Client dispatch email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-transparent border-b border-bone/30 focus:border-gold py-3 font-body text-base text-bone placeholder:text-bone/30 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-3">
                  <div className="folio">Specimen of interest</div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Shirt', code: 'Release 002', state: shirtSelected, set: setShirtSelected },
                      { label: 'Headwear', code: 'Release 003', state: hatSelected, set: setHatSelected },
                    ].map((cat) => (
                      <button
                        type="button"
                        key={cat.label}
                        onClick={() => cat.set(!cat.state)}
                        className={`p-4 border text-left transition-colors ${
                          cat.state
                            ? 'border-gold bg-gold/5 text-bone'
                            : 'border-hairline text-bone/50 hover:border-bone/40'
                        }`}
                      >
                        <div
                          className="text-lg uppercase leading-none"
                          style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic", letterSpacing: "0.02em" }}
                        >
                          {cat.label}
                        </div>
                        <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-bone/40 mt-1">{cat.code}</div>
                        <div className={`mt-3 w-3 h-3 border ${cat.state ? 'border-gold bg-gold' : 'border-bone/30'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <button type="submit" className="btn-gold w-full justify-center">
                    Request access
                  </button>
                  <p className="font-mono text-[10px] text-bone/40 text-center tracking-[0.22em] uppercase">
                    Release communication only. Private enrollment.
                  </p>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
