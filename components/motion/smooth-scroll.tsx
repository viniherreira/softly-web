'use client';

import Lenis from 'lenis';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion';

type ScrollApi = {
  scrollTo: (target: string | number | HTMLElement, options?: { offset?: number }) => void;
  stop: () => void;
  start: () => void;
};

const ScrollContext = createContext<ScrollApi | null>(null);

/** API de scroll do site — cai para window.scrollTo quando Lenis está desligado. */
export function useSmoothScroll(): ScrollApi {
  const context = useContext(ScrollContext);
  return (
    context ?? {
      scrollTo: (target, options) => {
        if (typeof window === 'undefined') return;
        const offset = options?.offset ?? 0;
        if (typeof target === 'number') {
          window.scrollTo({ top: target + offset, behavior: 'smooth' });
          return;
        }
        const node = typeof target === 'string' ? document.querySelector(target) : target;
        if (!node) return;
        const top = node.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: 'smooth' });
      },
      stop: () => {},
      start: () => {},
    }
  );
}

/**
 * Smooth scroll com Lenis + sincronia com o ScrollTrigger do GSAP.
 *
 * O GSAP é carregado dinamicamente aqui para não entrar no bundle inicial —
 * quem não rola até a seção com pin nunca baixa a biblioteca.
 * Desligado por completo em prefers-reduced-motion.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);
  const [api, setApi] = useState<ScrollApi | null>(null);

  useEffect(() => {
    if (reduced) {
      lenisRef.current?.destroy();
      lenisRef.current = null;
      setApi(null);
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
    });
    lenisRef.current = lenis;

    let cancelled = false;
    let detachGsap: (() => void) | undefined;

    void (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const onScroll = () => ScrollTrigger.update();
      lenis.on('scroll', onScroll);

      const ticker = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);

      detachGsap = () => {
        lenis.off('scroll', onScroll);
        gsap.ticker.remove(ticker);
      };
    })();

    // Fallback de rAF enquanto o GSAP ainda não carregou.
    let frame = requestAnimationFrame(function raf(time) {
      if (!detachGsap) lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });

    setApi({
      scrollTo: (target, options) =>
        lenis.scrollTo(target, { offset: options?.offset ?? 0, duration: 1.1 }),
      stop: () => lenis.stop(),
      start: () => lenis.start(),
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      detachGsap?.();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  // Âncoras internas passam pelo Lenis, com folga para o header fixo.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.('a[href*="#"]');
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.pathname !== window.location.pathname || !url.hash || url.hash === '#') return;

      const target = document.querySelector(url.hash);
      if (!target) return;

      event.preventDefault();
      const offset = -(
        Number.parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--header-h'),
          10,
        ) || 76
      ) - 16;

      if (api) api.scrollTo(target as HTMLElement, { offset });
      else {
        const top = target.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
      }
      window.history.replaceState(null, '', url.hash);
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [api, reduced]);

  return <ScrollContext.Provider value={api}>{children}</ScrollContext.Provider>;
}
