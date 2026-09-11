'use client';

import { useEffect, useRef, useState } from 'react';
import { useIsDesktop } from '@/hooks/use-media-query';
import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion';
import { cn } from '@/lib/utils';

/**
 * Cursor customizado: ponto sólido + halo com blend mode.
 *
 * - O halo persegue o ponto com lerp (rastro suave).
 * - Cresce sobre qualquer elemento interativo.
 * - Mostra rótulo contextual via `data-cursor="ver projeto"` no elemento.
 * - Posição escrita direto em `transform` (sem estado React por frame).
 * - Desligado em toque, telas < 1024px e prefers-reduced-motion.
 */
export function CustomCursor() {
  const isDesktop = useIsDesktop();
  const reduced = usePrefersReducedMotion();
  const dotRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string>('');
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);

  const enabled = isDesktop && !reduced;

  useEffect(() => {
    if (!enabled) {
      document.documentElement.removeAttribute('data-cursor');
      return;
    }
    document.documentElement.setAttribute('data-cursor', 'custom');

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const halo = { ...target };
    let frame = 0;

    const onMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      if (!visible) setVisible(true);

      const interactive = (event.target as HTMLElement | null)?.closest(
        'a, button, [role="button"], input, textarea, select, [data-cursor]',
      );
      const nextLabel =
        interactive instanceof HTMLElement ? (interactive.dataset.cursor ?? '') : '';
      setActive(Boolean(interactive));
      setLabel((current) => (current === nextLabel ? current : nextLabel));
    };

    const onLeave = () => setVisible(false);

    const render = () => {
      halo.x += (target.x - halo.x) * 0.16;
      halo.y += (target.y - halo.y) * 0.16;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      }
      if (haloRef.current) {
        haloRef.current.style.transform = `translate3d(${halo.x}px, ${halo.y}px, 0) translate(-50%, -50%)`;
      }
      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      document.documentElement.removeAttribute('data-cursor');
    };
  }, [enabled, visible]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className={cn('pointer-events-none fixed inset-0 z-[120]', !visible && 'opacity-0')}>
      <div
        ref={haloRef}
        className={cn(
          'fixed left-0 top-0 flex items-center justify-center rounded-pill border border-brand-soft/60 bg-brand/10 backdrop-blur-[2px] transition-[width,height,background-color,border-color] duration-300 ease-expo',
          active ? 'h-16 w-16 border-brand/70 bg-brand/20' : 'h-9 w-9',
          label && 'h-auto w-auto rounded-pill border-brand bg-brand px-4 py-2',
        )}
      >
        {label ? (
          <span className="whitespace-nowrap font-mono text-[0.625rem] uppercase tracking-[0.16em] text-white">
            {label}
          </span>
        ) : null}
      </div>
      <div
        ref={dotRef}
        className={cn(
          'fixed left-0 top-0 h-1.5 w-1.5 rounded-pill bg-white mix-blend-difference transition-opacity duration-200',
          label && 'opacity-0',
        )}
      />
    </div>
  );
}
