'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { ArrowRight } from '@/components/icons/ui-icons';
import { Magnetic } from '@/components/motion/magnetic';
import { SplitText } from '@/components/motion/split-text';
import { Button } from '@/components/ui/button';
import { useEntranceDelay } from '@/hooks/use-entrance-delay';
import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion';
import { track } from '@/lib/analytics';
import { EASE_EXPO } from '@/lib/motion';

/**
 * Hero — três elementos e nada mais: a figura, a frase e o botão.
 *
 * COMPOSIÇÃO
 * A figura ocupa o centro e é o maior objeto da página. A frase entra por
 * cima da base dela (pescoço e ombros), onde o cromado é escuro, e um
 * degradê do fundo sobe por trás do texto para garantir o contraste. O rosto
 * — que é a parte clara e o motivo de a imagem existir — fica inteiro e
 * livre na metade de cima.
 *
 * Saíram daqui o rótulo em mono e a barra de status. Eram informação
 * verdadeira e bem posicionada, mas a primeira tela não é onde se explica:
 * é onde se decide olhar. Frentes de trabalho e disponibilidade continuam no
 * site, logo abaixo.
 *
 * O ATIVO
 * hero-figura.png tem 1121×1253, recortado do render original (fundo preto)
 * por flood-fill a partir da moldura com feather de 2px — ver o histórico do
 * commit. O recorte importa só para o tema claro: sobre o preto do tema
 * escuro o fundo do arquivo já seria invisível.
 *
 * A 680px de exibição são 1360px de dispositivo num retina para 1121 de
 * fonte: 1,2x, que o cromado absorve por ser superfície lisa. A versão
 * anterior tinha 447px de largura e esticava 2,5x no mesmo espaço.
 */
export function Hero() {
  const base = useEntranceDelay();
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  /* A figura sobe mais devagar que o texto — é a diferença de velocidade
     entre as duas camadas que dá profundidade, não uma sombra. */
  const figureY = useTransform(scrollYProgress, [0, 1], [0, -52]);

  const enter = (delay: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 20 },
    animate: reduced
      ? { opacity: 1, transition: { duration: 0.15, delay: base } }
      : { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_EXPO, delay: base + delay } },
  });

  return (
    <section
      id="hero"
      ref={ref}
      className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden bg-bg pb-14 pt-[var(--header-h)]"
    >
      {/* A figura. A centragem mora num wrapper SEM animação e o framer anima
          só o filho: `y` vira `transform` inline e apagaria as classes
          `-translate-x-1/2` do Tailwind. */}
      <div className="pointer-events-none absolute left-1/2 top-[46%] -z-10 w-[min(88vw,680px)] -translate-x-1/2 -translate-y-1/2">
        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 38, scale: 1.04 }}
          animate={
            reduced
              ? { opacity: 1, transition: { duration: 0.15, delay: base } }
              : {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 1.5, ease: EASE_EXPO, delay: base },
                }
          }
          style={reduced ? undefined : { y: figureY }}
        >
          <Image
            src="/images/hero-figura.png"
            alt=""
            width={1121}
            height={1253}
            priority
            sizes="(max-width: 640px) 88vw, 680px"
            className="h-auto w-full"
          />
        </motion.div>
      </div>

      {/* Degradê que sobe do fundo: é o que deixa a frase legível sobre a base
          da figura. Sem ele o texto cai em cima de reflexo cromado. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[62%]"
        style={{
          background:
            'linear-gradient(to top, rgb(var(--bg)) 24%, rgb(var(--bg) / 0.82) 48%, transparent)',
        }}
      />

      <motion.div
        style={reduced ? undefined : { y: textY, opacity: textOpacity }}
        className="shell relative text-center"
      >
        {/* O aria-label carrega a frase inteira: os pedaços animados ficam
            aria-hidden e o texto aparece uma única vez no DOM. */}
        <h1
          /* Sem max-width própria: a `shell` já limita. Presa em 5xl (1024px)
             a frase quebrava em quatro linhas — "E DEVOLVE O" / "SEU TEMPO" —
             e a linha órfã roubava altura da figura. */
          className="text-display-hero uppercase text-title"
          aria-label="Software que traz cliente e devolve o seu tempo."
        >
          <SplitText text="Software que traz cliente" mode="word" delay={base + 0.3} aria="none" />{' '}
          <SplitText
            text="e devolve o seu tempo"
            mode="word"
            delay={base + 0.55}
            aria="none"
            className="text-brand-soft"
          />
        </h1>

        <motion.div {...enter(0.9)} className="mt-10 flex justify-center">
          <Magnetic strength={0.22}>
            <Button
              asChild
              size="lg"
              variant="outline"
              trailing={<ArrowRight className="h-5 w-5" />}
              onClick={() => track('cta_click', { location: 'hero', label: 'orcamento' })}
            >
              <Link href="#contato">Solicitar orçamento</Link>
            </Button>
          </Magnetic>
        </motion.div>
      </motion.div>
    </section>
  );
}
