/**
 * Planos e tabela comparativa.
 *
 * TODO: substituir por dado real — todos os preços deste arquivo são exemplos.
 *
 * COMO EDITAR
 * - `priceMonthly` / `priceAnnual`: número em reais. `null` = "sob consulta".
 * - O toggle anual aplica o desconto já embutido nestes valores (não há cálculo
 *   automático), então basta editar os dois campos.
 * - `setup`: valor de entrada, quando existir.
 */
export type Plan = {
  id: string;
  name: string;
  audience: string;
  description: string;
  priceMonthly: number | null;
  priceAnnual: number | null;
  priceNote: string;
  prefix?: string;
  suffix?: string;
  delivery: string;
  features: string[];
  cta: { label: string; href: string };
  highlighted: boolean;
  badge?: string;
};

export const annualDiscountLabel = '2 meses grátis';

export const plans: Plan[] = [
  {
    id: 'essencial',
    name: 'Essencial',
    audience: 'Presença digital profissional',
    description:
      'Para quem precisa de uma página que carrega rápido, aparece no Google e converte visita em contato.',
    priceMonthly: 7900,
    priceAnnual: 7900,
    priceNote: 'projeto único, sem mensalidade obrigatória',
    prefix: 'a partir de',
    delivery: 'Entrega em 3 a 4 semanas',
    features: [
      'Landing page ou site de até 5 páginas',
      'Design exclusivo, feito do zero',
      'Painel para editar textos e imagens',
      'SEO técnico e dados estruturados',
      'Formulário integrado ao WhatsApp',
      'Google Analytics 4 configurado',
      '30 dias de ajustes inclusos',
    ],
    cta: { label: 'Começar pelo Essencial', href: '/#contato' },
    highlighted: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    audience: 'Site + automação + otimização contínua',
    description:
      'Para quem já tem demanda e precisa de um canal digital que melhore todo mês, não só no dia da entrega.',
    priceMonthly: 2900,
    priceAnnual: 2417,
    priceNote: 'por mês · setup de R$ 6.900 no primeiro mês',
    prefix: 'a partir de',
    suffix: '/mês',
    delivery: 'No ar em 4 semanas, evolução contínua',
    features: [
      'Tudo do Essencial, sem limite de páginas',
      'Automação de WhatsApp e CRM',
      'Landing pages novas todo mês',
      'Testes A/B e otimização de conversão',
      'Relatório mensal com leitura de resultado',
      'Suporte prioritário em até 4 horas úteis',
      'Hospedagem e monitoramento inclusos',
    ],
    cta: { label: 'Quero o Growth', href: '/#contato' },
    highlighted: true,
    badge: 'Mais escolhido',
  },
  {
    id: 'sob-medida',
    name: 'Sob medida',
    audience: 'Sistemas, apps e SaaS',
    description:
      'Para produto digital com regra de negócio própria, integração pesada ou operação que precisa escalar.',
    priceMonthly: null,
    priceAnnual: null,
    priceNote: 'orçamento a partir de R$ 38.000',
    delivery: 'Cronograma definido no diagnóstico',
    features: [
      'Descoberta técnica e de produto',
      'Aplicativo, plataforma ou SaaS completo',
      'Integrações com ERP, CRM e financeiro',
      'IA aplicada quando resolve o problema',
      'Time dedicado com sprint semanal',
      'Documentação e transferência de conhecimento',
      'Código-fonte seu, sem trava de fornecedor',
    ],
    cta: { label: 'Falar sobre o projeto', href: '/#contato' },
    highlighted: false,
  },
];

/** Tabela comparativa completa exibida abaixo dos cards. */
export type ComparisonRow = {
  feature: string;
  essencial: string | boolean;
  growth: string | boolean;
  sobMedida: string | boolean;
};

export const comparisonGroups: { group: string; rows: ComparisonRow[] }[] = [
  {
    group: 'Projeto',
    rows: [
      { feature: 'Design exclusivo (sem template)', essencial: true, growth: true, sobMedida: true },
      { feature: 'Número de páginas', essencial: 'até 5', growth: 'ilimitado', sobMedida: 'sob escopo' },
      { feature: 'Protótipo navegável antes do código', essencial: false, growth: true, sobMedida: true },
      { feature: 'Redação dos textos', essencial: 'revisão', growth: 'redação completa', sobMedida: 'redação completa' },
      { feature: 'Prazo de entrega', essencial: '3–4 semanas', growth: '4 semanas + evolução', sobMedida: 'sob cronograma' },
    ],
  },
  {
    group: 'Tecnologia',
    rows: [
      { feature: 'Hospedagem e domínio configurados', essencial: true, growth: true, sobMedida: true },
      { feature: 'Painel de edição de conteúdo', essencial: true, growth: true, sobMedida: true },
      { feature: 'Integração com WhatsApp', essencial: 'link direto', growth: 'API oficial', sobMedida: 'API oficial' },
      { feature: 'Integração com CRM / ERP', essencial: false, growth: true, sobMedida: true },
      { feature: 'IA aplicada ao atendimento', essencial: false, growth: 'opcional', sobMedida: true },
      { feature: 'Área logada e permissões', essencial: false, growth: false, sobMedida: true },
    ],
  },
  {
    group: 'Crescimento',
    rows: [
      { feature: 'SEO técnico', essencial: true, growth: true, sobMedida: true },
      { feature: 'Landing pages adicionais', essencial: 'sob orçamento', growth: '2 por mês', sobMedida: 'sob escopo' },
      { feature: 'Testes A/B', essencial: false, growth: true, sobMedida: 'opcional' },
      { feature: 'Relatório mensal', essencial: false, growth: true, sobMedida: true },
    ],
  },
  {
    group: 'Suporte',
    rows: [
      { feature: 'Ajustes inclusos após a entrega', essencial: '30 dias', growth: 'contínuo', sobMedida: 'em contrato' },
      { feature: 'Tempo de resposta', essencial: '1 dia útil', growth: '4 horas úteis', sobMedida: 'SLA dedicado' },
      { feature: 'Monitoramento de uptime', essencial: false, growth: true, sobMedida: true },
      { feature: 'Propriedade do código', essencial: true, growth: true, sobMedida: true },
    ],
  },
];

export const paymentNote =
  'Pagamento em até 6× sem juros no cartão, Pix com 5% de desconto ou boleto parcelado em 3×. Projetos sob medida seguem cronograma de desembolso por entrega.'; // TODO: substituir por dado real
