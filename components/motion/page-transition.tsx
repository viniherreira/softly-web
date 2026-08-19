'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion';
import { EASE_EXPO } from '@/lib/motion';

/** Transição entre rotas: fade + deslize sutil, sempre abaixo de 400ms. */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
        animate={
          reduced
            ? { opacity: 1, transition: { duration: 0.15 } }
            : { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE_EXPO } }
        }
        exit={
          reduced
            ? { opacity: 0, transition: { duration: 0.15 } }
            : { opacity: 0, y: -6, transition: { duration: 0.22, ease: EASE_EXPO } }
        }
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
