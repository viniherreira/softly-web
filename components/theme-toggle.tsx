'use client';

import { Moon, Sun } from '@/components/icons/ui-icons';
import { useTheme } from '@/components/theme-provider';
import { useMounted } from '@/hooks/use-mounted';
import { cn } from '@/lib/utils';

/** Alterna claro/escuro. A preferência fica salva e respeita o sistema. */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const mounted = useMounted();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
      className={cn(
        'relative grid h-11 w-11 place-items-center rounded-pill border border-line bg-surface/60 text-body transition-colors duration-micro ease-expo hover:border-brand/60 hover:text-title',
        className,
      )}
    >
      <span className="sr-only">Alternar tema</span>
      <Sun
        className={cn(
          'absolute h-[18px] w-[18px] transition-all duration-500 ease-expo',
          mounted && theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-50 opacity-0',
        )}
      />
      <Moon
        className={cn(
          'absolute h-[18px] w-[18px] transition-all duration-500 ease-expo',
          mounted && theme === 'light' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0',
        )}
      />
    </button>
  );
}
