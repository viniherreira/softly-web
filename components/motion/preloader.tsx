'use client';

import { AnimatePresence, motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';
import { LogoMark } from '@/components/icons/logo';
import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion';
import { EASE_EXPO } from '@/lib/motion';

const SESSION_KEY = 'softly:preloaded';
const MAX_DURATION = 1.5; // s — a saída em cortina fecha antes de 1.8s no total

/**
 * Preloader de abertura.
 *
 * - O "S" da marca se desenha com stroke-dasharray (pathLength normalizado a 1).
 * - Contador em mono de 0 a 100.
 * - Saída em cortina: clip-path diagonal revelando o hero.
 * - Aparece só no primeiro load da sessão (sessionStorage) e nunca em navegação
 *   interna. Ignorado por completo em prefers-reduced-motion.
 * - O conteúdo da página já está no DOM por baixo: nada de bloquear indexação.
 */
export function Preloader() {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(false);
  const progress = useMotionValue(0);
  const rounded = useTransform(progress, (value) => String(Math.round(value)).padStart(3, '0'));

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const finish = () => {
      window.sessionStorage.setItem(SESSION_KEY, '1');
      setActive(false);
      document.body.style.overflow = '';
    };

    // Se a preferência por menos movimento chegar depois da hidratação, o
    // preloader precisa sair de cena — nunca deixar a cortina presa na tela.
    if (reduced) {
      finish();
      return;
    }

    if (window.sessionStorage.getItem(SESSION_KEY)) return;

    setActive(true);
    document.body.style.overflow = 'hidden';

    const controls = animate(progress, 100, {
      duration: MAX_DURATION,
      ease: EASE_EXPO,
      onComplete: finish,
    });

    // Rede de segurança: nada mantém a tela bloqueada além de 2,4s.
    const failsafe = window.setTimeout(finish, MAX_DURATION * 1000 + 900);

    return () => {
      controls.stop();
      window.clearTimeout(failsafe);
      document.body.style.overflow = '';
    };
  }, [progress, reduced]);

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          key="preloader"
          aria-hidden="true"
          className="fixed inset-0 z-[200] flex items-center justify-center bg-bg"
          initial={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
          exit={{
            clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
            transition: { duration: 0.85, ease: EASE_EXPO },
          }}
        >
          <div className="grid-layer" />
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-pill blur-[110px]"
            style={{ background: 'radial-gradient(circle, rgb(var(--glow) / 0.28), transparent 65%)' }}
          />

          <div className="relative flex flex-col items-center gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE_EXPO } }}
            >
              <svg viewBox="0 0 48 48" fill="none" className="h-20 w-20">
                <defs>
                  <linearGradient id="preloader-mark" x1="8" y1="6" x2="40" y2="42" gradientUnits="userSpaceOnUse">
                    <stop stopColor="rgb(var(--brand-soft))" />
                    <stop offset="1" stopColor="rgb(var(--accent))" />
                  </linearGradient>
                </defs>
                <rect x="1.75" y="1.75" width="44.5" height="44.5" rx="13" stroke="rgb(var(--border))" strokeWidth="1.5" />
                <motion.path
                  pathLength={1}
                  d="M34 13.5C31 10 27.5 8.5 23.5 8.5c-6.5 0-11 3.6-11 9 0 5 3.4 7.6 10.4 9.2l2.6.6c7 1.6 10.4 4.2 10.4 9.2 0 5.4-4.5 9-11 9-4 0-7.5-1.5-10.5-5"
                  stroke="url(#preloader-mark)"
                  strokeWidth="3.25"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0.2 }}
                  animate={{
                    pathLength: 1,
                    opacity: 1,
                    transition: { duration: MAX_DURATION * 0.86, ease: EASE_EXPO },
                  }}
                />
                <motion.circle
                  cx="37.5"
                  cy="10.5"
                  r="3"
                  fill="rgb(var(--accent))"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, transition: { delay: 0.55, duration: 0.5, ease: EASE_EXPO } }}
                  style={{ transformOrigin: '37.5px 10.5px' }}
                />
              </svg>
            </motion.div>

            <div className="flex items-center gap-3 font-mono text-label uppercase text-muted">
              <span>Softly</span>
              <span className="h-px w-10 bg-line" />
              <motion.span className="numeric text-brand-soft">{rounded}</motion.span>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
