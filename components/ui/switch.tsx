'use client';

import * as SwitchPrimitive from '@radix-ui/react-switch';
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import { cn } from '@/lib/utils';

export const Switch = forwardRef<
  ElementRef<typeof SwitchPrimitive.Root>,
  ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(function Switch({ className, ...props }, ref) {
  return (
    <SwitchPrimitive.Root
      ref={ref}
      className={cn(
        'relative inline-flex h-8 w-[3.75rem] shrink-0 items-center rounded-pill border border-line bg-surface/80 p-1 transition-colors duration-300 ease-expo data-[state=checked]:border-brand/60 data-[state=checked]:bg-brand/25',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="pointer-events-none block h-6 w-6 rounded-pill bg-brand shadow-[0_0_18px_rgb(var(--glow)/0.75)] transition-transform duration-300 ease-expo will-change-transform data-[state=checked]:translate-x-7 data-[state=unchecked]:translate-x-0" />
    </SwitchPrimitive.Root>
  );
});
