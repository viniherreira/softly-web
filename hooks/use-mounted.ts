'use client';

import { useEffect, useState } from 'react';

/** Evita mismatch de hidratação em nós que dependem de window/localStorage. */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
