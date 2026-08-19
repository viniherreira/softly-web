'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/** Barra de progresso de leitura no topo, com gradiente azul. */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[90] h-[2px] origin-left bg-gradient-to-r from-brand via-brand-soft to-accent"
    />
  );
}
