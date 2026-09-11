'use client';

import { useRef, type ReactNode } from 'react';
import { useIsDesktop } from '@/hooks/use-media-query';
import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion';
import { cn } from '@/lib/utils';

/**
 * Efeito magnético: o elemento acompanha levemente o cursor dentro da própria
 * área. Escrito direto no transform, sem estado React.
 */
export function Magnetic({
  children,
  strength = 0.28,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();
  const reduced = usePrefersReducedMotion();
  const enabled = isDesktop && !reduced;

  return (
    <div
      ref={ref}
      className={cn('inline-block transition-transform duration-500 ease-expo will-change-transform', className)}
      onPointerMove={(event) => {
        if (!enabled || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = (event.clientX - (rect.left + rect.width / 2)) * strength;
        const y = (event.clientY - (rect.top + rect.height / 2)) * strength;
        ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }}
      onPointerLeave={() => {
        if (!ref.current) return;
        ref.current.style.transform = 'translate3d(0, 0, 0)';
      }}
    >
      {children}
    </div>
  );
}
