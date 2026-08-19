'use client';

import { motion, useMotionValue } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Drag, Play, Quote } from '@/components/icons/ui-icons';
import { Reveal } from '@/components/motion/reveal';
import { SectionHeading } from '@/components/section-heading';
import { Stars } from '@/components/ui/stars';
import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion';
import { testimonials, type Testimonial } from '@/content/testimonials';
import { EASE_EXPO } from '@/lib/motion';
import { cn } from '@/lib/utils';

/**
 * Depoimentos em carrossel arrastável.
 * - Desktop: arraste com o mouse (drag do Framer, com limites calculados).
 * - Mobile: scroll horizontal nativo com snap.
 * - Teclado: setas ← → movem um card por vez; os cards são focáveis.
 */
export function Testimonials() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [constraint, setConstraint] = useState(0);
  const x = useMotionValue(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const measure = () => {
      const node = trackRef.current;
      if (!node) return;
      setConstraint(Math.max(0, node.scrollWidth - node.clientWidth));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const nudge = (direction: 1 | -1) => {
    const next = Math.min(0, Math.max(-constraint, x.get() - direction * 380));
    x.set(next);
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
          className="mt-14 cursor-grab active:cursor-grabbing"
          data-cursor="arrastar"
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight') nudge(1);
            if (event.key === 'ArrowLeft') nudge(-1);
          }}
        >
          <motion.ul
            ref={trackRef}
            drag={reduced ? false : 'x'}
            dragConstraints={{ left: -constraint, right: 0 }}
            dragElastic={0.08}
            dragTransition={{ power: 0.25, timeConstant: 260 }}
            style={{ x }}
            className="no-scrollbar flex w-max gap-5 px-gutter"
          >
            {testimonials.map((item, index) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, ease: EASE_EXPO, delay: Math.min(index, 3) * 0.07 }}
                className="w-[85vw] shrink-0 sm:w-[26rem]"
              >
                <TestimonialCard testimonial={item} />
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </Reveal>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const [playing, setPlaying] = useState(false);

  return (
    <figure className="card-surface spotlight group relative flex h-full flex-col rounded-bento p-7 transition-transform duration-500 ease-expo hover:-translate-y-1.5">
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

      <figcaption className="flex items-center gap-4">
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
        <Stars rating={testimonial.rating} className="ml-auto shrink-0" />
      </figcaption>

      {testimonial.projectSlug ? (
        <Link
          href={`/projetos/${testimonial.projectSlug}`}
          className="mt-5 inline-flex items-center gap-2 font-mono text-label uppercase text-brand-soft transition-transform duration-300 ease-expo hover:translate-x-1"
        >
          Ver o projeto
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </figure>
  );
}
