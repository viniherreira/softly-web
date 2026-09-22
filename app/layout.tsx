import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { EstimateProvider } from '@/components/estimate-store';
import { Analytics } from '@/components/layout/analytics';
import { CookieBanner } from '@/components/layout/cookie-banner';
import { FloatingActions } from '@/components/layout/floating-actions';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { PageTransition } from '@/components/motion/page-transition';
import { CinematicIntro } from '@/components/motion/cinematic-intro';
import { ScrollProgressBar } from '@/components/motion/scroll-progress';
import { SmoothScrollProvider } from '@/components/motion/smooth-scroll';
import { site } from '@/content/site';
import { fontVariables } from '@/lib/fonts';
import { baseUrl, buildMetadata } from '@/lib/seo';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl), // baseUrl já vem normalizado por lib/seo.ts
  ...buildMetadata(),
  applicationName: site.name,
  authors: [{ name: site.name, url: baseUrl }],
  creator: site.name,
  publisher: site.legalName,
  category: 'technology',
  keywords: [
    'desenvolvimento de sites',
    'criação de aplicativos',
    'sistemas sob medida',
    'automação de processos',
    'inteligência artificial para empresas',
    'agência de tecnologia',
    site.contact.city,
  ],
  formatDetection: { telephone: false, address: false, email: false },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'dark',
  themeColor: '#0E0E11',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={fontVariables}>
      <body className="min-h-screen bg-bg font-sans text-body antialiased">
        <SmoothScrollProvider>
          <EstimateProvider>
              <CinematicIntro />
              <ScrollProgressBar />

              <a href="#conteudo" className="skip-link">
                Pular para o conteúdo
              </a>

              <Header />

              <main id="conteudo">
                <PageTransition>{children}</PageTransition>
              </main>

              <Footer />
              <FloatingActions />
              <CookieBanner />
            </EstimateProvider>
          </SmoothScrollProvider>

        <Analytics />
      </body>
    </html>
  );
}
