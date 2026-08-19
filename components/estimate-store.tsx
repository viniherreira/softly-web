'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { EstimateResult } from '@/lib/estimate';

export type StoredEstimate = {
  total: number;
  min: number;
  max: number;
  weeks: number;
  summary: string;
};

type Store = {
  estimate: StoredEstimate | null;
  setEstimate: (estimate: StoredEstimate | null) => void;
};

const EstimateContext = createContext<Store>({ estimate: null, setEstimate: () => {} });

/** Liga a calculadora ao formulário de contato: a estimativa viaja junto do lead. */
export function EstimateProvider({ children }: { children: ReactNode }) {
  const [estimate, setEstimate] = useState<StoredEstimate | null>(null);
  const value = useMemo(() => ({ estimate, setEstimate }), [estimate]);
  return <EstimateContext.Provider value={value}>{children}</EstimateContext.Provider>;
}

export const useEstimateStore = (): Store => useContext(EstimateContext);

/** Texto legível enviado junto do lead (e-mail e WhatsApp). */
export const summarizeEstimate = (result: EstimateResult): string =>
  [
    result.type.label,
    `${result.breakdown[1]?.label ?? ''}`.trim(),
    result.chosenIntegrations.length
      ? `Integrações: ${result.chosenIntegrations.map((item) => item.label).join(', ')}`
      : 'Sem integrações',
    `Prazo ${result.timeline.label.toLowerCase()}`,
    `Acabamento ${result.craft.label.toLowerCase()}`,
    `~${result.weeks} semanas`,
  ]
    .filter(Boolean)
    .join(' · ');
