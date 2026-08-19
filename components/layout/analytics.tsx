'use client';

import Script from 'next/script';

/**
 * GA4 + Meta Pixel.
 *
 * - Carregam com `afterInteractive`, então não competem com o LCP.
 * - Só entram no HTML se as variáveis de ambiente existirem.
 * - O Consent Mode v2 já sobe negado; o banner LGPD é quem libera.
 *   (ver lib/analytics.ts → applyConsentToTags)
 */
export function Analytics() {
  const ga = process.env.NEXT_PUBLIC_GA_ID;
  const pixel = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  return (
    <>
      {ga ? (
        <>
          <Script
            id="ga-consent-default"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = window.gtag || gtag;
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 1500
});
gtag('js', new Date());
gtag('config', '${ga}', { anonymize_ip: true, send_page_view: true });`,
            }}
          />
          <Script
            id="ga-src"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}
          />
        </>
      ) : null}

      {pixel ? (
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('consent', 'revoke');
fbq('init', '${pixel}');
fbq('track', 'PageView');`,
          }}
        />
      ) : null}
    </>
  );
}
