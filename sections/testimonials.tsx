'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { ArrowRight, Drag, Play, Quote } from '@/components/icons/ui-icons';
import { Reveal } from '@/components/motion/reveal';
import { SectionHeading } from '@/components/section-heading';
import { Stars } from '@/components/ui/stars';
import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion';
import { testimonials, type Testimonial } from '@/content/testimonials';
import { EASE_EXPO } from '@/lib/motion';

/**
 * Depoimentos em carrossel horizontal.
 *
 * ERA UM DRAG DO FRAMER, E ELE NÃO ANDAVA. O limite vinha de
 * `track.scrollWidth - track.clientWidth` num `<ul>` com `w-max` — nesse
 * elemento os dois valores são o MESMO número por definição (medido: 1037 e
 * 1037), então o limite dava zero, `dragConstraints` virava {0,0} e o trilho
 * só balançava e voltava. Os depoimentos 2 e 3 nunca apareceram para
 * ninguém, em nenhum aparelho, e as setas do desktop chamavam a mesma conta.
 *
 * Agora é scroll nativo com snap, que é o que o comentário antigo já dizia
 * que o celular fazia: no toque ganha inércia e snap do sistema, no desktop
 * as setas viraram `scrollBy` e o trackpad passa a rolar na horizontal. Sem
 * biblioteca no meio do gesto mais básico que existe.
 *
 * Teclado: as setas ← → movem um card por vez; os cards são focáveis.
 */
export function Testimonials() {
  const trackRef = useRef<HTMLUListElement>(null);
  const reduced = usePrefersReducedMotion();

  const nudge = (direction: 1 | -1) => {
    const node = trackRef.current;
    if (!node) return;
    /* Um card por toque: a largura do primeiro item mais o gap, seja ele
       80vw no celular ou 26rem no desktop. */
    const card = node.firstElementChild?.getBoundingClientRect().width ?? 380;
    node.scrollBy({
      left: direction * (card + 20),
      behavior: reduced ? 'auto' : 'smooth',
    });
  };

  return (
    <section id="depoimentos" aria-labelledby="depoimentos-titulo" className="section-y relative overflow-hidden">
      <div className="shell">
        <SectionHeading
          index="06"
          eyebrow="Depoimentos"
          titleId="depoimentos-titulo"
          title="Quem já trabalhou com a gente."
          description="Sem depoimento genérico. Cada um está ligado a um projeto que você pode abrir e conferir."
          action={
            <div className="hidden items-center gap-3 lg:flex">
              <span className="flex items-center gap-2 font-mono text-label uppercase text-muted">
                <Drag className="h-4 w-4" />
                Arraste
              </span>
              <button
                type="button"
                onClick={() => nudge(-1)}
                className="grid h-11 w-11 place-items-center rounded-pill border border-line text-body transition-colors hover:border-brand/60 hover:text-title"
                aria-label="Depoimento anterior"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => nudge(1)}
                className="grid h-11 w-11 place-items-center rounded-pill border border-line text-body transition-colors hover:border-brand/60 hover:text-title"
                aria-label="Próximo depoimento"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          }
        />
      </div>

      <Reveal delay={0.1}>
        <div
          className="mt-14"
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight') nudge(1);
            if (event.key === 'ArrowLeft') nudge(-1);
          }}
        >
          {/* 80vw, e não 85: é o que faz o próximo card assomar uns 55px na
              borda do celular. Esse pedaço à mostra é a única coisa que
              avisa que há mais para o lado — a dica "Arraste" com as setas
              vive só no desktop. */}
          <ul
            ref={trackRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-gutter px-gutter pb-3"
          >
            {testimonials.map((item, index) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: 36 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, ease: EASE_EXPO, delay: Math.min(index, 3) * 0.07 }}
                className="w-[80vw] shrink-0 snap-start sm:w-[26rem]"
              >
                <TestimonialCard testimonial={item} />
              </motion.li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const [playing, setPlaying] = useState(false);

  return (
    <figure className="card-surface spotlight group relative flex h-full flex-col rounded-bento p-6 shadow-e1 transition-[transform,box-shadow] duration-500 ease-expo hover:-translate-y-1.5 hover:shadow-e2 sm:p-7">
      <Quote className="h-9 w-9 text-brand/25 transition-colors duration-500 ease-expo group-hover:text-brand/45" />

      <blockquote className="mt-5 flex-1 text-body text-body">
        <p>{testimonial.quote}</p>
      </blockquote>

      {/* Depoimento em vídeo — aparece só quando há arquivo em content/testimonials.ts */}
      {testimonial.video ? (
        <div className="relative mt-6 overflow-hidden rounded-card border border-line/70">
          {playing ? (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video
              src={testimonial.video}
              controls
              autoPlay
              playsInline
              className="aspect-video w-full bg-ink-900"
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="relative flex aspect-video w-full items-center justify-center bg-ink-800"
              aria-label={`Assistir ao depoimento em vídeo de ${testimonial.author}`}
            >
              <span className="absolute inset-0 bg-gradient-to-br from-brand/25 to-accent/10" />
              <span className="relative grid h-14 w-14 place-items-center rounded-pill bg-brand text-white transition-transform duration-300 ease-expo group-hover:scale-110">
                <Play className="h-5 w-5" />
              </span>
            </button>
          )}
        </div>
      ) : null}

      <div className="divider-glow my-6" />

      {/* Avatar, nome e nota numa linha só cabem a partir de `sm`. No card de
          300px do celular sobravam 74px para o nome, e "Dra. Marina Ferraz"
          quebrava em três linhas com as estrelas espremidas ao lado. Aqui a
          nota desce para uma linha própria e o nome fica com a largura
          inteira. */}
      <figcaption className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3.5 sm:grid-cols-[auto_1fr_auto]">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-pill bg-gradient-to-br from-brand to-accent p-[2px]">
          <span className="grid h-full w-full place-items-center rounded-pill bg-surface font-mono text-body-sm text-title">
            {testimonial.initials}
          </span>
        </span>
        <span className="min-w-0">
          <span className="block text-body-sm font-bold text-title">{testimonial.author}</span>
          <span className="block text-body-sm text-muted">
            {testimonial.role} · {testimonial.company}
          </span>
        </span>
        <Stars
          rating={testimonial.rating}
          className="col-span-2 shrink-0 sm:col-span-1 sm:justify-self-end"
        />
      </figcaption>

      {testimonial.projectSlug ? (
        <Link
          href={`/projetos/${testimonial.projectSlug}`}
          /* `py` generoso com `mt` curto: o alvo de toque vai a 44px sem que
             o texto saia do lugar onde estava com `mt-5`. */
          className="mt-1.5 inline-flex items-center gap-2 py-3.5 font-mono text-label uppercase text-brand-soft transition-transform duration-300 ease-expo hover:translate-x-1"
        >
          Ver o projeto
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </figure>
  );
}
