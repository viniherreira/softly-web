import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

/**
 * Todos os valores de cor apontam para CSS variables definidas em app/globals.css.
 * Isso permite trocar o tema (dark ⇄ light) sem recompilar classes e proíbe,
 * na prática, cor hardcoded no JSX.
 */
const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
    './sections/**/*.{ts,tsx}',
    './content/**/*.{ts,tsx,mdx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', sm: '2rem', lg: '2.5rem', '2xl': '4rem' },
      screens: { '2xl': '1320px' },
    },
    extend: {
      /**
       * Escala de opacidade completa (0–100 em passos de 1).
       * Sem isso o Tailwind descarta silenciosamente modificadores fora da
       * escala padrão (ex.: `bg-bg/96`, `bg-brand/12`) e o estilo some.
       */
      opacity: Object.fromEntries(
        Array.from({ length: 101 }, (_, index) => [index, String(index / 100)]),
      ),
      colors: {
        // Paleta bruta (constante nos dois temas)
        ink: {
          900: 'rgb(var(--ink-900) / <alpha-value>)',
          800: 'rgb(var(--ink-800) / <alpha-value>)',
          700: 'rgb(var(--ink-700) / <alpha-value>)',
        },
        blue: {
          400: 'rgb(var(--blue-400) / <alpha-value>)',
          500: 'rgb(var(--blue-500) / <alpha-value>)',
          600: 'rgb(var(--blue-600) / <alpha-value>)',
        },
        cyan: { 400: 'rgb(var(--cyan-400) / <alpha-value>)' },
        slate: {
          300: 'rgb(var(--slate-300) / <alpha-value>)',
          500: 'rgb(var(--slate-500) / <alpha-value>)',
        },
        // Camada semântica (troca com o tema)
        bg: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        elevated: 'rgb(var(--surface-2) / <alpha-value>)',
        title: 'rgb(var(--text) / <alpha-value>)',
        body: 'rgb(var(--body) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        line: 'rgb(var(--border) / <alpha-value>)',
        brand: {
          DEFAULT: 'rgb(var(--brand) / <alpha-value>)',
          hover: 'rgb(var(--brand-hover) / <alpha-value>)',
          soft: 'rgb(var(--brand-soft) / <alpha-value>)',
        },
        accent: 'rgb(var(--accent) / <alpha-value>)',
        glow: 'rgb(var(--glow) / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-body)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Escala fluida — o número entre parênteses é o tamanho em desktop
        // NOTA DE CALIBRAGEM: a escala está afinada para a largura do Unbounded,
        // que é ~25% mais largo que o Clash Display. Ao trocar a fonte display
        // por Clash (ver lib/fonts.ts), suba cada teto em torno de 30%
        // (hero 4.75rem → 6.25rem, xl 3.1rem → 4rem, e assim por diante).
        'display-hero': ['clamp(2.3rem, 4.9vw, 4.25rem)', { lineHeight: '1.03', letterSpacing: '-0.04em', fontWeight: '700' }],
        'display-xl': ['clamp(1.9rem, 3.6vw, 3.1rem)', { lineHeight: '1.06', letterSpacing: '-0.035em', fontWeight: '700' }],
        'display-lg': ['clamp(1.6rem, 2.6vw, 2.25rem)', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display-md': ['clamp(1.3rem, 1.9vw, 1.7rem)', { lineHeight: '1.18', letterSpacing: '-0.024em', fontWeight: '500' }],
        'display-sm': ['clamp(1.1rem, 1.35vw, 1.28rem)', { lineHeight: '1.25', letterSpacing: '-0.018em', fontWeight: '500' }],
        lead: ['clamp(1.0625rem, 1.35vw, 1.25rem)', { lineHeight: '1.65' }],
        body: ['1.0625rem', { lineHeight: '1.7' }],
        'body-sm': ['0.9375rem', { lineHeight: '1.65' }],
        label: ['0.75rem', { lineHeight: '1', letterSpacing: '0.18em' }],
      },
      spacing: {
        section: 'var(--space-section)',
        gutter: 'var(--space-gutter)',
        18: '4.5rem',
        22: '5.5rem',
      },
      maxWidth: { content: '1180px', prose: '68ch', shell: '1320px' },
      borderRadius: { input: '14px', card: '20px', bento: '28px', pill: '999px' },
      boxShadow: {
        glow: '0 0 0 1px rgb(var(--glow) / 0.18), 0 18px 60px -18px rgb(var(--glow) / 0.55)',
        'glow-lg': '0 0 0 1px rgb(var(--glow) / 0.25), 0 40px 120px -30px rgb(var(--glow) / 0.65)',
        card: '0 1px 0 0 rgb(255 255 255 / 0.04) inset, 0 24px 60px -30px rgb(var(--ink-900) / 0.9)',
        float: '0 20px 50px -18px rgb(var(--ink-900) / 0.7)',
      },
      backgroundImage: {
        'grid-dots': 'radial-gradient(circle at 1px 1px, rgb(var(--grid) / 1) 1px, transparent 0)',
        'grid-lines':
          'linear-gradient(to right, rgb(var(--grid) / 1) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--grid) / 1) 1px, transparent 1px)',
        'line-glow': 'linear-gradient(90deg, transparent, rgb(var(--glow) / 0.55), transparent)',
        'brand-sheen': 'linear-gradient(135deg, rgb(var(--brand) / 1), rgb(var(--accent) / 1))',
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-soft': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      transitionDuration: { micro: '180ms', enter: '700ms', cinema: '1200ms' },
      keyframes: {
        marquee: { from: { transform: 'translate3d(0,0,0)' }, to: { transform: 'translate3d(-50%,0,0)' } },
        'mesh-drift': {
          '0%,100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '33%': { transform: 'translate3d(3%,-4%,0) scale(1.08)' },
          '66%': { transform: 'translate3d(-3%,3%,0) scale(0.96)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.85)', opacity: '0.65' },
          '70%,100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        'scroll-hint': {
          '0%,100%': { transform: 'translate3d(0,0,0)', opacity: '0.35' },
          '50%': { transform: 'translate3d(0,7px,0)', opacity: '1' },
        },
        'border-spin': { to: { transform: 'rotate(1turn)' } },
        shimmer: { '100%': { transform: 'translate3d(100%,0,0)' } },
        float: {
          '0%,100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-10px,0)' },
        },
        // Única exceção consciente à regra "só transform/opacity": o accordion
        // precisa da altura real do conteúdo (Radix expõe a variável abaixo).
        // É uma subárvore pequena e isolada — não causa reflow perceptível.
        'accordion-down': {
          from: { height: '0', opacity: '0' },
          to: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
          to: { height: '0', opacity: '0' },
        },
      },
      animation: {
        marquee: 'marquee var(--marquee-duration, 40s) linear infinite',
        'mesh-drift': 'mesh-drift 20s cubic-bezier(0.65, 0, 0.35, 1) infinite',
        'pulse-ring': 'pulse-ring 2.6s cubic-bezier(0.16, 1, 0.3, 1) infinite',
        'scroll-hint': 'scroll-hint 2.2s cubic-bezier(0.65, 0, 0.35, 1) infinite',
        'border-spin': 'border-spin 5s linear infinite',
        float: 'float 7s cubic-bezier(0.65, 0, 0.35, 1) infinite',
        'accordion-down': 'accordion-down 380ms cubic-bezier(0.16, 1, 0.3, 1)',
        'accordion-up': 'accordion-up 300ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [animate],
};

export default config;
