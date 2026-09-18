'use client';

import { useEffect, useRef, useState } from 'react';
import { SectionHeading } from '@/components/section-heading';
import { useIsDesktop } from '@/hooks/use-media-query';
import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion';
import { processSteps } from '@/content/process';
import { cn } from '@/lib/utils';

/**
 * "Como trabalhamos" — pin + scrub horizontal.
 *
 * Desktop: a seção trava na tela (pin) e as 5 etapas avançam na horizontal
 * conforme o usuário rola. O comprimento do pin é calculado a partir da largura
 * real do trilho, então mudar o número de etapas não quebra nada.
 *
 * Mobile / reduced-motion: sem pin e sem scrub. Vira um carrossel horizontal
 * com scroll-snap nativo — mesma informação, custo de CPU quase zero.
 *
 * O TRILHO DE PROGRESSO VALE NOS DOIS. Antes ele só era alimentado pelo
 * ScrollTrigger: no celular a barra ficava parada em 20% e o contador em
 * "01 / 05" por mais que você arrastasse os cinco cards. Indicador que não
 * indica é pior que indicador nenhum — agora o celular lê o `scrollLeft` do
 * próprio carrossel e alimenta o mesmo estado.
 */
export function Process() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const [progress, setProgress] = useState(0);
  const isDesktop = useIsDesktop();
  const reduced = usePrefersReducedMotion();
  const pinned = isDesktop && !reduced;

  useEffect(() => {
    if (!pinned) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    void (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth + 96);

      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getDistance() + window.innerHeight * 0.5}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => setProgress(self.progress),
        },
      });

      cleanup = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(track, { clearProps: 'transform' });
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [pinned]);

  const activeIndex = Math.min(
    processSteps.length - 1,
    Math.floor(progress * processSteps.length + 0.001),
  );

  return (
    <section
      id="processo"
      aria-labelledby="processo-titulo"
      ref={sectionRef}
      className={cn('relative overflow-hidden', pinned ? 'h-screen' : 'section-y')}
    >
      <div className={cn('shell', pinned && 'flex h-full flex-col justify-center py-20')}>
        <SectionHeading
          index="02"
          eyebrow="Como trabalhamos"
          titleId="processo-titulo"
          size={pinned ? 'compact' : 'default'}
          title="Cinco etapas, sem etapa surpresa."
          description={
            pinned
              ? 'Role para percorrer o método. Cada etapa tem prazo estimado e entrega definida.'
              : 'Arraste para o lado para percorrer o método. Cada etapa tem prazo estimado e entrega definida.'
          }
        />

        {/* Trilho de progresso */}
        <div className={cn('flex items-center gap-4', pinned ? 'mt-7' : 'mt-10')} aria-hidden="true">
          <div className="h-px flex-1 bg-line">
            <div
              className="h-px origin-left bg-gradient-to-r from-brand to-accent transition-transform duration-150 ease-linear"
              style={{ transform: `scaleX(${Math.max(progress, 0.02)})` }}
            />
          </div>
          <span className="font-mono text-label uppercase text-muted">
            {String(activeIndex + 1).padStart(2, '0')} / {String(processSteps.length).padStart(2, '0')}
          </span>
        </div>

        <div
          className={cn(
            pinned
              ? 'mt-7 overflow-visible'
              : 'mt-10 no-scrollbar -mx-gutter overflow-x-auto scroll-px-gutter px-gutter',
          )}
          onScroll={
            pinned
              ? undefined
              : (event) => {
                  const node = event.currentTarget;
                  const span = node.scrollWidth - node.clientWidth;
                  setProgress(span > 0 ? node.scrollLeft / span : 0);
                }
          }
        >
          <ol
            ref={trackRef}
            className={cn(
              'flex gap-5 will-change-transform',
              pinned ? 'w-max' : 'w-max snap-x snap-mandatory',
            )}
          >
            {processSteps.map((step, index) => {
              const isActive = index === activeIndex;
              return (
                <li
                  key={step.number}
                  className={cn(
                    'card-surface relative flex w-[82vw] shrink-0 snap-start flex-col rounded-bento p-6 transition-[transform,border-color,box-shadow] duration-500 ease-expo sm:w-[23rem] lg:w-[25rem] lg:p-7',
                    isActive ? 'border-brand/50 shadow-glow' : 'border-line/60',
                    /* O card ativo só sobe no desktop: no carrossel o
                       `overflow-x` também recorta no eixo Y, e subir 8px
                       criaria uma barra de rolagem vertical dentro da faixa. */
                    isActive && pinned && '-translate-y-2',
                  )}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span
                      className={cn(
                        'font-mono text-[2.25rem] font-medium leading-none transition-colors duration-500 ease-expo',
                        isActive ? 'text-brand-soft' : 'text-line',
                      )}
                    >
                      {step.number}
                    </span>
                    <span className="rounded-pill border border-line bg-surface/60 px-3 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted">
                      {step.duration}
                    </span>
                  </div>

                  <h3 className="mt-5 text-display-md text-title">{step.title}</h3>
                  <p className="mt-2.5 text-body-sm text-body">{step.description}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
