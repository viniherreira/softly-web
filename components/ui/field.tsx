'use client';

import { forwardRef, useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/**
 * Campo com label flutuante e borda que ganha gradiente no foco.
 * A label usa `peer-placeholder-shown` — sem JS de estado, sem re-render.
 */
type BaseProps = {
  label: string;
  error?: string | undefined;
  hint?: string;
  className?: string;
};

export const Field = forwardRef<
  HTMLInputElement,
  BaseProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'placeholder'>
>(function Field({ label, error, hint, className, id, ...props }, ref) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'border-sheen relative rounded-input transition-colors duration-micro ease-expo',
          error && 'ring-1 ring-red-400/60',
        )}
      >
        <input
          ref={ref}
          id={inputId}
          placeholder=" "
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className="peer h-16 w-full rounded-input border border-line bg-surface/50 px-4 pb-2 pt-7 text-body text-title outline-none transition-colors duration-micro ease-expo placeholder-shown:pt-4 focus:border-brand/70"
          {...props}
        />
        <label
          htmlFor={inputId}
          className="pointer-events-none absolute left-4 top-2.5 origin-left font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-muted transition-all duration-300 ease-expo peer-placeholder-shown:top-5 peer-placeholder-shown:font-sans peer-placeholder-shown:text-body-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2.5 peer-focus:font-mono peer-focus:text-[0.6875rem] peer-focus:uppercase peer-focus:tracking-[0.16em] peer-focus:text-brand-soft"
        >
          {label}
        </label>
      </div>
      {error ? (
        <p id={`${inputId}-error`} role="alert" className="mt-2 text-body-sm text-red-300">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="mt-2 text-body-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
});

export const TextareaField = forwardRef<
  HTMLTextAreaElement,
  BaseProps & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'placeholder'>
>(function TextareaField({ label, error, hint, className, id, rows = 4, ...props }, ref) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className={cn('relative', className)}>
      <div className={cn('border-sheen relative rounded-input', error && 'ring-1 ring-red-400/60')}>
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          placeholder=" "
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className="peer w-full resize-none rounded-input border border-line bg-surface/50 px-4 pb-3 pt-7 text-body text-title outline-none transition-colors duration-micro ease-expo focus:border-brand/70"
          {...props}
        />
        <label
          htmlFor={inputId}
          className="pointer-events-none absolute left-4 top-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-muted transition-colors duration-300 ease-expo peer-focus:text-brand-soft"
        >
          {label}
        </label>
      </div>
      {error ? (
        <p id={`${inputId}-error`} role="alert" className="mt-2 text-body-sm text-red-300">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="mt-2 text-body-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
});

/** Campo isca para robôs: invisível para humanos, obrigatório vazio na API. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute left-[-9999px] h-0 w-0 overflow-hidden">
      <label htmlFor="website">Não preencha este campo</label>
      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}
