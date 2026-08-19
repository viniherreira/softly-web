'use client';

import { Counter } from '@/components/motion/counter';
import { RevealGroup, RevealItem } from '@/components/motion/reveal';
import { resultStats } from '@/content/stats';

/**
 * Faixa de resultados. Os quatro números sobem de zero ao entrar na viewport.
 * Fundo com halo próprio para a faixa "acender" no meio da página.
 */
export function Stats() {
  return (
    <section aria-labelledby="numeros-titulo" className="relative isolate overflow-hidden py-20 lg:py-24">
      <div className="divider-glow absolute inset-x-0 top-0" />
      <div className="divider-glow absolute inset-x-0 bottom-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-[28rem] -translate-y-1/2"
        style={{
          background:
            'radial-gradient(60% 100% at 50% 50%, rgb(var(--glow) / 0.14), transparent 70%)',
        }}
      />
      <div className="dot-layer -z-10" />

      <div className="shell">
        <h2 id="numeros-titulo" className="sr-only">
          Números da Softly
        </h2>

        <RevealGroup className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
          {resultStats.map((stat) => (
            <RevealItem key={stat.id}>
              <div className="flex flex-col">
                <span className="font-display text-[clamp(2.6rem,4.6vw,3.6rem)] font-bold leading-none tracking-[-0.04em] text-title">
                  <Counter
                    value={stat.value}
                    decimals={stat.decimals ?? 0}
                    prefix={stat.prefix ?? ''}
                    suffix={stat.suffix ?? ''}
                  />
                </span>
                <span className="mt-4 font-mono text-label uppercase text-brand-soft">
                  {stat.label}
                </span>
                <span className="mt-2.5 text-body-sm text-muted">{stat.description}</span>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
