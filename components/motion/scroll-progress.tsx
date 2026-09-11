'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Progresso de leitura, desenhado na aresta inferior do header.
 *
 * Antes ela ficava em `top-0` com z-90, ou seja, ATRÁS do header (z-100) —
 * enquanto a página estava no topo dava para ver, e a partir de 80px de
 * rolagem, que é justamente quando ela passa a significar alguma coisa, o
 * fundo opaco do header a escondia. Aqui ela vira o próprio fio de baixo do
 * header: fica sempre visível e o header ganha um detalhe que se move.
 */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX, top: 'calc(var(--header-h) - 2px)' }}
      className="fixed inset-x-0 z-[101] h-[2px] origin-left bg-gradient-to-r from-brand via-brand-soft to-accent"
    />
  );
}
