import localFont from 'next/font/local';

/**
 * Fontes auto-hospedadas (nenhuma requisição a terceiros, nenhum FOIT).
 * Os arquivos vivem em `app/fonts` e são gerados por `npm run fonts:sync`.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * TROCA PARA CLASH DISPLAY + SATOSHI (direção original)
 * A Fontshare não é redistribuível via npm. Quando tiver os arquivos licenciados:
 *   1. coloque ClashDisplay-Medium.woff2 / ClashDisplay-Bold.woff2 e
 *      Satoshi-Regular.woff2 / Satoshi-Medium.woff2 / Satoshi-Bold.woff2 em app/fonts
 *   2. troque os `src` abaixo por esses arquivos
 *   3. remova @fontsource/unbounded e @fontsource/manrope do package.json
 * Nenhum outro arquivo do projeto precisa mudar — tudo consome as CSS variables.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const fontDisplay = localFont({
  src: [
    { path: '../app/fonts/Display-500.woff2', weight: '500', style: 'normal' },
    { path: '../app/fonts/Display-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-display',
  display: 'swap',
  preload: true,
  fallback: ['Georgia', 'serif'],
  adjustFontFallback: false,
});

export const fontBody = localFont({
  src: [
    { path: '../app/fonts/Body-400.woff2', weight: '400', style: 'normal' },
    { path: '../app/fonts/Body-500.woff2', weight: '500', style: 'normal' },
    { path: '../app/fonts/Body-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-body',
  display: 'swap',
  preload: true,
  fallback: ['Georgia', 'serif'],
  adjustFontFallback: false,
});

export const fontMono = localFont({
  src: [
    { path: '../app/fonts/Mono-400.woff2', weight: '400', style: 'normal' },
    { path: '../app/fonts/Mono-500.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-mono',
  display: 'swap',
  preload: false,
  fallback: ['ui-monospace', 'monospace'],
  adjustFontFallback: false,
});

export const fontVariables = `${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable}`;
