import type { Metadata } from 'next';
import { site } from '@/content/site';

export const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? site.url;

export const absoluteUrl = (path = '/'): string =>
  new URL(path, baseUrl).toString();

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
