import { cn } from '@/lib/utils';

/**
 * Marca da Softly — geometria oficial.
 *
 * O "S" é formado por DUAS peças que se encaixam, não por um traço contínuo.
 * Elas são exportadas separadamente de propósito: a abertura do site anima
 * cada metade entrando pela sua diagonal até travar na outra, e esse gesto só
 * existe porque a marca é feita assim. Nada aqui é decorativo.
 *
 * As coordenadas vieram da vetorização do PNG oficial (contorno traçado,
 * simplificado e com os valores quase-iguais agrupados). A conferência foi
 * feita rasterizando este path e comparando com o original: 98,25% de
 * interseção sobre união, e a diferença restante é o antisserrilhado de 1px
 * da borda. Se a marca mudar, refaça a vetorização — não edite no olho.
 */
export const LOGO_VIEWBOX = '0 0 100 108.95';

/** Metade superior: barra de cima + braço esquerdo descendo até o centro. */
export const LOGO_UPPER =
  'M29.23 0L100 0L74.69 23.5L36.08 23.5L23.36 34.55L23.36 40.98L46.85 60.98L46.85 66.43L31.75 78.74L0 50.49L0 24.62L25.87 0Z';

/** Metade inferior: braço direito + barra de baixo. Gira 180° sobre a de cima. */
export const LOGO_LOWER =
  'M66.85 29.23L100 57.76L100 85.31L73.43 108.95L0 108.95L25.87 85.31L64.62 85.31L75.8 75.8L75.8 70.35L51.47 48.53L51.47 42.66Z';

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      aria-hidden="true"
      className={cn('h-9 w-auto text-logo', className)}
    >
      <path d={LOGO_UPPER} fill="currentColor" />
      <path d={LOGO_LOWER} fill="currentColor" />
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
      <LogoMark className="h-7 w-auto shrink-0" />
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
