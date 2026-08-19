/**
 * Camada única de analytics. Nada dispara antes do consentimento LGPD
 * (o banner grava a escolha em localStorage e emite `softly:consent`).
 *
 * Eventos disparados no site:
 *  - cta_click            → qualquer CTA principal
 *  - whatsapp_click       → botão flutuante e links de WhatsApp
 *  - form_submit          → envio do formulário de contato
 *  - form_success         → resposta 200 da API
 *  - calculator_use       → alteração de qualquer opção da calculadora
 *  - calculator_lead      → "Receber proposta detalhada"
 *  - pricing_toggle       → troca mensal/anual
 *  - project_view         → abertura de um case study
 */
export type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

export const CONSENT_KEY = 'softly:consent';
export const CONSENT_EVENT = 'softly:consent';

export const defaultConsent: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
};

export function readConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
    };
  } catch {
    return null;
  }
}

export function writeConsent(consent: ConsentState): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  window.dispatchEvent(new CustomEvent<ConsentState>(CONSENT_EVENT, { detail: consent }));
  applyConsentToTags(consent);
}

/** Google Consent Mode v2 + opt-out do Meta Pixel. */
export function applyConsentToTags(consent: ConsentState): void {
  if (typeof window === 'undefined') return;
  window.gtag?.('consent', 'update', {
    analytics_storage: consent.analytics ? 'granted' : 'denied',
    ad_storage: consent.marketing ? 'granted' : 'denied',
    ad_user_data: consent.marketing ? 'granted' : 'denied',
    ad_personalization: consent.marketing ? 'granted' : 'denied',
  });
  if (consent.marketing) window.fbq?.('consent', 'grant');
  else window.fbq?.('consent', 'revoke');
}

export type AnalyticsEvent =
  | 'cta_click'
  | 'whatsapp_click'
  | 'form_submit'
  | 'form_success'
  | 'form_error'
  | 'calculator_use'
  | 'calculator_lead'
  | 'pricing_toggle'
  | 'project_view'
  | 'newsletter_submit';

export function track(event: AnalyticsEvent, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return;
  const consent = readConsent();

  if (consent?.analytics) {
    window.gtag?.('event', event, params);
  }
  if (consent?.marketing) {
    const metaEvent = event === 'form_success' ? 'Lead' : 'CustomizeProduct';
    window.fbq?.('trackCustom', event, params);
    if (event === 'form_success') window.fbq?.('track', metaEvent, params);
  }

  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.debug(`[analytics] ${event}`, params);
  }
}
