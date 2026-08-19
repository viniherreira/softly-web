'use client';

import { useId, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/**
 * Slider nativo estilizado — mantém teclado, leitor de tela e toque de graça.
 * O preenchimento é um gradiente calculado por porcentagem no background.
 */
export function Range({
  label,
  valueLabel,
  className,
  min = 0,
  max = 100,
  value,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; valueLabel: string }) {
  const id = useId();
  const numeric = Number(value ?? 0);
  const percent = ((numeric - Number(min)) / (Number(max) - Number(min))) * 100;

  return (
    <div className={cn('w-full', className)}>
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="font-mono text-label uppercase text-muted">
          {label}
        </label>
        <span className="numeric font-mono text-body-sm text-brand-soft">{valueLabel}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        className="softly-range h-6 w-full cursor-pointer appearance-none bg-transparent"
        style={{ ['--range-percent' as string]: `${percent}%` }}
        {...props}
      />
    </div>
  );
}
