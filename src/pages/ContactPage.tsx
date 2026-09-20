import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Check, Mail, Send, Instagram } from 'lucide-react';
import { ISSUE } from '../data/magazine';

/**
 * CONTACT — /contact
 * Editorial contact page.
 * Two forms: dispatch (email subscription for future releases) + studio inquiries.
 */

const ContactPage: React.FC = () => {
  // Dispatch state
  const [dispatchEmail, setDispatchEmail] = useState('');
  const [dispatchSent, setDispatchSent] = useState(false);

  // Studio form state
  const [studioName, setStudioName] = useState('');
  const [studioEmail, setStudioEmail] = useState('');
  const [studioSubject, setStudioSubject] = useState<'general' | 'press' | 'wholesale' | 'archive'>('general');
  const [studioMessage, setStudioMessage] = useState('');
  const [studioSent, setStudioSent] = useState(false);

  const handleDispatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchEmail.includes('@')) return;
    setDispatchSent(true);
    setDispatchEmail('');
    setTimeout(() => setDispatchSent(false), 4000);
  };

  const handleStudioSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studioName.trim() || !studioEmail.includes('@') || !studioMessage.trim()) return;

    // Open mail client with prefilled body
    const subjectMap = {
      general: 'General Inquiry',
      press: 'Press Request',
      wholesale: 'Wholesale / Stockist',
      archive: 'Archive Access',
    };
    const subject = `[${subjectMap[studioSubject]}] Lawrence Monroe — ${studioName}`;
    const body = `Hi Lawrence Monroe team,%0A%0A${encodeURIComponent(
      studioMessage
    )}%0A%0A— ${encodeURIComponent(studioName)}%0A${encodeURIComponent(studioEmail)}`;
    window.location.href = `mailto:studio@lawrencemonroe.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    setStudioSent(true);
    setStudioName('');
    setStudioEmail('');
    setStudioMessage('');
    setTimeout(() => setStudioSent(false), 4000);
  };

  return (
    <div className="relative bg-black text-bone pt-24 sm:pt-32 pb-24 min-h-screen grain">
      <div className="max-w-[1760px] mx-auto px-5 sm:px-8 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 pb-12 sm:pb-20 border-b border-hairline"
        >
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-4">
              <span className="font-folio text-gold">Page 06 — Contact</span>
              <span className="text-bone/20">—</span>
              <span className="font-folio text-bone/50">{ISSUE.date}</span>
            </div>
            <h1
              className="text-[16vw] sm:text-[11vw] lg:text-[9vw] leading-[0.82] tracking-tight text-bone"
              style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
            >
              Get in{' '}
              <span className="text-gold-metallic">touch.</span>
            </h1>
            <p
              className="text-xl sm:text-2xl text-bone/70 max-w-xl leading-snug"
              style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
            >
              Dispatch updates for future releases — or direct inquiries to the studio.
            </p>
          </div>

          <div className="lg:col-span-4 space-y-6 lg:pt-6">
            <div className="border border-hairline px-4 py-3 flex items-center gap-2 w-fit">
              <span className="gold-dot" />
              <span className="font-folio text-bone/70">Replies in 48 hrs</span>
            </div>
            <div className="space-y-2 text-sm text-bone/55 leading-relaxed">
              <a
                href="https://instagram.com/lawrencemonroe"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-gold transition-colors"
              >
                <Instagram size={13} strokeWidth={1.4} /> @lawrencemonroe
              </a>
              <div className="font-folio">studio@lawrencemonroe.com</div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 py-16 sm:py-24">
          {/* ─── DISPATCH FORM ─── */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9 }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="gold-bar w-10" />
                <span className="font-folio text-gold">Form I</span>
              </div>
              <h2
                className="text-4xl sm:text-5xl lg:text-6xl text-bone leading-[0.92] tracking-tight"
                style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
              >
                Private dispatch.
              </h2>
              <p
                className="text-base sm:text-lg text-bone/65 leading-relaxed max-w-md"
                style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
              >
                Direct telemetry on allocations, archival drops, and unreleased prototype openings. Zero noise.
              </p>
            </div>

            <form onSubmit={handleDispatchSubmit} className="space-y-5 max-w-md">
              <label className="block space-y-2">
                <span className="font-folio text-bone/55">Email address</span>
                <div className="flex items-center border-b border-hairline-strong focus-within:border-gold transition-colors py-3">
                  <Mail size={14} className="text-bone/40 mr-3 shrink-0" strokeWidth={1.4} />
                  <input
                    type="email"
                    value={dispatchEmail}
                    onChange={(e) => setDispatchEmail(e.target.value)}
                    placeholder="you@studio.com"
                    required
                    className="w-full bg-transparent font-body text-base text-bone placeholder:text-bone/25 focus:outline-none"
                    aria-label="Email address for dispatch"
                  />
                </div>
              </label>

              <button
                type="submit"
                className="btn-gold w-full sm:w-auto"
                data-cursor="view"
                data-cursor-label={dispatchSent ? 'Logged' : 'Subscribe'}
              >
                {dispatchSent ? (
                  <>
                    <Check size={13} /> Logged
                  </>
                ) : (
                  <>
                    Subscribe to dispatch <ArrowUpRight size={13} />
                  </>
                )}
              </button>

              {dispatchSent && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-folio text-gold"
                >
                  Confirmed — you are enrolled in the private dispatch.
                </motion.p>
              )}
            </form>
          </motion.section>

          {/* ─── STUDIO FORM ─── */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="gold-bar w-10" />
                <span className="font-folio text-gold">Form II</span>
              </div>
              <h2
                className="text-4xl sm:text-5xl lg:text-6xl text-bone leading-[0.92] tracking-tight"
                style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
              >
                Studio inquiry.
              </h2>
              <p
                className="text-base sm:text-lg text-bone/65 leading-relaxed max-w-md"
                style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
              >
                Press, wholesale, archive access, or anything else — opens your mail client with a prefilled draft.
              </p>
            </div>

            <form onSubmit={handleStudioSubmit} className="space-y-5 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <label className="block space-y-2">
                  <span className="font-folio text-bone/55">Name</span>
                  <div className="border-b border-hairline-strong focus-within:border-gold transition-colors py-3">
                    <input
                      type="text"
                      value={studioName}
                      onChange={(e) => setStudioName(e.target.value)}
                      placeholder="Your name"
                      required
                      className="w-full bg-transparent font-body text-base text-bone placeholder:text-bone/25 focus:outline-none"
                    />
                  </div>
                </label>

                <label className="block space-y-2">
                  <span className="font-folio text-bone/55">Email</span>
                  <div className="border-b border-hairline-strong focus-within:border-gold transition-colors py-3">
                    <input
                      type="email"
                      value={studioEmail}
                      onChange={(e) => setStudioEmail(e.target.value)}
                      placeholder="you@studio.com"
                      required
                      className="w-full bg-transparent font-body text-base text-bone placeholder:text-bone/25 focus:outline-none"
                    />
                  </div>
                </label>
              </div>

              <label className="block space-y-2">
                <span className="font-folio text-bone/55">Inquiry type</span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(['general', 'press', 'wholesale', 'archive'] as const).map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setStudioSubject(id)}
                      aria-pressed={studioSubject === id}
                      className={`chip ${studioSubject === id ? 'is-active' : ''}`}
                    >
                      {id.charAt(0).toUpperCase() + id.slice(1)}
                    </button>
                  ))}
                </div>
              </label>

              <label className="block space-y-2">
                <span className="font-folio text-bone/55">Message</span>
                <div className="border border-hairline-strong focus-within:border-gold transition-colors p-3">
                  <textarea
                    value={studioMessage}
                    onChange={(e) => setStudioMessage(e.target.value)}
                    placeholder="Tell us a little about what you're looking for."
                    rows={5}
                    required
                    className="w-full bg-transparent font-body text-base text-bone placeholder:text-bone/25 focus:outline-none resize-none"
                  />
                </div>
              </label>

              <button
                type="submit"
                className="btn-glass w-full sm:w-auto"
                data-cursor="view"
                data-cursor-label={studioSent ? 'Opened' : 'Send'}
              >
                {studioSent ? (
                  <>
                    <Check size={13} /> Mail client opened
                  </>
                ) : (
                  <>
                    <Send size={13} /> Send inquiry
                  </>
                )}
              </button>

              {studioSent && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-folio text-gold"
                >
                  Your mail client should have opened — complete and send.
                </motion.p>
              )}
            </form>
          </motion.section>
        </div>

        {/* Footer block */}
        <div className="border-t border-hairline pt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 font-folio text-bone/45">
          <div>
            <div className="text-bone/30 mb-1">Studio</div>
            <div>Direction — LM</div>
            <div>Design — The Studio</div>
            <div>Photography — 35mm Archive</div>
          </div>
          <div>
            <div className="text-bone/30 mb-1">Commerce</div>
            <div>Square Checkout</div>
            <div>14-day returns</div>
            <div>Carbon-neutral courier</div>
          </div>
          <div>
            <div className="text-bone/30 mb-1">Identity</div>
            <div>PP Editorial New</div>
            <div>Inter Tight</div>
            <div>Set for Issue {ISSUE.number}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ContactPage };
export default ContactPage;

