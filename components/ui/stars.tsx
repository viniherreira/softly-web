import { Star } from '@/components/icons/ui-icons';
import { cn } from '@/lib/utils';

/** Avaliação em estrelas — azul da marca, nunca amarelo. */
export function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span
      className={cn('inline-flex items-center gap-1', className)}
      role="img"
      aria-label={`Avaliação ${rating} de 5`}
    >
      {[1, 2, 3, 4, 5].map((index) => (
        <Star
          key={index}
          className={cn('h-3.5 w-3.5', index <= rating ? 'text-brand-soft' : 'text-line')}
        />
      ))}
    </span>
  );
}
