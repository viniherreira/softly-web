import type { SVGProps } from 'react';

/**
 * Ícones de interface desenhados à mão (nenhuma biblioteca genérica).
 * Todos herdam `currentColor` e têm traço 1.6 para casar com a tipografia.
 */
type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const;

export const ArrowRight = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M4 12h15" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

export const ArrowUpRight = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </svg>
);

export const ArrowUp = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 19V5" />
    <path d="m6 11 6-6 6 6" />
  </svg>
);

export const ChevronDown = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const Check = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="m4 12.5 5 5L20 6.5" />
  </svg>
);

export const Close = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M6 6 18 18M18 6 6 18" />
  </svg>
);

export const Minus = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M5 12h14" />
  </svg>
);

/** Estrela da avaliação — desenhada com cantos suaves, nunca amarela. */
export const Star = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12 2.6c.4 0 .76.23.93.6l2.3 4.9 5.2.72c.85.12 1.19 1.17.56 1.76l-3.79 3.56.92 5.2c.15.85-.75 1.5-1.5 1.09L12 17.94l-4.62 2.5c-.75.4-1.65-.25-1.5-1.1l.92-5.2-3.79-3.55c-.63-.6-.29-1.64.56-1.76l5.2-.73 2.3-4.9c.17-.36.53-.6.93-.6Z" />
  </svg>
);

export const Quote = (props: IconProps) => (
  <svg viewBox="0 0 48 40" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M0 40V22.4C0 9.9 6.3 2.4 18.2 0l2 5.6C13 7.6 9.4 11.6 9.4 17.6h8.2V40H0Zm26.4 0V22.4C26.4 9.9 32.7 2.4 44.6 0l2 5.6c-7.2 2-10.8 6-10.8 12h8.2V40H26.4Z" />
  </svg>
);

export const Whatsapp = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.94.56 3.75 1.53 5.28L2 22.4l5.44-1.7a9.8 9.8 0 0 0 4.6 1.16h.01c5.43 0 9.84-4.4 9.84-9.84C21.89 6.4 17.48 2 12.04 2Zm0 17.9h-.01a8.2 8.2 0 0 1-4.15-1.13l-.3-.18-3.08.96.98-3-.2-.31a8.13 8.13 0 0 1-1.25-4.36c0-4.51 3.68-8.18 8.2-8.18 2.19 0 4.25.86 5.8 2.4a8.13 8.13 0 0 1 2.4 5.79c0 4.51-3.68 8.18-8.2 8.18Zm4.5-6.13c-.25-.13-1.46-.72-1.68-.8-.23-.08-.4-.13-.56.12-.16.25-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.13-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.15-.26-.02-.4.1-.52.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.09-.16.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.84-.2-.48-.4-.42-.56-.43h-.47c-.16 0-.42.06-.64.31-.22.25-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.19 1.1.16 1.52.1.46-.07 1.46-.6 1.66-1.18.21-.58.21-1.07.15-1.17-.06-.11-.23-.17-.48-.29Z" />
  </svg>
);

export const Instagram = (props: IconProps) => (
  <svg {...base} {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5.4" />
    <circle cx="12" cy="12" r="4.1" />
    <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

export const Linkedin = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M6.94 8.5v11.2H3.2V8.5h3.74ZM5.07 2.8c1.2 0 2.17.98 2.17 2.17 0 1.2-.97 2.17-2.17 2.17a2.17 2.17 0 1 1 0-4.34ZM20.8 13.4v6.3h-3.73v-5.87c0-1.4-.5-2.35-1.75-2.35-.96 0-1.53.64-1.78 1.26-.09.22-.11.53-.11.85v6.11H9.7s.05-9.92 0-10.95h3.73v1.55c.5-.76 1.38-1.85 3.36-1.85 2.45 0 4.02 1.6 4.02 5.05Z" />
  </svg>
);

export const Mail = (props: IconProps) => (
  <svg {...base} {...props}>
    <rect x="2.75" y="4.75" width="18.5" height="14.5" rx="3" />
    <path d="m4 8 7.1 4.7a1.6 1.6 0 0 0 1.8 0L20 8" />
  </svg>
);

export const Pin = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);

export const Drag = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M9 7 5 12l4 5M15 7l4 5-4 5" />
  </svg>
);

export const Sun = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2.6v2.2M12 19.2v2.2M4.3 4.3l1.6 1.6M18.1 18.1l1.6 1.6M2.6 12h2.2M19.2 12h2.2M4.3 19.7l1.6-1.6M18.1 5.9l1.6-1.6" />
  </svg>
);

export const Moon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M20.4 13.6A8.4 8.4 0 0 1 10.4 3.6a8.4 8.4 0 1 0 10 10Z" />
  </svg>
);

export const Menu = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M4 8h16M4 16h11" />
  </svg>
);

export const Play = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M8.4 5.6a1 1 0 0 1 1.53-.85l8.2 5.15a1.3 1.3 0 0 1 0 2.2l-8.2 5.15A1 1 0 0 1 8.4 16.4V5.6Z" />
  </svg>
);

export const Spark = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 3v5M12 16v5M3 12h5M16 12h5M6.3 6.3l3 3M14.7 14.7l3 3M17.7 6.3l-3 3M9.3 14.7l-3 3" />
  </svg>
);
