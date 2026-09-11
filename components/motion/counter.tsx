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
  suffixClassName,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  /**
   * Estilo da unidade ("%", "/100", " semanas"). Existe porque em número
   * grande a unidade no mesmo corpo do valor rouba a leitura e ainda força
   * quebra de linha — "5,2 sem" virava duas linhas na faixa de resultados.
   * Unidade menor que o valor é como se lê medida em qualquer instrumento.
   */
  suffixClassName?: string;
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
    <span className={cn('numeric whitespace-nowrap tabular-nums', className)}>
      {prefix}
      <span ref={ref}>{formatNumber(0, decimals)}</span>
      {suffix ? <span className={suffixClassName}>{suffix}</span> : null}
    </span>
  );
}
