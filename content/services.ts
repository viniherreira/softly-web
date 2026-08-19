/**
 * Serviços exibidos no bento grid da home.
 * `size` controla a área do card no grid (o primeiro card é o destaque).
 * `icon` casa com a chave em components/icons/service-icons.tsx.
 */
export type ServiceIcon =
  | 'site'
  | 'app'
  | 'system'
  | 'automation'
  | 'ai'
  | 'performance';

export type Service = {
  id: string;
  icon: ServiceIcon;
  title: string;
  description: string;
  deliverables: string[];
  size: 'featured' | 'wide' | 'default';
  href: string;
};

export const services: Service[] = [
  {
    id: 'sites',
    icon: 'site',
    title: 'Sites e landing pages',
    description:
      'Páginas que carregam rápido, aparecem no Google e transformam visita em contato. Nada de site bonito que não vende.',
    deliverables: [
      'Design exclusivo, sem template',
      'Carregamento abaixo de 2s',
      'SEO técnico e dados estruturados',
      'Painel para você editar o conteúdo',
    ],
    size: 'featured',
    href: '/#contato',
  },
  {
    id: 'apps',
    icon: 'app',
    title: 'Aplicativos web e mobile',
    description:
      'Um app que seus clientes usam sem manual. Uma base de código, Android, iOS e navegador.',
    deliverables: [
      'React Native ou PWA',
      'Publicação nas lojas',
      'Notificações e offline',
    ],
    size: 'default',
    href: '/#contato',
  },
  {
    id: 'sistemas',
    icon: 'system',
    title: 'Sistemas e plataformas sob medida',
    description:
      'Quando a planilha trava e o software de prateleira não serve, a gente constrói o que o seu processo pede.',
    deliverables: [
      'Painéis, agendas e portais',
      'Multiusuário com permissões',
      'Relatórios que a diretoria lê',
    ],
    size: 'default',
    href: '/#contato',
  },
  {
    id: 'automacao',
    icon: 'automation',
    title: 'Automação e integrações',
    description:
      'Tarefa repetida vira rotina automática. WhatsApp, CRM, ERP e financeiro conversando entre si.',
    deliverables: [
      'WhatsApp Business API',
      'Integração com CRM e ERP',
      'Disparos e rotinas agendadas',
    ],
    size: 'wide',
    href: '/#contato',
  },
  {
    id: 'ia',
    icon: 'ai',
    title: 'Inteligência artificial aplicada',
    description:
      'IA resolvendo um problema real: triagem de atendimento, busca em documentos, resposta automática com contexto do seu negócio.',
    deliverables: [
      'Atendimento com IA no WhatsApp',
      'Busca semântica em documentos',
      'Classificação e resumo de leads',
    ],
    size: 'default',
    href: '/#contato',
  },
  {
    id: 'performance',
    icon: 'performance',
    title: 'Performance, SEO e analytics',
    description:
      'Diagnóstico do que trava, do que não indexa e do que você não está medindo. Depois, a correção.',
    deliverables: [
      'Core Web Vitals no verde',
      'SEO técnico e conteúdo',
      'GA4 e eventos de conversão',
    ],
    size: 'default',
    href: '/#contato',
  },
];
