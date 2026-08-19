import { LegalPage } from '@/components/legal-page';
import { privacyPolicy, privacyUpdatedAt } from '@/content/legal';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Política de Privacidade',
  description:
    'Como a Softly coleta, usa, compartilha e protege dados pessoais, conforme a Lei Geral de Proteção de Dados (LGPD).',
  path: '/politica-de-privacidade',
});

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Política de Privacidade"
      intro="Explicamos, em português claro, quais dados coletamos, por que coletamos, com quem compartilhamos e como você exerce seus direitos."
      updatedAt={privacyUpdatedAt}
      sections={privacyPolicy}
    />
  );
}
