'use client';

import { animate, useMotionValue } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion';
import { EASE_EXPO } from '@/lib/motion';
import { formatCurrencyValue, formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';

/**
 * Número que "rola" de um valor para outro sempre que o valor muda.
 * Diferente de <Counter>, que só sobe de zero ao entrar na viewport.
 * Escreve direto no nó — nenhum re-render do React durante a animação.
 */
export function AnimatedNumber({
  value,
  format = 'currency',
  decimals = 0,
  className,
  duration = 0.6,
}: {
  value: number;
  format?: 'currency' | 'number';
  decimals?: number;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(value);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const write = (latest: number) => {
      node.textContent =
        format === 'currency' ? formatCurrencyValue(latest) : formatNumber(latest, decimals);
    };

    if (reduced) {
      motionValue.set(value);
      write(value);
      return;
    }

    const controls = animate(motionValue, value, {
      duration,
      ease: EASE_EXPO,
      onUpdate: write,
    });
    return () => controls.stop();
  }, [value, format, decimals, duration, motionValue, reduced]);

  return (
    <span ref={ref} className={cn('numeric tabular-nums', className)}>
      {format === 'currency' ? formatCurrencyValue(value) : formatNumber(value, decimals)}
    </span>
  );
}
