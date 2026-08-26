import type { Metadata } from 'next';
import { site } from '@/content/site';

/**
 * Normaliza um candidato a URL base.
 * Devolve null quando não dá para aproveitar, para a busca seguir na próxima
 * fonte em vez de estourar. Cobre os dois casos que derrubam o build:
 *  - variável cadastrada vazia (o `??` não pega string vazia);
 *  - domínio sem protocolo, como a Vercel entrega em VERCEL_URL.
 */
const normalizeBaseUrl = (value: string | undefined | null): string | null => {
  const raw = value?.trim();
  if (!raw) return null;
  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    return new URL(candidate).origin;
  } catch {
    return null;
  }
};

/**
 * URL pública do site, em ordem de preferência:
 *   1. NEXT_PUBLIC_SITE_URL — o domínio final, quando configurado
 *   2. domínio de produção da Vercel — para previews e primeiro deploy
 *   3. o valor de content/site.ts
 *   4. localhost — último recurso, para o build nunca falhar por isto
 */
export const baseUrl =
  normalizeBaseUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
  normalizeBaseUrl(process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL) ??
  normalizeBaseUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
  normalizeBaseUrl(process.env.VERCEL_URL) ??
  normalizeBaseUrl(site.url) ??
  'http://localhost:3000';

export const absoluteUrl = (path = '/'): string => {
  try {
    return new URL(path, baseUrl).toString();
  } catch {
    return baseUrl;
  }
};

type SeoInput = {
  title?: string;
  description?: string;
  path?: string;
  /** Caminho de imagem OG própria. Sem isso, usa a imagem gerada em /api/og. */
  image?: string;
  ogTitle?: string;
  ogSubtitle?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  noIndex?: boolean;
};

/** Monta o metadata de qualquer rota mantendo OG, Twitter e canonical em sincronia. */
export function buildMetadata({
  title,
  description = site.description,
  path = '/',
  image,
  ogTitle,
  ogSubtitle,
  type = 'website',
  publishedTime,
  noIndex = false,
}: SeoInput = {}): Metadata {
  const fullTitle = title ? `${title} · ${site.name}` : `${site.name} — ${site.tagline}`;
  const ogImage =
    image ??
    `/api/og?title=${encodeURIComponent(ogTitle ?? title ?? site.name)}&subtitle=${encodeURIComponent(
      ogSubtitle ?? description.slice(0, 120),
    )}`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: absoluteUrl(path) },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      type,
      url: absoluteUrl(path),
      siteName: site.name,
      title: fullTitle,
      description,
      locale: 'pt_BR',
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}
