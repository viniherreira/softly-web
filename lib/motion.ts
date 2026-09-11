import type { Transition, Variants } from 'framer-motion';

/**
 * Vocabulário de movimento do site.
 *
 * TESE: a página se comporta como um instrumento que se calibra conforme
 * você rola. Números assentam no valor real, barras procuram a marca, uma
 * varredura de luz passa uma única vez pelo painel. Daí sai a regra de que
 * cada seção tem UMA ideia de entrada própria — nunca o mesmo fade-up
 * repetido nove vezes, que é o que faz uma página parecer montada.
 *
 * Propriedades: transform e opacity são a base, não o teto. `clip-path`,
 * `filter: blur` e `box-shadow` entram quando o que está sendo comunicado é
 * revelação, foco ou profundidade — sempre em região pequena e delimitada.
 */
export const EASE_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_SOFT = [0.65, 0, 0.35, 1] as const;
/**
 * Desaceleração longa e sem pressa (easeOutCubic).
 * A EASE_EXPO larga muito rápido e freia no fim — ótimo para resposta a um
 * clique, ansioso para um movimento que a pessoa deve simplesmente assistir.
 * Use esta na abertura e em qualquer coisa com mais de ~1s de duração.
 */
export const EASE_CALM = [0.33, 1, 0.68, 1] as const;

export const DURATION = {
  /** 100–150ms: resposta imediata (o botão reconheceu o clique) */
  feedback: 0.14,
  micro: 0.18,
  /** 150–300ms: troca de estado corriqueira */
  state: 0.26,
  /** 300–500ms: layout, overlay, troca de vista */
  layout: 0.42,
  /** 500–800ms: entrada autoral, usada com parcimônia */
  enter: 0.7,
  cinema: 1.2,
} as const;

export const STAGGER = 0.07;

export const transitionEnter: Transition = {
  duration: DURATION.enter,
  ease: EASE_EXPO,
};

export const transitionMicro: Transition = {
  duration: DURATION.micro,
  ease: EASE_EXPO,
};

/** Entrada padrão de qualquer bloco: 32px para cima + fade. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: transitionEnter },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitionEnter },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 16 },
  visible: { opacity: 1, scale: 1, y: 0, transition: transitionEnter },
};

/**
 * Entradas com ideia própria — uma por seção, para o olho não reconhecer o
 * mesmo truque repetido página abaixo.
 */

/** Cortina: o card é descoberto de baixo para cima. Usado no bento de
 *  serviços, onde os cards devem parecer que estavam ali e foram revelados,
 *  não que voaram de fora da tela. */
export const maskUp: Variants = {
  hidden: { clipPath: 'inset(18% 0 0 0 round 20px)', opacity: 0, y: 14 },
  visible: {
    clipPath: 'inset(0% 0 0 0 round 20px)',
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: EASE_EXPO },
  },
};

/** Foco: chega levemente desfocado e assenta. É o gesto de um instrumento
 *  travando a leitura — reservado para blocos de número. */
export const settleIn: Variants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(7px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: EASE_EXPO },
  },
};

/** Deriva lateral: para trilhos e listas que se leem na horizontal. */
export const driftIn = (from: 'left' | 'right' = 'left'): Variants => ({
  hidden: { opacity: 0, x: from === 'left' ? -28 : 28 },
  visible: { opacity: 1, x: 0, transition: transitionEnter },
});

/** Traço: a linha se desenha da esquerda. Usada nos divisores de seção. */
export const drawLine: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.9, ease: EASE_EXPO } },
};

/** Container que dispara os filhos em cascata. */
export const staggerContainer = (stagger: number = STAGGER, delay = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

/** Revelação por linha com máscara (o pai precisa de overflow-hidden). */
export const lineReveal: Variants = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: { duration: 0.9, ease: EASE_EXPO } },
};

export const charReveal: Variants = {
  hidden: { opacity: 0, y: '55%', rotateX: -45 },
  visible: { opacity: 1, y: '0%', rotateX: 0, transition: { duration: 0.75, ease: EASE_EXPO } },
};

/** Transição entre páginas — nunca acima de 400ms. */
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE_EXPO } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25, ease: EASE_EXPO } },
};

/** Viewport padrão dos reveals: dispara com 15% do bloco visível, uma vez só. */
export const viewportOnce = { once: true, amount: 0.15 } as const;

/** Versão sem movimento, aplicada quando prefers-reduced-motion está ativo. */
export const reducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};
