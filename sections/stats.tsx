'use client';

import { motion } from 'framer-motion';
import { Counter } from '@/components/motion/counter';
import { RevealGroup, RevealItem } from '@/components/motion/reveal';
import { drawLine, EASE_EXPO } from '@/lib/motion';
import { resultStats } from '@/content/stats';

/**
 * Faixa de resultados.
 *
 * Antes eram quatro números em quatro colunas de largura igual, sem nada
 * separando um do outro: uma linha de dígitos flutuando no escuro. Agora a
 * faixa se comporta como a régua de um instrumento — cada medida ocupa uma
 * casa delimitada por um fio vertical que se desenha na entrada, e o número
 * chega levemente desfocado e assenta (variante `settle`), o mesmo gesto de
 * travar a leitura que o painel do hero usa.
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
            'radial-gradient(60% 100% at 50% 50%, rgb(var(--glow) / 0.077), transparent 70%)',
        }}
      />

      <div className="shell">
        <h2 id="numeros-titulo" className="sr-only">
          Números da Softly
        </h2>

        <RevealGroup className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4" stagger={0.09}>
          {resultStats.map((stat, index) => (
            <RevealItem key={stat.id} variant="settle">
              <div className="relative flex flex-col lg:pl-8">
                {/* Fio de casa: separa as medidas sem virar tabela. Some na
                    primeira coluna de cada linha, onde não separa nada. */}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-y-0 left-0 hidden w-px lg:block ${
                    index === 0 ? 'lg:hidden' : ''
                  }`}
                >
                  <motion.span
                    className="block h-full w-px origin-top bg-gradient-to-b from-transparent via-line to-transparent"
                    variants={{
                      hidden: { scaleY: 0 },
                      visible: { scaleY: 1, transition: { duration: 0.9, ease: EASE_EXPO } },
                    }}
                  />
                </span>

                <span className="font-display text-[clamp(2.6rem,4.6vw,3.6rem)] font-bold leading-none tracking-[-0.04em] text-title">
                  <Counter
                    value={stat.value}
                    decimals={stat.decimals ?? 0}
                    prefix={stat.prefix ?? ''}
                    suffix={stat.suffix ?? ''}
                    suffixClassName="ml-0.5 align-baseline text-[0.44em] font-medium tracking-normal text-muted"
                  />
                </span>

                {/* Traço sob o número: fecha a medida, como a base de uma cota */}
                <motion.span
                  aria-hidden="true"
                  className="mt-4 block h-px w-10 origin-left bg-brand-soft"
                  variants={drawLine}
                />

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
