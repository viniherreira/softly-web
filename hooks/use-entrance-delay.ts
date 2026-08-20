'use client';

import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion';

/**
 * Quanto o hero deve esperar antes de entrar.
 * No primeiro load da sessão a intro cinematográfica ocupa ~3,95s — a entrada
 * orquestrada começa junto com a cortina, para o hero já estar em movimento
 * quando o site é revelado. Em navegação interna (ou com reduced-motion) o
 * atraso é zero.
 */
export function useEntranceDelay(): number {
  const reduced = usePrefersReducedMotion();
  const [delay, setDelay] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (reduced) {
      setDelay(0);
      setReady(true);
      return;
    }
    const alreadyLoaded = window.sessionStorage.getItem('softly:preloaded');
    setDelay(alreadyLoaded ? 0 : 3.8);
    setReady(true);
  }, [reduced]);

  return ready ? delay : 0;
}
