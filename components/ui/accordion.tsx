'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import { ChevronDown } from '@/components/icons/ui-icons';
import { cn } from '@/lib/utils';

export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = forwardRef<
  ElementRef<typeof AccordionPrimitive.Item>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(function AccordionItem({ className, ...props }, ref) {
  return (
    <AccordionPrimitive.Item
      ref={ref}
      className={cn(
        'group/item card-surface rounded-card transition-colors duration-300 ease-expo data-[state=open]:border-brand/45',
        className,
      )}
      {...props}
    />
  );
});

export const AccordionTrigger = forwardRef<
  ElementRef<typeof AccordionPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(function AccordionTrigger({ className, children, ...props }, ref) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          'flex flex-1 items-start justify-between gap-6 rounded-card px-6 py-5 text-left font-sans text-[1.0625rem] font-bold text-title transition-colors duration-micro ease-expo hover:text-brand-soft',
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown className="mt-0.5 h-5 w-5 shrink-0 text-brand-soft transition-transform duration-500 ease-expo group-data-[state=open]/item:rotate-180" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});

export const AccordionContent = forwardRef<
  ElementRef<typeof AccordionPrimitive.Content>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(function AccordionContent({ className, children, ...props }, ref) {
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn('px-6 pb-6 pt-0 text-body-sm text-body', className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
});
