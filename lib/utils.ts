import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * O tailwind-merge precisa conhecer os tokens customizados do projeto.
 *
 * Sem isso ele classifica `text-body-sm` (tamanho) e `text-white` (cor) no
 * mesmo grupo — porque nenhum dos dois casa com a escala padrão — e descarta
 * o primeiro. Foi exatamente esse o bug que deixava o texto dos botões com a
 * cor herdada em vez de branco.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'display-hero',
            'display-xl',
            'display-lg',
            'display-md',
            'display-sm',
            'lead',
            'body',
            'body-sm',
            'label',
          ],
        },
      ],
      'text-color': [
        {
          text: [
            'title',
            'muted',
            'line',
            'bg',
            'surface',
            'elevated',
            'brand',
            'brand-hover',
            'brand-soft',
            'accent',
            'glow',
          ],
        },
      ],
      rounded: [{ rounded: ['input', 'card', 'bento', 'pill'] }],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Interpola um valor entre dois limites. Usado em parallax e progressos. */
export const lerp = (start: number, end: number, amount: number): number =>
  start * (1 - amount) + end * amount;

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/** Arredonda para o múltiplo mais próximo — mantém o preço "redondo". */
export const roundTo = (value: number, step: number): number =>
  Math.round(value / step) * step;

export const slugify = (input: string): string =>
  input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
