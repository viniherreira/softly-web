/** Tipagem das tags de terceiros injetadas via next/script. */
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[]; loaded?: boolean };
    dataLayer?: unknown[];
  }
}

export {};
