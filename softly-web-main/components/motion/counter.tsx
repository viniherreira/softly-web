'use client';

import { animate, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion';
import { EASE_EXPO } from '@/lib/motion';
import { formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';

/**
 * Contador que sobe de 0 até o valor quando entra na viewport.
 * O número é escrito direto no nó (textContent) para não re-renderizar o React
 * 60 vezes por segundo. Com reduced-motion, aparece já no valor final.
 */
export function Counter({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1.6,
  className,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = usePrefersReducedMotion();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!inView || done) return;
    const node = ref.current;
    if (!node) return;

    if (reduced) {
      node.textContent = formatNumber(value, decimals);
      setDone(true);
      return;
    }

    const controls = animate(0, value, {
      duration,
      ease: EASE_EXPO,
      onUpdate: (latest) => {
        node.textContent = formatNumber(latest, decimals);
      },
      onComplete: () => setDone(true),
    });

    return () => controls.stop();
  }, [inView, value, decimals, duration, reduced, done]);

  return (
    <span className={cn('numeric tabular-nums', className)}>
      {prefix}
      <span ref={ref}>{formatNumber(0, decimals)}</span>
      {suffix}
    </span>
  );
}
