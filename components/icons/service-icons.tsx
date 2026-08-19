import type { ServiceIcon } from '@/content/services';
import { cn } from '@/lib/utils';

/**
 * Ícones de serviço desenhados especificamente para este site (nada de pacote
 * genérico de linha). Cada um tem uma peça que se move no hover do card —
 * a animação usa apenas transform/opacity e é disparada por `group-hover`,
 * então não custa JS e some sozinha em prefers-reduced-motion.
 */
const wrap = 'h-11 w-11 text-brand-soft';
const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;
const accent = 'text-accent';
const move = 'transition-transform duration-700 ease-expo';

function Site({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 44" aria-hidden="true" className={cn(wrap, className)}>
      <rect x="4" y="7" width="36" height="27" rx="4" {...stroke} />
      <path d="M4 14.5h36" {...stroke} />
      <circle cx="9" cy="10.8" r="1.1" fill="currentColor" />
      <circle cx="13" cy="10.8" r="1.1" fill="currentColor" />
      {/* bloco de conteúdo que sobe no hover */}
      <g className={cn(move, 'group-hover:-translate-y-1')}>
        <rect x="9" y="19" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55" />
        <rect x="9" y="24.5" width="21" height="2.2" rx="1.1" fill="currentColor" opacity="0.28" />
      </g>
      {/* cursor / clique */}
      <g className={cn(accent, move, 'group-hover:translate-x-1 group-hover:translate-y-1')}>
        <path d="m30 24 7 4.6-3.1.9-1 3.2L30 24Z" fill="currentColor" />
      </g>
      <path d="M16 34v3.5M28 34v3.5M13 37.5h18" {...stroke} opacity="0.5" />
    </svg>
  );
}

function App({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 44" aria-hidden="true" className={cn(wrap, className)}>
      <rect x="5" y="8" width="21" height="28" rx="4" {...stroke} opacity="0.5" />
      <g className={cn(move, 'group-hover:-translate-y-1 group-hover:translate-x-1')}>
        <rect
          x="18"
          y="13"
          width="21"
          height="25"
          rx="4.5"
          {...stroke}
          className="fill-[rgb(var(--surface))]"
        />
        <path d="M18 19h21" {...stroke} />
        <rect x="22" y="23.5" width="6" height="6" rx="2" fill="currentColor" opacity="0.5" />
        <rect x="30.5" y="23.5" width="6" height="6" rx="2" fill="currentColor" opacity="0.25" />
        <path d="M26 34.5h5" {...stroke} className={accent} />
      </g>
    </svg>
  );
}

function System({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 44" aria-hidden="true" className={cn(wrap, className)}>
      <path d="M22 5 38 13l-16 8L6 13l16-8Z" {...stroke} />
      <path
        d="M6 22l16 8 16-8"
        {...stroke}
        className={cn(accent, move, 'group-hover:translate-y-[3px]')}
      />
      <path
        d="M6 30.5l16 8 16-8"
        {...stroke}
        opacity="0.55"
        className={cn(move, 'group-hover:translate-y-[6px]')}
      />
    </svg>
  );
}

function Automation({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 44" aria-hidden="true" className={cn(wrap, className)}>
      <rect x="4" y="6" width="13" height="10" rx="3" {...stroke} />
      <rect x="27" y="28" width="13" height="10" rx="3" {...stroke} />
      <path d="M10.5 16v9a5 5 0 0 0 5 5h13" {...stroke} strokeDasharray="3 3.5" />
      {/* pacote que percorre o fluxo no hover */}
      <circle
        cx="10.5"
        cy="20"
        r="2.4"
        fill="currentColor"
        className={cn(accent, 'transition-all ease-expo [transition-duration:900ms] group-hover:translate-x-[19px] group-hover:translate-y-[10px]')}
      />
      <path d="M31 32.5h5M31 35h3" {...stroke} opacity="0.6" />
      <path d="M8 10.5h5M8 13h3" {...stroke} opacity="0.6" />
    </svg>
  );
}

function Ai({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 44" aria-hidden="true" className={cn(wrap, className)}>
      <rect
        x="14"
        y="14"
        width="16"
        height="16"
        rx="5"
        {...stroke}
        className={cn(move, 'origin-center group-hover:rotate-45')}
      />
      <circle cx="22" cy="22" r="3.2" fill="currentColor" className={accent} />
      <g className={cn(move, 'origin-center group-hover:rotate-90')} opacity="0.85">
        <circle cx="22" cy="6.5" r="2.2" fill="currentColor" />
        <circle cx="37.5" cy="22" r="2.2" fill="currentColor" />
        <circle cx="22" cy="37.5" r="2.2" fill="currentColor" />
        <circle cx="6.5" cy="22" r="2.2" fill="currentColor" />
      </g>
      <path d="M22 8.7v5.3M35.3 22H30M22 35.3V30M8.7 22H14" {...stroke} opacity="0.45" />
    </svg>
  );
}

function Performance({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 44" aria-hidden="true" className={cn(wrap, className)}>
      <path d="M5 33a17 17 0 1 1 34 0" {...stroke} />
      <path d="M5 33h5M34 33h5M22 12v4" {...stroke} opacity="0.5" />
      {/* ponteiro que gira no hover */}
      <g className={cn(move, 'origin-[22px_33px] -rotate-[38deg] group-hover:rotate-[34deg]')}>
        <path d="M22 33 30 22" {...stroke} className={accent} strokeWidth={2.2} />
      </g>
      <circle cx="22" cy="33" r="2.6" fill="currentColor" />
    </svg>
  );
}

const MAP: Record<ServiceIcon, (props: { className?: string }) => JSX.Element> = {
  site: Site,
  app: App,
  system: System,
  automation: Automation,
  ai: Ai,
  performance: Performance,
};

export function ServiceGlyph({ name, className }: { name: ServiceIcon; className?: string }) {
  const Glyph = MAP[name];
  return <Glyph className={className} />;
}
