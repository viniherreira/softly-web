'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { AvatarStack } from '@/components/avatar-stack';
import { HeroBackground } from '@/components/hero-background';
import { ArrowRight, ArrowUpRight } from '@/components/icons/ui-icons';
import { Counter } from '@/components/motion/counter';
import { SplitText } from '@/components/motion/split-text';
import { Button } from '@/components/ui/button';
import { useEntranceDelay } from '@/hooks/use-entrance-delay';
import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion';
import { heroStats } from '@/content/stats';
import { testimonials } from '@/content/testimonials';
import { track } from '@/lib/analytics';
import { EASE_EXPO } from '@/lib/motion';

/**
 * Hero — entrada orquestrada.
 *
 * Linha do tempo (a partir do fim do preloader):
 *   0ms    fundo (mesh já em loop contínuo)
 *   0ms    H1 revelado caractere a caractere, com máscara por palavra
 *   400ms  subtítulo
 *   600ms  CTAs
 *   800ms  prova social
 *   1000ms painel lateral e indicador de scroll
 */
export function Hero() {
  const base = useEntranceDelay();
  const reduced = usePrefersReducedMotion();

  const enter = (delay: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 24 },
    animate: reduced
      ? { opacity: 1, transition: { duration: 0.15, delay: base } }
      : { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_EXPO, delay: base + delay } },
  });

  return (
    <section id="hero" className="relative isolate overflow-hidden pb-20 pt-[calc(var(--header-h)+2.5rem)] lg:pb-24 lg:pt-[calc(var(--header-h)+3.5rem)]">
      <HeroBackground />

      <div className="shell">
        <div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Coluna principal — 7 de 12, deslocada da grade central */}
          <div className="min-w-0 lg:col-span-7">
            <motion.div {...enter(0)} className="flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-pill bg-accent" />
                <span className="relative inline-flex h-2 w-2 rounded-pill bg-accent" />
              </span>
              {/* TODO: substituir por dado real — disponibilidade da agenda */}
              <p className="font-mono text-label uppercase text-muted">
                Agenda aberta · 2 vagas neste trimestre
              </p>
            </motion.div>

            {/* O aria-label carrega a frase inteira: os pedaços animados ficam
                aria-hidden e o texto aparece uma única vez no DOM. */}
            <h1
              className="mt-6 text-display-hero text-title"
              aria-label="Software que traz cliente e devolve o seu tempo."
            >
              <SplitText text="Software que traz cliente" mode="char" delay={base} aria="none" />{' '}
              <SplitText
                text="e devolve o seu tempo."
                mode="line"
                delay={base + 0.34}
                aria="none"
                className="text-accent-gradient"
              />
            </h1>

            <motion.p {...enter(0.4)} className="mt-6 max-w-xl text-lead text-body">
              A Softly projeta e constrói sites, aplicativos, sistemas e automações com IA para
              empresas que precisam crescer sem montar um time técnico interno.
            </motion.p>

            <motion.div {...enter(0.6)} className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                asChild
                size="lg"
                trailing={<ArrowRight className="h-5 w-5" />}
                onClick={() => track('cta_click', { location: 'hero', label: 'orcamento' })}
              >
                <Link href="#contato">Solicitar orçamento</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="secondary"
                trailing={<ArrowUpRight className="h-5 w-5" />}
                onClick={() => track('cta_click', { location: 'hero', label: 'projetos' })}
              >
                <Link href="#portfolio">Ver projetos</Link>
              </Button>
            </motion.div>

            {/* Prova social imediata */}
            <motion.div {...enter(0.8)} className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-6">
              <div className="flex items-center gap-4">
                <AvatarStack
                  people={testimonials.slice(0, 4).map((item) => ({
                    initials: item.initials,
                    name: `${item.author} — ${item.company}`,
                  }))}
                />
                <p className="max-w-[11rem] text-body-sm text-muted">
                  Clientes que voltaram para o segundo projeto
                </p>
              </div>

              <dl className="flex flex-wrap items-center gap-x-8 gap-y-5">
                {heroStats.map((stat) => (
                  <div key={stat.id}>
                    <dt className="sr-only">{stat.label}</dt>
                    <dd className="font-mono text-[1.6rem] font-medium leading-none text-title">
                      <Counter
                        value={stat.value}
                        prefix={stat.prefix ?? ''}
                        suffix={stat.suffix ?? ''}
                        decimals={stat.decimals ?? 0}
                      />
                    </dd>
                    <p className="mt-1.5 text-body-sm text-muted">{stat.label}</p>
                  </div>
                ))}
              </dl>
            </motion.div>
          </div>

          {/* Painel lateral — "leitura técnica" da entrega, em mono */}
          <motion.aside
            {...enter(1)}
            className="glass relative min-w-0 rounded-bento p-6 lg:col-span-5 lg:mt-12 lg:p-8"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="font-mono text-label uppercase text-brand-soft">Padrão de entrega</p>
              <span className="font-mono text-label uppercase text-muted">v.2026</span>
            </div>

            <ul className="mt-7 space-y-5">
              {[
                { label: 'Carregamento no celular', value: 1.1, suffix: 's', bar: 0.86 },
                { label: 'Lighthouse (performance)', value: 98, suffix: '/100', bar: 0.98 },
                { label: 'Prazo médio de entrega', value: 5.2, suffix: ' semanas', bar: 0.62, decimals: 1 },
              ].map((row) => (
                <li key={row.label}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-body-sm text-body">{row.label}</span>
                    <span className="font-mono text-body-sm text-title">
                      <Counter value={row.value} decimals={row.decimals ?? 0} suffix={row.suffix} />
                    </span>
                  </div>
                  <div className="mt-2.5 h-1 w-full overflow-hidden rounded-pill bg-line/60">
                    <motion.div
                      className="h-full origin-left rounded-pill bg-gradient-to-r from-brand to-accent"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: row.bar }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.1, ease: EASE_EXPO, delay: base + 1.1 }}
                    />
                  </div>
                </li>
              ))}
            </ul>

            <div className="divider-glow my-7" />

            <p className="text-body-sm text-body">
              Todo projeto sai com escopo, prazo e preço fechados. Você acompanha em ambiente de
              testes desde a primeira semana.
            </p>
          </motion.aside>
        </div>

        {/* Indicador de scroll */}
        <motion.div {...enter(1.1)} className="mt-14 hidden items-center gap-3 lg:flex">
          <span className="relative flex h-9 w-5 items-start justify-center rounded-pill border border-line pt-1.5">
            <span className="h-1.5 w-1 animate-scroll-hint rounded-pill bg-brand-soft" />
          </span>
          <span className="font-mono text-label uppercase text-muted">Role para ver o método</span>
        </motion.div>
      </div>
    </section>
  );
}
