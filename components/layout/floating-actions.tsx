'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArrowUp, Whatsapp } from '@/components/icons/ui-icons';
import { useSmoothScroll } from '@/components/motion/smooth-scroll';
import { useScrollProgress } from '@/hooks/use-scroll-progress';
import { site, whatsappUrl } from '@/content/site';
import { track } from '@/lib/analytics';
import { EASE_EXPO } from '@/lib/motion';

const RING_RADIUS = 20;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

/**
 * Ações flutuantes:
 * - WhatsApp entra depois de 30% de scroll, com tooltip que abre no hover.
 * - "Voltar ao topo" traz um anel que preenche conforme o progresso da leitura.
 */
export function FloatingActions() {
  const progress = useScrollProgress();
  const { scrollTo } = useSmoothScroll();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(progress > 0.3);
  }, [progress]);

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[110] flex flex-col items-end gap-3 sm:bottom-8 sm:right-8">
      <AnimatePresence>
        {visible ? (
          <motion.button
            key="top"
            type="button"
            onClick={() => scrollTo(0)}
            initial={{ opacity: 0, scale: 0.7, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: EASE_EXPO } }}
            exit={{ opacity: 0, scale: 0.7, y: 12, transition: { duration: 0.25, ease: EASE_EXPO } }}
            className="glass pointer-events-auto relative grid h-12 w-12 place-items-center rounded-pill text-title transition-transform duration-300 ease-expo hover:-translate-y-1"
            aria-label="Voltar ao topo"
          >
            <ArrowUp className="h-4 w-4" />
            <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
              <circle
                cx="24"
                cy="24"
                r={RING_RADIUS}
                fill="none"
                stroke="rgb(var(--brand))"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={RING_LENGTH}
                strokeDashoffset={RING_LENGTH * (1 - progress)}
                style={{ transition: 'stroke-dashoffset 120ms linear' }}
              />
            </svg>
          </motion.button>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {visible ? (
          <motion.a
            key="whatsapp"
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('whatsapp_click', { location: 'floating' })}
            initial={{ opacity: 0, scale: 0.6, y: 16 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: { duration: 0.6, ease: EASE_EXPO, delay: 0.06 },
            }}
            exit={{ opacity: 0, scale: 0.6, y: 16, transition: { duration: 0.25, ease: EASE_EXPO } }}
            className="group pointer-events-auto relative flex h-14 items-center gap-3 rounded-pill bg-brand pl-4 pr-4 text-white shadow-[0_16px_40px_-14px_rgb(var(--glow)/0.9)] transition-all duration-500 ease-expo hover:pr-5"
            aria-label={`Falar no WhatsApp: ${site.contact.whatsappLabel}`}
          >
            <span className="absolute inset-0 -z-10 animate-pulse-ring rounded-pill bg-brand/40" aria-hidden="true" />
            <Whatsapp className="h-6 w-6 shrink-0" />
            <span className="max-w-0 overflow-hidden whitespace-nowrap text-body-sm font-medium opacity-0 transition-all duration-500 ease-expo group-hover:max-w-[12rem] group-hover:opacity-100">
              Falar agora no WhatsApp
            </span>
          </motion.a>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
