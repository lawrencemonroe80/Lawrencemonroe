import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface AccordionItem {
  id: string;
  title: string;
  content: string | string[];
}

interface ProductAccordionProps {
  items: AccordionItem[];
}

export const ProductAccordion: React.FC<ProductAccordionProps> = ({ items }) => {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id || null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="border-t border-hairline">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className="border-b border-hairline">
            <button
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between text-left py-4 group"
              aria-expanded={isOpen}
            >
              <span className="folio text-bone group-hover:text-gold transition-colors">
                {item.title}
              </span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="text-bone/50 group-hover:text-gold transition-colors"
              >
                <ChevronDown size={16} strokeWidth={1.2} />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pb-5 text-sm text-bone/65 space-y-2 leading-relaxed">
                    {Array.isArray(item.content) ? (
                      <ul className="space-y-2">
                        {item.content.map((line, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="text-gold mt-2 w-2 h-px bg-gold shrink-0" />
                            <span
                              className="text-bone/75"
                              style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
                            >
                              {line}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p
                        className="text-bone/80"
                        style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
                      >
                        {item.content}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
