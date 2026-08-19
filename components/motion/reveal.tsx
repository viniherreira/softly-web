'use client';

import { motion, type Variants } from 'framer-motion';
import type { ElementType, ReactNode } from 'react';
import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion';
import { EASE_EXPO, DURATION, STAGGER, reducedVariants, viewportOnce } from '@/lib/motion';
import { cn } from '@/lib/utils';

/**
 * Reveal padrão de toda seção do site:
 * opacity 0→1 + translateY 32px→0, 700ms, cubic-bezier(0.16,1,0.3,1),
 * disparado quando 15% do bloco entra na viewport (Intersection Observer).
 * Em prefers-reduced-motion vira um fade de 150ms sem deslocamento.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 32,
  as = 'div',
  amount = viewportOnce.amount,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: ElementType;
  amount?: number;
}) {
  const reduced = usePrefersReducedMotion();
  const MotionTag = motion(as as ElementType);

  const variants: Variants = reduced
    ? reducedVariants
    : {
        hidden: { opacity: 0, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: DURATION.enter, ease: EASE_EXPO, delay },
        },
      };

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
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
  const MotionTag = motion(as as ElementType);

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
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  as?: ElementType;
}) {
  const reduced = usePrefersReducedMotion();
  const MotionTag = motion(as as ElementType);

  const variants: Variants = reduced
    ? reducedVariants
    : {
        hidden: { opacity: 0, y },
        visible: { opacity: 1, y: 0, transition: { duration: DURATION.enter, ease: EASE_EXPO } },
      };

  return (
    <MotionTag className={cn(className)} variants={variants}>
      {children}
    </MotionTag>
  );
}
