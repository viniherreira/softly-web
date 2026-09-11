'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { useIsDesktop } from '@/hooks/use-media-query';
import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion';
import { cn } from '@/lib/utils';

/**
 * Parallax por scrub do ScrollTrigger (GSAP), carregado sob demanda.
 * `speed` é a fração da altura da viewport que a camada percorre:
 *  0.2 = fundo lento, -0.15 = elemento que "sobe" contra o scroll.
 * Só roda em desktop com ponteiro fino e sem prefers-reduced-motion.
 */
export function Parallax({
  children,
  speed = 0.15,
  className,
  scale = false,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
  /** Adiciona um leve zoom junto ao deslocamento (bom para imagem de fundo). */
  scale?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || !isDesktop || reduced) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    void (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const distance = window.innerHeight * speed;
      const tween = gsap.fromTo(
        node,
        { yPercent: 0, ...(scale ? { scale: 1 } : {}) },
        {
          y: distance,
          ...(scale ? { scale: 1.08 } : {}),
          ease: 'none',
          scrollTrigger: {
            trigger: node,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );

      cleanup = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(node, { clearProps: 'transform' });
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [isDesktop, reduced, speed, scale]);

  return (
    <div ref={ref} className={cn('will-change-transform', className)}>
      {children}
    </div>
  );
}
