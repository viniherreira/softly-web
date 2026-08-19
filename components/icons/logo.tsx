import { cn } from '@/lib/utils';

/**
 * Marca da Softly.
 * O "S" é um traço único com `pathLength={1}` — isso normaliza o comprimento e
 * permite animar o desenho no preloader com stroke-dasharray: 1 → 0,
 * sem precisar medir o path em runtime.
 */
export function LogoMark({
  className,
  animated = false,
}: {
  className?: string;
  animated?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={cn('h-9 w-9', className)}
    >
      <defs>
        <linearGradient id="softly-mark" x1="8" y1="6" x2="40" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgb(var(--brand-soft))" />
          <stop offset="1" stopColor="rgb(var(--accent))" />
        </linearGradient>
      </defs>
      {/* Moldura: o "invólucro" do produto */}
      <rect
        x="1.75"
        y="1.75"
        width="44.5"
        height="44.5"
        rx="13"
        stroke="rgb(var(--border))"
        strokeWidth="1.5"
        className={cn(animated && 'origin-center')}
      />
      {/* Traço-S */}
      <path
        pathLength={1}
        d="M34 13.5C31 10 27.5 8.5 23.5 8.5c-6.5 0-11 3.6-11 9 0 5 3.4 7.6 10.4 9.2l2.6.6c7 1.6 10.4 4.2 10.4 9.2 0 5.4-4.5 9-11 9-4 0-7.5-1.5-10.5-5"
        stroke="url(#softly-mark)"
        strokeWidth="3.25"
        strokeLinecap="round"
        className={cn(animated && '[stroke-dasharray:1] [stroke-dashoffset:1]')}
      />
      {/* Ponto de sinal — o "está no ar" */}
      <circle cx="37.5" cy="10.5" r="3" fill="rgb(var(--accent))" />
    </svg>
  );
}

/** Marca + palavra. `compact` esconde a palavra (header depois do scroll). */
export function Logo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark className="h-8 w-8 shrink-0" />
      <span
        className={cn(
          'font-display text-[1.35rem] font-bold leading-none tracking-[-0.04em] text-title transition-all duration-500 ease-expo',
          compact ? 'max-w-0 -translate-x-1 opacity-0' : 'max-w-[7rem] translate-x-0 opacity-100',
        )}
        aria-hidden={compact}
      >
        Softly
      </span>
    </span>
  );
}
