import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 whitespace-nowrap rounded-pill border font-mono text-[0.6875rem] uppercase leading-none tracking-[0.16em]',
  {
    variants: {
      variant: {
        default: 'border-line bg-surface/60 px-3 py-2 text-muted',
        brand: 'border-brand/40 bg-brand/12 px-3 py-2 text-brand-soft',
        accent: 'border-accent/40 bg-accent/10 px-3 py-2 text-accent',
        solid: 'border-transparent bg-brand px-3 py-2 text-white',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
