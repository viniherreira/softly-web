'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/**
 * Entrada de rota — CSS puro, sem Framer Motion.
 *
 * Histórico, porque é um erro fácil de reintroduzir:
 *
 * 1. Começou com `AnimatePresence mode="wait"` e animação de saída. No App
 *    Router isso quebra: quando a rota muda, `children` já é o conteúdo da
 *    rota NOVA enquanto o `motion.div` antigo ainda está saindo. Os dois ramos
 *    renderizam os mesmos nós, o React tenta remover um nó que não está mais
 *    onde esperava e estoura
 *    `NotFoundError: Failed to execute 'removeChild' on 'Node'`. Em produção
 *    isso vira a tela "Application error: a client-side exception has
 *    occurred" e a rota de destino não abre — só com F5, que renderiza no
 *    servidor e não passa por aqui.
 *
 * 2. Tirar a saída resolveu esse caso, mas manteve um `motion.div` com `key` na
 *    fronteira da rota. Framer Motion mexe no DOM por fora do React (projeção
 *    de layout), e essa é justamente a combinação que produz o mesmo erro
 *    quando uma animação está em voo no momento da navegação.
 *
 * Agora não há biblioteca de animação nenhuma neste ponto: um `<div>` comum
 * com `key={pathname}`. O React monta e desmonta a subárvore sozinho e a
 * entrada é uma animação CSS, que reinicia porque a `key` troca. Sem DOM
 * manipulado por fora, o erro não tem por onde acontecer.
 *
 * `prefers-reduced-motion` já é respeitado no globals.css, que zera a duração
 * de todas as animações.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="animate-enter-up">
      {children}
    </div>
  );
}
