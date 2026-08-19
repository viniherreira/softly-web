'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Media query reativa e SSR-safe.
 *
 * Usa useSyncExternalStore em vez de useState+useEffect de propósito: o valor
 * correto passa a valer já na primeira renderização do cliente, logo depois da
 * hidratação. Com a versão antiga (que começava sempre em `false`), o preloader
 * chegava a iniciar antes de saber que o usuário pedia menos movimento.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** ≥1024px E ponteiro fino: onde cursor custom, pin/scrub e parallax rodam. */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px) and (pointer: fine)');
}

export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)');
}
