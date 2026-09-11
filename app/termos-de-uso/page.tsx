import { LegalPage } from '@/components/legal-page';
import { termsOfUse, termsUpdatedAt } from '@/content/legal';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Termos de Uso',
  description: 'Regras de uso do site da Softly, propriedade intelectual e limites das estimativas publicadas.',
  path: '/termos-de-uso',
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Termos de Uso"
      intro="As regras de uso deste site. O contrato de cada projeto é um documento separado e sempre prevalece sobre este."
      updatedAt={termsUpdatedAt}
      sections={termsOfUse}
    />
  );
}
