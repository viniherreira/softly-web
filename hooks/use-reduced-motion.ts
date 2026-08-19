'use client';

import { useMediaQuery } from '@/hooks/use-media-query';

/**
 * Fonte única de verdade para prefers-reduced-motion.
 * Quando true: sem preloader, sem parallax, sem scrub, sem cursor custom,
 * sem revelação por caractere — apenas fades de 150ms.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
