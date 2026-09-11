'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'softly:theme';

type ThemeApi = { theme: Theme; setTheme: (theme: Theme) => void; toggle: () => void };

const ThemeContext = createContext<ThemeApi>({
  theme: 'dark',
  setTheme: () => {},
  toggle: () => {},
});

export const useTheme = (): ThemeApi => useContext(ThemeContext);

/**
 * Script injetado antes da hidratação: lê a preferência salva ou, na falta
 * dela, prefers-color-scheme. Evita qualquer flash de tema errado.
 * Precisa ser string crua porque roda antes do React.
 */
export const themeInitScript = `(function(){try{var s=localStorage.getItem('${STORAGE_KEY}');var m=window.matchMedia('(prefers-color-scheme: light)').matches;var t=s==='light'||s==='dark'?s:(m?'light':'dark');document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme');
    if (current === 'light' || current === 'dark') setThemeState(current);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* modo privado: mantém só na sessão */
    }
  }, []);

  const toggle = useCallback(
    () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    [setTheme, theme],
  );

  // Segue o sistema enquanto o usuário não escolher manualmente.
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = (event: MediaQueryListEvent) => {
      try {
        if (localStorage.getItem(STORAGE_KEY)) return;
      } catch {
        /* segue o sistema */
      }
      const next: Theme = event.matches ? 'light' : 'dark';
      setThemeState(next);
      document.documentElement.setAttribute('data-theme', next);
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>{children}</ThemeContext.Provider>
  );
}
