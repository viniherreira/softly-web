import type { Transition, Variants } from 'framer-motion';

/**
 * Vocabulário de movimento do site.
 * Regra dura: só `transform` e `opacity` — nada que force layout.
 * Toda duração/curva daqui espelha os tokens de app/globals.css.
 */
export const EASE_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_SOFT = [0.65, 0, 0.35, 1] as const;

export const DURATION = {
  micro: 0.18,
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
