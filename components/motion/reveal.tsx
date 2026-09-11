'use client';

import { motion, type TargetAndTransition, type Variants } from 'framer-motion';

/** motion() foi depreciado em favor de motion.create(); mantém compatível
 *  com as duas APIs sem poluir o console. */
const motionTag = (tag: ElementType) =>
  (motion as unknown as { create?: (t: ElementType) => ElementType }).create?.(tag) ??
  (motion as unknown as (t: ElementType) => ElementType)(tag);
import { useCallback, useRef, type ElementType, type ReactNode } from 'react';
import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion';
import {
  EASE_EXPO,
  DURATION,
  STAGGER,
  maskUp,
  reducedVariants,
  settleIn,
  viewportOnce,
} from '@/lib/motion';
import { cn } from '@/lib/utils';

/**
 * Modo de entrada. `rise` é o padrão discreto; os outros existem para que
 * cada seção tenha um gesto próprio em vez do mesmo fade-up nove vezes.
 * Ver a tese em lib/motion.ts.
 */
export type RevealVariant = 'rise' | 'mask' | 'settle';

/**
 * Ao terminar a entrada em máscara, apaga o `clip-path` do elemento.
 *
 * O Framer deixa o valor final como estilo inline, e `inset(0% ...)` recorta
 * exatamente a caixa de borda: a sombra do card ficava cortada rente à
 * superfície (matando a elevação) e o hover, que sobe 6px, era decepado no
 * topo. Terminada a revelação a máscara não tem mais o que fazer ali.
 *
 * O mesmo vale para `filter: blur(0px)` da variante `settle`: um filtro,
 * mesmo em zero, cria camada de composição e recorta a sombra do filho.
 */
function useClearAfterEntrance(variant: RevealVariant) {
  const ref = useRef<HTMLElement>(null);

  const onAnimationComplete = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    if (variant === 'mask') node.style.clipPath = '';
    if (variant === 'settle') node.style.filter = '';
  }, [variant]);

  return variant === 'rise' ? {} : { ref, onAnimationComplete };
}

function pickVariants(variant: RevealVariant, y: number, delay: number): Variants {
  /** Reaproveita a variante do vocabulário e só injeta o atraso pedido. */
  const withDelay = (base: Variants): Variants => {
    const visible = base.visible as TargetAndTransition;
    return {
      hidden: base.hidden ?? {},
      visible: { ...visible, transition: { ...visible.transition, delay } },
    };
  };

  if (variant === 'mask') return withDelay(maskUp);
  if (variant === 'settle') return withDelay(settleIn);

  return {
    hidden: { opacity: 0, y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: DURATION.enter, ease: EASE_EXPO, delay },
    },
  };
}

/**
 * Reveal das seções do site. Padrão: opacity 0→1 + translateY 32px→0, 700ms,
 * cubic-bezier(0.16,1,0.3,1), disparado com 15% do bloco na viewport.
 * Em prefers-reduced-motion vira um fade de 150ms sem deslocamento.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 32,
  as = 'div',
  amount = viewportOnce.amount,
  variant = 'rise',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: ElementType;
  amount?: number;
  variant?: RevealVariant;
}) {
  const reduced = usePrefersReducedMotion();
  const MotionTag = motionTag(as);
  const cleanup = useClearAfterEntrance(reduced ? 'rise' : variant);

  const variants: Variants = reduced ? reducedVariants : pickVariants(variant, y, delay);

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      {...cleanup}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Container de cascata: os filhos entram com 70ms de diferença.
 * Use com <RevealItem> dentro.
 */
export function RevealGroup({
  children,
  className,
  stagger = STAGGER,
  delay = 0,
  as = 'div',
  amount = viewportOnce.amount,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  as?: ElementType;
  amount?: number;
}) {
  const MotionTag = motionTag(as);

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </MotionTag>
  );
}

export function RevealItem({
  children,
  className,
  y = 28,
  as = 'div',
  variant = 'rise',
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  as?: ElementType;
  variant?: RevealVariant;
}) {
  const reduced = usePrefersReducedMotion();
  const MotionTag = motionTag(as);
  const cleanup = useClearAfterEntrance(reduced ? 'rise' : variant);

  const variants: Variants = reduced ? reducedVariants : pickVariants(variant, y, 0);

  return (
    <MotionTag className={cn(className)} variants={variants} {...cleanup}>
      {children}
    </MotionTag>
  );
}
