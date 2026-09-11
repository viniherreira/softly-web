import { ImageResponse } from 'next/og';

/** Ícone para iOS gerado no build (PNG 180×180) — mesma marca do favicon. */
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  /* O símbolo vai como SVG inline (mesmos paths de components/icons/logo.tsx)
     em vez de a letra "S" de uma fonte: o ImageResponse não carrega a fonte
     display do site, então o texto sairia em Helvetica — outra marca. */
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0D90FB',
        }}
      >
        <svg width="104" height="113" viewBox="0 0 100 108.95">
          <path
            d="M29.23 0L100 0L74.69 23.5L36.08 23.5L23.36 34.55L23.36 40.98L46.85 60.98L46.85 66.43L31.75 78.74L0 50.49L0 24.62L25.87 0Z"
            fill="#fff"
          />
          <path
            d="M66.85 29.23L100 57.76L100 85.31L73.43 108.95L0 108.95L25.87 85.31L64.62 85.31L75.8 75.8L75.8 70.35L51.47 48.53L51.47 42.66Z"
            fill="#fff"
          />
        </svg>
      </div>
    ),
    size,
  );
}
