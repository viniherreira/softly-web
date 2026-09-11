'use client';

import { useCallback, type MouseEvent } from 'react';

/**
 * Spotlight que segue o mouse dentro de um card.
 * Escreve --mx/--my no próprio nó (nenhum re-render do React, nenhum layout).
 * O gradiente em si mora na classe `.spotlight` de globals.css.
 */
export function useSpotlight() {
  return useCallback((event: MouseEvent<HTMLElement>) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    target.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    target.style.setProperty('--my', `${event.clientY - rect.top}px`);
  }, []);
}
