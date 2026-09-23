'use client';

import { Marquee } from '@/components/motion/marquee';
import { projects } from '@/content/projects';

/**
 * Faixa única com os projetos que estão no ar.
 *
 * Eram duas faixas em direções opostas — clientes em cima, stack embaixo em
 * pílulas com borda. Ficou uma só, por dois motivos:
 *
 * 1. Poluição. Duas esteiras correndo em sentidos contrários, a de baixo com
 *    doze pílulas contornadas, era o elemento mais barulhento da página.
 * 2. A stack já aparece, por projeto, em cada card do portfólio. A faixa
 *    repetia a informação fora de contexto.
 *
 * A lista vem de content/projects.ts de propósito: era `clientItems` em
 * content/stack.ts, com nomes de exemplo que sobreviveram à troca pelos
 * projetos reais e ficaram mentindo na home. Agora não tem como divergir.
 */
export function LogoMarquee() {
  return (
    <section aria-label="Projetos no ar" className="relative border-y border-line/60 py-9">
      <Marquee baseVelocity={22} direction={1} itemClassName="gap-14 pr-14">
        {projects.map((project) => (
          <span
            key={project.slug}
            className="group flex shrink-0 items-center gap-3 font-display text-[1.35rem] font-medium tracking-[-0.02em] text-muted transition-colors duration-300 ease-expo hover:text-title"
          >
            <span className="h-1.5 w-1.5 rounded-pill bg-line transition-colors duration-300 ease-expo group-hover:bg-accent" />
            {project.client}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
