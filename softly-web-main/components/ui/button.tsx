'use client';

import { Slot, Slottable } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Botão da Softly.
 * Micro-interação: um disco de luz cresce do centro no hover (transform: scale,
 * nunca width/height), a sombra azul expande e a seta desliza 4px.
 */
const buttonVariants = cva(
  'group/btn relative isolate inline-flex select-none items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-pill font-medium leading-none transition-[transform,box-shadow,color,background-color,border-color] duration-micro ease-expo will-change-transform active:translate-y-px disabled:pointer-events-none disabled:opacity-55',
  {
    variants: {
      variant: {
        primary:
          'bg-brand text-white shadow-[0_10px_30px_-12px_rgb(var(--glow)/0.8)] hover:shadow-glow-lg',
        secondary:
          'glass text-title hover:border-brand/60 hover:text-white',
        outline:
          'border border-line bg-transparent text-title hover:border-brand/70',
        ghost: 'text-body hover:text-title',
        accent: 'bg-accent text-ink-900 hover:shadow-glow',
      },
      size: {
        sm: 'h-10 px-4 text-body-sm',
        md: 'h-12 px-6 text-body-sm',
        lg: 'h-14 px-8 text-body',
        xl: 'h-16 px-10 text-lead',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    /** Ícone à direita — recebe o deslize no hover automaticamente. */
    trailing?: ReactNode;
    leading?: ReactNode;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, asChild = false, trailing, leading, children, ...props },
  ref,
) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {/* preenchimento que cresce do centro */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 -z-10 origin-center scale-0 rounded-pill opacity-0 transition-[transform,opacity] duration-500 ease-expo group-hover/btn:scale-100 group-hover/btn:opacity-100',
          variant === 'primary' && 'bg-brand-hover',
          (variant === 'secondary' || variant === 'outline') && 'bg-brand/12',
          variant === 'ghost' && 'bg-brand/10',
          variant === 'accent' && 'bg-white/25',
        )}
      />
      {leading}
      {/* Slottable é o que faz `asChild` funcionar com irmãos ao redor:
          o Radix funde as classes no elemento filho (ex.: <Link>) e mantém
          o preenchimento e a seta como filhos dele. */}
      <Slottable>{children}</Slottable>
      {trailing ? (
        <span className="transition-transform duration-300 ease-expo group-hover/btn:translate-x-1">
          {trailing}
        </span>
      ) : null}
    </Comp>
  );
});

export { buttonVariants };
