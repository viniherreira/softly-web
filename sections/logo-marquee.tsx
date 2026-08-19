'use client';

import { Marquee } from '@/components/motion/marquee';
import { clientItems, stackItems } from '@/content/stack';

/**
 * Faixa dupla: clientes acima, stack abaixo (direção oposta).
 * Monocromático por padrão; ganha cor no hover, item a item.
 * TODO: substituir por logos reais em /public/images/logos (SVG monocromático).
 */
export function LogoMarquee() {
  return (
    <section aria-label="Clientes e tecnologias" className="relative border-y border-line/60 py-10">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-surface/25 to-transparent" />

      <Marquee baseVelocity={26} direction={1} itemClassName="gap-14 pr-14">
        {clientItems.map((item) => (
          <span
            key={item.name}
            className="group flex shrink-0 items-center gap-3 font-display text-[1.35rem] font-medium tracking-[-0.02em] text-muted transition-colors duration-300 ease-expo hover:text-title"
          >
            <span className="h-1.5 w-1.5 rounded-pill bg-line transition-colors duration-300 ease-expo group-hover:bg-accent" />
            {item.name}
          </span>
        ))}
      </Marquee>

      <div className="mt-8" />

      <Marquee baseVelocity={18} direction={-1} itemClassName="gap-10 pr-10">
        {stackItems.map((item) => (
          <span
            key={item.name}
            className="flex shrink-0 items-center gap-2.5 rounded-pill border border-line/70 bg-surface/40 px-4 py-2 font-mono text-body-sm text-muted transition-colors duration-300 ease-expo hover:border-brand/50 hover:text-brand-soft"
          >
            {item.name}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
