'use client';

import { motion, useAnimationControls } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { LOGO_LOWER, LOGO_UPPER, LOGO_VIEWBOX, LogoMark } from '@/components/icons/logo';
import { useSmoothScroll } from '@/components/motion/smooth-scroll';
import { EASE_CALM, EASE_EXPO } from '@/lib/motion';

/**
 * Abertura do site.
 *
 * TESE: a marca da Softly é feita de duas peças que se encaixam. A abertura é
 * exatamente isso acontecendo — as metades chegam pelas suas diagonais, travam
 * uma na outra e o nome aparece atrás delas. É um gesto que só faz sentido
 * para ESTA marca; trocada a marca, a animação perde o motivo e deve sair.
 *
 * Por que substituiu a anterior: era um campo de partículas em canvas (~900
 * linhas com a lib de apoio) que desenhava linhas de código por ~4 segundos
 * antes de formar o "S". Quatro segundos é tempo de abandono, o código na tela
 * não dizia nada sobre o negócio de quem contrata, e o efeito era genérico —
 * o mesmo preloader de partículas serviria para qualquer empresa.
 *
 * Linha do tempo (2,45s no total, contra 3,95s da versão em partículas):
 *   0,00s  fundo escuro
 *   0,10s  metade de cima entra pela diagonal superior esquerda
 *   0,22s  metade de baixo entra pela diagonal inferior direita
 *   1,02s  as duas travam — um clarão branco marca o encontro e some
 *   1,18s  a palavra "Softly" é descoberta da esquerda para a direita
 *   1,95s  a cortina sobe e revela a página; o conjunto sobe junto e some
 *
 * O ritmo é EASE_CALM, não EASE_EXPO: a curva exponencial larga rápido e
 * freia no fim, o que é certo para responder a um clique e ansioso demais
 * para uma abertura, que a pessoa só assiste. O intervalo entre as duas
 * metades também é largo (120ms) de propósito — são dois movimentos que se
 * leem separados, não um evento só.
 *
 * Custo: quatro <path> e um <span>. Sem canvas, sem rAF, sem simulação.
 * Só transform, opacity e clip-path.
 */

/** Distância de entrada de cada metade, em unidades do viewBox da marca. */
const ENTRY = { x: 34, y: 27 };

/** Segundos. Mexer aqui exige ajustar INTRO_DURATION (abaixo) junto. */
const T = {
  upper: 0.1,
  lower: 0.22,
  travel: 0.8,
  /** Instante em que a segunda metade encosta na primeira. */
  lock: 1.02,
  word: 1.18,
  wordDur: 0.55,
  /** A pausa entre o fim da palavra e a cortina é o que faz a abertura
   *  respirar: sem ela o conjunto montado nunca chega a ser lido. Ela é o
   *  primeiro lugar a encurtar quando a abertura precisar ficar mais rápida,
   *  e o último a sumir — sem pausa nenhuma o movimento vira só pressa. */
  curtain: 1.95,
  curtainDur: 0.5,
  end: 2.45,
} as const;

/**
 * Quanto o resto da página deve esperar para começar a entrar.
 * Não é o fim da abertura: o hero começa a subir junto com a cortina, para o
 * site já estar em movimento quando é revelado. Lido por useEntranceDelay.
 */
export const INTRO_DURATION = T.curtain + 0.13;

export function CinematicIntro() {
  const { stop, start } = useSmoothScroll();
  const [active, setActive] = useState(false);
  const [gone, setGone] = useState(false);
  /** Abertura enxuta para quem pediu menos movimento: só opacidade. */
  const [reducedIntro, setReducedIntro] = useState(false);
  const controls = useAnimationControls();
  /** Trava a decisão em uma única execução: em desenvolvimento o StrictMode
   *  monta o efeito duas vezes, e a intro não pode ser reiniciada no meio
   *  da segunda passada. */
  const decidedRef = useRef(false);

  /* Decide se a intro roda — antes de qualquer trabalho.
     Lê a preferência direto do matchMedia em vez do hook: durante a
     hidratação o hook ainda devolve o snapshot do servidor (false), e a
     decisão sairia errada justamente para quem pediu menos movimento. */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (decidedRef.current) return;
    decidedRef.current = true;

    /* ?intro=0 pula a abertura — útil para inspecionar o site direto, e para
       compartilhar um link que cai na home sem esperar. */
    if (new URLSearchParams(window.location.search).get('intro') === '0') {
      setGone(true);
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReducedIntro(true);
      const timer = window.setTimeout(() => setReducedIntro(false), 900);
      return () => window.clearTimeout(timer);
    }

    setActive(true);
    return;
  }, []);

  /* Trava o scroll enquanto a cortina está fechada e devolve depois.
     `overflow` no body cobre o caso de o Lenis ainda não ter montado. */
  useEffect(() => {
    if (!active) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    stop();
    const timer = window.setTimeout(() => {
      document.body.style.overflow = previous;
      start();
      setGone(true);
    }, T.end * 1000);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previous;
      start();
    };
  }, [active, stop, start]);

  /* Pular: qualquer intenção do usuário corta para o fim.
     Uma abertura que ignora quem quer entrar é uma porta emperrada. */
  useEffect(() => {
    if (!active) return;
    const skip = () => void controls.start('skip');
    window.addEventListener('pointerdown', skip, { once: true });
    window.addEventListener('keydown', skip, { once: true });
    window.addEventListener('wheel', skip, { once: true, passive: true });
    return () => {
      window.removeEventListener('pointerdown', skip);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('wheel', skip);
    };
  }, [active, controls]);

  if (reducedIntro) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[200] grid place-items-center bg-ink-900"
        style={{ animation: 'softly-reduced-intro 900ms ease-in-out forwards' }}
      >
        <LogoMark className="h-20 w-auto" />
      </div>
    );
  }

  if (gone || !active) return null;

  /* As metades viajam JÁ no azul da marca — quem abre o site tem que ver a
     cor da Softly desde o primeiro quadro. O branco entra depois, e rápido,
     como o clarão do encaixe (ver <Flash/>). */
  const half = (from: 'upper' | 'lower') => {
    const sign = from === 'upper' ? -1 : 1;
    return {
      hidden: { x: ENTRY.x * sign, y: ENTRY.y * sign, opacity: 0 },
      run: {
        x: 0,
        y: 0,
        opacity: 1,
        transition: {
          x: { duration: T.travel, ease: EASE_CALM, delay: T[from] },
          y: { duration: T.travel, ease: EASE_CALM, delay: T[from] },
          opacity: { duration: 0.45, delay: T[from] },
        },
      },
      skip: { x: 0, y: 0, opacity: 1, transition: { duration: 0.12 } },
    };
  };

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-0 z-[200] grid place-items-center overflow-hidden bg-ink-900"
      style={{ contain: 'strict' }}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { clipPath: 'inset(0% 0 0% 0)' },
        run: {
          clipPath: 'inset(0% 0 100% 0)',
          transition: { duration: T.curtainDur, ease: EASE_CALM, delay: T.curtain },
        },
        skip: { clipPath: 'inset(0% 0 100% 0)', transition: { duration: 0.32, ease: EASE_EXPO } },
      }}
      onAnimationComplete={() => setGone(true)}
    >
      {/* halo atrás da marca — a luz que já é a atmosfera do site */}
      <div
        className="pointer-events-none absolute h-[42rem] w-[42rem] rounded-pill blur-[130px]"
        style={{ background: 'radial-gradient(circle, rgb(var(--logo) / 0.22), transparent 62%)' }}
      />
      <div className="grid-layer" />

      <motion.div
        className="relative flex items-center gap-[0.55em] text-[clamp(2.4rem,7vw,4.2rem)]"
        variants={{
          hidden: { y: 0, opacity: 1, scale: 1.035 },
          run: {
            y: -18,
            opacity: 0,
            /* A escala desce de 1,035 para 1 ao longo de TODA a abertura, sem
               atraso. É lento demais para ser percebido como animação, e é o
               que impede a pausa antes da cortina de parecer travamento: a
               imagem nunca fica completamente parada. */
            scale: 1,
            transition: {
              y: { duration: 0.55, ease: EASE_CALM, delay: T.curtain },
              opacity: { duration: 0.55, ease: EASE_CALM, delay: T.curtain },
              scale: { duration: T.curtain, ease: EASE_CALM },
            },
          },
          skip: { y: -18, opacity: 0, scale: 1, transition: { duration: 0.26, ease: EASE_EXPO } },
        }}
      >
        <svg viewBox={LOGO_VIEWBOX} className="h-[1.55em] w-auto overflow-visible text-logo">
          <motion.path d={LOGO_UPPER} fill="currentColor" variants={half('upper')} />
          <motion.path d={LOGO_LOWER} fill="currentColor" variants={half('lower')} />
          <Flash />
        </svg>

        {/* A palavra é DESCOBERTA da esquerda para a direita, como se estivesse
            atrás da marca o tempo todo — não entra deslizando por fora. */}
        <motion.span
          className="font-display font-bold leading-none tracking-[-0.045em] text-white"
          variants={{
            hidden: { clipPath: 'inset(0 100% 0 0)' },
            run: {
              clipPath: 'inset(0 0% 0 0)',
              transition: { duration: T.wordDur, ease: EASE_CALM, delay: T.word },
            },
            skip: { clipPath: 'inset(0 0% 0 0)', transition: { duration: 0.18 } },
          }}
        >
          Softly
        </motion.span>
      </motion.div>

      <Runner controls={controls} />
    </motion.div>
  );
}

/**
 * O clarão do encaixe: a marca inteira em branco, 340ms, no instante em que a
 * segunda metade encosta na primeira. É uma camada separada em vez de uma
 * animação de `fill` nas peças porque assim o clarão tem o seu próprio tempo —
 * curto — sem arrastar a cor da marca junto durante a viagem.
 */
function Flash() {
  return (
    <motion.g
      fill="#fff"
      variants={{
        hidden: { opacity: 0 },
        run: {
          opacity: [0, 0.7, 0],
          transition: { duration: 0.34, ease: 'easeOut', delay: T.lock - 0.08, times: [0, 0.25, 1] },
        },
        skip: { opacity: 0, transition: { duration: 0.05 } },
      }}
    >
      <path d={LOGO_UPPER} />
      <path d={LOGO_LOWER} />
    </motion.g>
  );
}

/**
 * Dispara a sequência depois da primeira pintura.
 * Fica em componente próprio para o efeito não correr antes de os filhos
 * existirem — `controls.start` num pai que ainda não montou não pega ninguém.
 */
function Runner({ controls }: { controls: ReturnType<typeof useAnimationControls> }) {
  useEffect(() => {
    const frame = requestAnimationFrame(() => void controls.start('run'));
    return () => cancelAnimationFrame(frame);
  }, [controls]);
  return null;
}
