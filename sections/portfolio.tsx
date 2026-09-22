'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowUpRight } from '@/components/icons/ui-icons';
import { Reveal } from '@/components/motion/reveal';
import { ProjectFrame } from '@/components/project-frame';
import { SectionHeading } from '@/components/section-heading';
import { Button } from '@/components/ui/button';
import { projectCategories, projects, type Project } from '@/content/projects';
import { track } from '@/lib/analytics';
import { EASE_EXPO } from '@/lib/motion';
import { cn } from '@/lib/utils';

/**
 * Portfólio com filtro por categoria.
 * A troca usa `layout` do Framer Motion: os cards se reposicionam com FLIP
 * (transform puro), sem repintar a página.
 *
 * As larguras vêm da quantidade visível, não do projeto: contagem ímpar abre
 * com um card de 12 colunas e o resto segue em pares 7/5 · 5/7. Assim a grade
 * continua assimétrica e nenhuma linha fica pela metade em qualquer filtro —
 * inclusive quando a categoria tem um projeto só.
 */
type Span = { className: string; sizes: string };

/** Até 1024px a grade é de uma coluna só, então o trecho móvel é comum a todos. */
const MOBILE_SIZES = '(max-width: 640px) 100vw, (max-width: 1024px) 94vw';

const WIDE: Span = { className: 'lg:col-span-12', sizes: `${MOBILE_SIZES}, 1200px` };
const PAIR_CYCLE: readonly Span[] = [
  { className: 'lg:col-span-7', sizes: `${MOBILE_SIZES}, 720px` },
  { className: 'lg:col-span-5', sizes: `${MOBILE_SIZES}, 520px` },
  { className: 'lg:col-span-5', sizes: `${MOBILE_SIZES}, 520px` },
  { className: 'lg:col-span-7', sizes: `${MOBILE_SIZES}, 720px` },
];

function spansFor(count: number): Span[] {
  const spans: Span[] = [];
  let index = 0;

  if (count % 2 === 1) {
    spans.push(WIDE);
    index = 1;
  }

  for (let pair = 0; index < count; index += 1, pair += 1) {
    spans.push(PAIR_CYCLE[pair % PAIR_CYCLE.length] ?? WIDE);
  }

  return spans;
}

export function Portfolio() {
  const [filter, setFilter] = useState<(typeof projectCategories)[number]>('Todos');

  const visible = useMemo(
    () => (filter === 'Todos' ? projects : projects.filter((item) => item.category === filter)),
    [filter],
  );

  const spans = useMemo(() => spansFor(visible.length), [visible.length]);

  return (
    <section id="portfolio" aria-labelledby="portfolio-titulo" className="section-y relative">
      <div className="shell">
        <SectionHeading
          index="03"
          eyebrow="Portfólio"
          titleId="portfolio-titulo"
          title="Projeto no ar, endereço para conferir."
          description="Cinco casos com o problema que existia antes, o que foi construído e o link para abrir agora."
          action={
            <Button asChild variant="outline" trailing={<ArrowUpRight className="h-4 w-4" />}>
              <Link href="#contato">Quero um resultado assim</Link>
            </Button>
          }
        />

        {/* Filtros */}
        <Reveal delay={0.1}>
          <div
            role="tablist"
            aria-label="Filtrar projetos por categoria"
            className="mt-12 flex flex-wrap gap-2"
          >
            {projectCategories.map((category) => {
              const active = category === filter;
              return (
                <button
                  key={category}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(category)}
                  className={cn(
                    'relative rounded-pill border px-4 py-2.5 text-body-sm transition-colors duration-micro ease-expo',
                    active ? 'border-transparent text-white' : 'border-line text-body hover:text-title',
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="portfolio-filter"
                      className="absolute inset-0 -z-10 rounded-pill bg-brand"
                      transition={{ duration: 0.45, ease: EASE_EXPO }}
                    />
                  ) : null}
                  {category}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Grade */}
        <motion.div layout className="mt-8 grid gap-5 lg:grid-cols-12">
          <AnimatePresence mode="popLayout">
            {visible.map((project, index) => (
              <motion.article
                key={project.slug}
                layout
                initial={{ opacity: 0, scale: 0.96, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -12 }}
                transition={{ duration: 0.5, ease: EASE_EXPO, delay: index * 0.04 }}
                className={cn('min-w-0 sm:col-span-1', spans[index]?.className)}
              >
                <ProjectCard project={project} sizes={spans[index]?.sizes} />
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function ProjectCard({ project, sizes }: { project: Project; sizes?: string }) {
  return (
    <Link
      href={`/projetos/${project.slug}`}
      data-cursor="ver projeto"
      onClick={() => track('project_view', { slug: project.slug })}
      className="group card-surface border-sheen relative flex h-full flex-col overflow-hidden rounded-bento p-3 shadow-e1 transition-[transform,box-shadow] duration-500 ease-expo hover:-translate-y-1.5 hover:shadow-e3"
    >
      <div className="relative overflow-hidden rounded-[18px]">
        <div className="transition-transform duration-700 ease-expo group-hover:scale-[1.03]">
          <ProjectFrame project={project} sizes={sizes} />
        </div>

        {/* Overlay de detalhes — só existe onde existe hover.
            `aria-hidden` porque o resumo abaixo repete o texto para quem
            está no toque: sem isso o leitor de tela ouviria duas vezes. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink-900 via-ink-900/70 to-transparent p-6 opacity-0 transition-opacity duration-500 ease-expo group-hover:opacity-100"
        >
          <div className="translate-y-4 transition-transform duration-500 ease-expo group-hover:translate-y-0">
            <p className="font-mono text-label uppercase text-accent">{project.segment}</p>
            <p className="mt-2 max-w-sm text-body-sm text-slate-300">{project.summary}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.stack.slice(0, 4).map((tech) => (
                <li
                  key={tech}
                  className="rounded-pill border border-white/15 bg-white/5 px-2.5 py-1 font-mono text-[0.6875rem] text-slate-300"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3">
          <span className="rounded-pill border border-line bg-surface/60 px-3 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted">
            {project.category}
          </span>
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted">
            {project.year}
          </span>
        </div>

        <h3 className="mt-4 text-display-sm text-title">{project.client}</h3>
        <p className="mt-2 text-body-sm text-body">{project.title}</p>

        {/* No celular não há hover, então o overlay nunca abre e o resumo —
            a única frase que conta o que o projeto era — desaparecia junto.
            Aqui ele volta, no corpo do card, onde há espaço para ele. */}
        <p className="mt-2.5 text-body-sm text-muted [@media(hover:hover)]:hidden">
          {project.summary}
        </p>

        <div className="mt-6 flex items-end justify-between gap-4 pt-1">
          <p className="font-mono text-[1.05rem] text-brand-soft">{project.headlineResult}</p>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-pill border border-line text-brand-soft transition-all duration-300 ease-expo group-hover:border-brand group-hover:bg-brand group-hover:text-white">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
