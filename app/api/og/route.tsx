import { ImageResponse } from 'next/og';
import { site } from '@/content/site';

export const runtime = 'edge';

/**
 * Imagem de Open Graph gerada sob demanda.
 * Uso: /api/og?title=...&subtitle=...&tag=...
 * A composição segue a identidade do site: fundo azul-noite, halo direcional,
 * papel milimetrado e tipografia grande.
 *
 * Observação: o gerador (Satori) não lê .woff2, então a imagem usa a fonte
 * padrão embutida. As proporções foram ajustadas para isso.
 */
export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get('title') ?? site.tagline).slice(0, 110);
  const subtitle = (searchParams.get('subtitle') ?? site.description).slice(0, 170);
  const tag = (searchParams.get('tag') ?? 'softly.com.br').slice(0, 40);

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#05070F',
          backgroundImage:
            'radial-gradient(900px circle at 12% -10%, rgba(76,141,255,0.42), transparent 55%), radial-gradient(700px circle at 95% 110%, rgba(34,211,238,0.20), transparent 55%)',
          padding: '72px',
          position: 'relative',
        }}
      >
        {/* papel milimetrado */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(to right, rgba(130,165,255,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(130,165,255,0.07) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
            display: 'flex',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 18,
              border: '2px solid rgba(96,165,250,0.55)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#60A5FA',
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            S
          </div>
          <div
            style={{
              color: '#F5F8FF',
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              display: 'flex',
            }}
          >
            Softly
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 960 }}>
          <div
            style={{
              color: '#F5F8FF',
              fontSize: title.length > 60 ? 62 : 76,
              lineHeight: 1.05,
              letterSpacing: '-0.035em',
              fontWeight: 700,
              display: 'flex',
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 26,
              color: '#C3CBDD',
              fontSize: 28,
              lineHeight: 1.5,
              display: 'flex',
            }}
          >
            {subtitle}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              color: '#8892AC',
              fontSize: 22,
            }}
          >
            <div
              style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: '#22D3EE', display: 'flex' }}
            />
            {tag}
          </div>
          <div
            style={{
              display: 'flex',
              padding: '14px 26px',
              borderRadius: 999,
              backgroundColor: '#1B5CFF',
              color: '#FFFFFF',
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            Solicitar orçamento
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
