'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { useSpotlight } from '@/hooks/use-spotlight';
import { cn } from '@/lib/utils';

/**
 * Card padrão do site: superfície de vidro + spotlight que segue o mouse +
 * borda que ganha gradiente no hover + elevação.
 *
 * `level` é o peso do card na página, não um enfeite: 1 é o card comum, 2 é
 * o card que precisa ser lido antes dos vizinhos, 3 é peça única na tela.
 * No hover o card sobe um nível de sombra junto com o deslocamento — sem
 * isso o card "flutua" sem projetar nada e o gesto lê como escorregão.
 */
const LEVEL = {
  1: { surface: 'card-surface', rest: 'shadow-e1', hover: 'hover:shadow-e2' },
  2: { surface: 'surface-2', rest: 'shadow-e2', hover: 'hover:shadow-e3' },
  3: { surface: 'surface-3', rest: 'shadow-e3', hover: 'hover:shadow-glow-lg' },
} as const;

export function SpotlightCard({
  children,
  className,
  as: Tag = 'div',
  lift = true,
  level = 1,
  ...props
}: HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  as?: 'div' | 'article' | 'li' | 'section';
  lift?: boolean;
  level?: 1 | 2 | 3;
}) {
  const onMouseMove = useSpotlight();
  const tone = LEVEL[level];

  return (
    <Tag
      onMouseMove={onMouseMove}
      className={cn(
        'spotlight border-sheen group relative overflow-hidden rounded-card transition-[transform,box-shadow] duration-500 ease-expo will-change-transform',
        tone.surface,
        tone.rest,
        lift && ['hover:-translate-y-1.5', tone.hover],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
