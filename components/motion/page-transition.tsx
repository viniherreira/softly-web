'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion';
import { EASE_EXPO } from '@/lib/motion';

/**
 * Transição entre rotas: só entrada, sem `AnimatePresence`.
 *
 * Aqui havia `AnimatePresence mode="wait"` com animação de saída. No App
 * Router isso quebra a navegação: quando a rota muda, `children` já é o
 * conteúdo da rota NOVA enquanto o `motion.div` antigo ainda está saindo.
 * Os dois ramos passam a renderizar os mesmos nós, o React tenta remover um
 * nó que não está mais onde esperava e estoura
 * `NotFoundError: Failed to execute 'removeChild' on 'Node'`. O efeito
 * visível era a página de destino em branco — clicar em "Ver o case" trocava
 * a URL e não mostrava nada.
 *
 * Sem saída o problema não existe: a rota nova monta com a própria `key` e
 * entra sozinha. O custo é não ter fade de saída, que ninguém vê mesmo
 * porque a navegação do App Router é imediata.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      key={pathname}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduced ? { duration: 0.15 } : { duration: 0.35, ease: EASE_EXPO }}
    >
      {children}
    </motion.div>
  );
}
