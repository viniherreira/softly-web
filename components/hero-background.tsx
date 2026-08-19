'use client';

import { useIsMobile } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';

/**
 * Atmosfera do hero (e do CTA final).
 *
 * Camadas, de trás para a frente:
 *  1. mesh de três halos azuis em loop lento de 20s (transform/opacity apenas)
 *  2. feixe de luz direcional — a luz sempre vem de um lugar, nunca é simétrica
 *  3. papel milimetrado a 4%
 *  4. partículas determinísticas (posições fixas: nada de Math.random, que
 *     quebraria a hidratação)
 *  5. grão de filme a 4%
 *
 * DECISÃO: nenhum Three.js aqui. O ganho visual do WebGL neste layout não
 * pagava ~150KB de JS e um segundo canvas competindo com o LCP. O mesmo efeito
 * de profundidade foi obtido com camadas compostas na GPU, que rodam a 60fps
 * também em celular intermediário. O ponto de extensão está documentado no
 * README, caso se queira plugar R3F depois.
 */
const PARTICLES = [
  { left: '12%', top: '28%', size: 3, delay: '0s', duration: '9s' },
  { left: '22%', top: '62%', size: 2, delay: '1.2s', duration: '11s' },
  { left: '34%', top: '18%', size: 2, delay: '2.4s', duration: '8s' },
  { left: '47%', top: '74%', size: 3, delay: '0.6s', duration: '12s' },
  { left: '58%', top: '34%', size: 2, delay: '3.1s', duration: '10s' },
  { left: '68%', top: '58%', size: 4, delay: '1.8s', duration: '13s' },
  { left: '76%', top: '22%', size: 2, delay: '2.9s', duration: '9s' },
  { left: '86%', top: '48%', size: 3, delay: '0.3s', duration: '11s' },
  { left: '92%', top: '70%', size: 2, delay: '4.2s', duration: '8s' },
] as const;

export function HeroBackground({
  variant = 'hero',
  className,
}: {
  variant?: 'hero' | 'cta';
  className?: string;
}) {
  const isMobile = useIsMobile();

  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 -z-10 overflow-hidden', className)}
    >
      {/* 1. mesh — a intensidade cai no tema claro via --atmo */}
      <div className="absolute inset-0" style={{ opacity: 'var(--atmo, 1)' }}>
      <div
        className="absolute -left-[18%] -top-[28%] h-[46rem] w-[46rem] animate-mesh-drift rounded-pill blur-[120px]"
        style={{
          background: 'radial-gradient(circle, rgb(var(--glow) / 0.42), transparent 62%)',
          animationDelay: '0s',
        }}
      />
      <div
        className="absolute -right-[14%] top-[6%] h-[38rem] w-[38rem] animate-mesh-drift rounded-pill blur-[130px]"
        style={{
          background: 'radial-gradient(circle, rgb(var(--brand) / 0.34), transparent 65%)',
          animationDelay: '-7s',
        }}
      />
      <div
        className={cn(
          'absolute left-[38%] h-[32rem] w-[32rem] animate-mesh-drift rounded-pill blur-[120px]',
          variant === 'hero' ? 'bottom-[-18%]' : 'bottom-[-30%]',
        )}
        style={{
          background: 'radial-gradient(circle, rgb(var(--accent) / 0.16), transparent 68%)',
          animationDelay: '-14s',
        }}
      />

      </div>

      {/* 2. feixe direcional */}
      {!isMobile ? (
        <div
          className="absolute -top-1/3 left-[8%] h-[150%] w-[42rem] origin-top -rotate-[18deg] opacity-70"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgb(var(--glow) / 0.12) 45%, rgb(var(--glow) / 0.05) 60%, transparent)',
            maskImage: 'linear-gradient(to bottom, #000, transparent 78%)',
            WebkitMaskImage: 'linear-gradient(to bottom, #000, transparent 78%)',
          }}
        />
      ) : null}

      {/* 3. papel milimetrado */}
      <div className="grid-layer" />

      {/* 4. partículas */}
      {!isMobile
        ? PARTICLES.map((particle) => (
            <span
              key={`${particle.left}-${particle.top}`}
              className="absolute animate-float rounded-pill bg-brand-soft/70"
              style={{
                left: particle.left,
                top: particle.top,
                height: particle.size,
                width: particle.size,
                animationDelay: particle.delay,
                animationDuration: particle.duration,
                boxShadow: '0 0 12px rgb(var(--glow) / 0.8)',
              }}
            />
          ))
        : null}

      {/* 5. grão */}
      <div className="noise-layer" />

      {/* recorte inferior para o conteúdo seguinte respirar */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />
    </div>
  );
}
