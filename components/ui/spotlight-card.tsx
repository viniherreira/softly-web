'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { useSpotlight } from '@/hooks/use-spotlight';
import { cn } from '@/lib/utils';

/**
 * Card padrão do site: superfície de vidro + spotlight que segue o mouse +
 * borda que ganha gradiente no hover + elevação de 6px.
 * Toda a movimentação é transform/opacity.
 */
export function SpotlightCard({
  children,
  className,
  as: Tag = 'div',
  lift = true,
  ...props
}: HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  as?: 'div' | 'article' | 'li' | 'section';
  lift?: boolean;
}) {
  const onMouseMove = useSpotlight();

  return (
    <Tag
      onMouseMove={onMouseMove}
      className={cn(
        'card-surface spotlight border-sheen group relative overflow-hidden rounded-card transition-transform duration-500 ease-expo will-change-transform',
        lift && 'hover:-translate-y-1.5',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
