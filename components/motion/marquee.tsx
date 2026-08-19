'use client';

import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { useRef, useState, type ReactNode } from 'react';
import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion';
import { cn } from '@/lib/utils';

/** Mantém um valor dentro de [min, max) — usado para o loop infinito. */
const wrapValue = (min: number, max: number, value: number): number => {
  const range = max - min;
  return (((value - min) % range) + range) % range + min;
};

/**
 * Marquee infinito de verdade (não é CSS animation com salto no fim).
 *
 * - Roda a 100% por rAF, então nunca "pula" ao mudar de velocidade.
 * - Pausa no hover.
 * - Inverte a direção quando o usuário rola para cima: a velocidade do scroll
 *   entra como fator de direção, do jeito que faixas premium se comportam.
 * - Em prefers-reduced-motion, vira uma lista estática rolável na horizontal.
 */
export function Marquee({
  children,
  baseVelocity = 22,
  direction = 1,
  className,
  itemClassName,
}: {
  children: ReactNode;
  /** px por segundo, aproximadamente. */
  baseVelocity?: number;
  direction?: 1 | -1;
  className?: string;
  itemClassName?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const baseX = useMotionValue(0);
  const directionFactor = useRef<number>(direction);
  const [paused, setPaused] = useState(false);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1200], [0, 4], { clamp: false });

  const x = useTransform(baseX, (value) => `${wrapValue(-50, 0, value)}%`);

  useAnimationFrame((_, delta) => {
    if (reduced || paused) return;

    let moveBy = directionFactor.current * baseVelocity * (delta / 1000) * -0.1;
    const factor = velocityFactor.get();

    // Rolando para cima → inverte; rolando para baixo → acelera na direção base.
    if (factor < 0) directionFactor.current = -direction;
    else if (factor > 0) directionFactor.current = direction;

    moveBy += directionFactor.current * moveBy * factor;
    baseX.set(baseX.get() + moveBy);
  });

  if (reduced) {
    return (
      <div className={cn('no-scrollbar flex gap-10 overflow-x-auto', className)}>
        <div className={cn('flex shrink-0 items-center gap-10', itemClassName)}>{children}</div>
      </div>
    );
  }

  return (
    <div
      className={cn('marquee-mask relative flex w-full overflow-hidden', className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <motion.div className="flex w-max flex-nowrap will-change-transform" style={{ x }}>
        {/* Duas cópias idênticas: o wrap acontece em -50%, sem costura visível */}
        <div className={cn('flex shrink-0 items-center', itemClassName)} aria-hidden="false">
          {children}
        </div>
        <div className={cn('flex shrink-0 items-center', itemClassName)} aria-hidden="true">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
