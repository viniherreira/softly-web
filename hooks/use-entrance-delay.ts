'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Marca se o hero já montou neste carregamento de página.
 *
 * Variável de módulo, e não sessionStorage, de propósito: ela zera a cada F5
 * (que é quando a intro roda de novo) mas sobrevive à navegação client-side,
 * que é justamente o caso em que o hero não pode esperar — voltar para a home
 * pelo menu deixava a seção ~4s invisível esperando uma intro que não vem.
 */
let heroAlreadyMounted = false;

/**
 * Quanto o hero deve esperar antes de entrar.
 * A cada carregamento de página a intro cinematográfica ocupa ~3,95s — a
 * entrada orquestrada começa junto com a cortina, para o hero já estar em
 * movimento quando o site é revelado. Em navegação interna (ou com
 * reduced-motion, ou com ?intro=0) o atraso é zero.
 */
export function useEntranceDelay(): number {
  const [delay, setDelay] = useState(0);
  const [ready, setReady] = useState(false);
  /** Guarda a decisão para uma única passada: o StrictMode monta o efeito
   *  duas vezes em desenvolvimento, e a segunda encontraria a flag de módulo
   *  já marcada pela primeira — o hero perderia o atraso da intro. */
  const decidedRef = useRef(false);

  useEffect(() => {
    if (decidedRef.current) return;
    decidedRef.current = true;

    const firstMount = !heroAlreadyMounted;
    heroAlreadyMounted = true;

    /* A preferência vem do matchMedia, não do hook: durante a hidratação o
       hook ainda devolve o snapshot do servidor (false) e o hero entraria
       atrasado justamente para quem pediu menos movimento. */
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const skipped = new URLSearchParams(window.location.search).get('intro') === '0';

    setDelay(firstMount && !prefersReduced && !skipped ? 3.8 : 0);
    setReady(true);
  }, []);

  return ready ? delay : 0;
}
