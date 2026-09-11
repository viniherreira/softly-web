/**
 * Métricas com contador animado.
 *
 * ⚠ ATENÇÃO — TODOS OS NÚMEROS ABAIXO SÃO EXEMPLO E HOJE SE CONTRADIZEM COM
 * A FUNDAÇÃO EM 2025 (content/site.ts). "+87 projetos entregues" e "média de
 * 37 avaliações" não fecham com uma empresa de dois engenheiros no primeiro
 * ano, e a seção "Sobre" exibe "Fundação 2025" a poucos blocos de distância.
 * Quem ler os dois vai perceber. Troque por números reais antes de publicar,
 * ou remova a faixa de resultados até ter o que colocar nela.
 */
export type Stat = {
  id: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  label: string;
  description: string;
};

/** Faixa de resultados quantitativos (seção "Números"). */
export const resultStats: Stat[] = [
  {
    id: 'projetos-total',
    value: 87,
    prefix: '+',
    label: 'Projetos entregues',
    description: 'Sites, apps, sistemas e automações no ar.',
  },
  {
    id: 'prazo',
    value: 5.2,
    decimals: 1,
    suffix: ' sem',
    label: 'Tempo médio de entrega',
    description: 'Da assinatura ao lançamento, em média.',
  },
  {
    id: 'satisfacao',
    value: 4.9,
    decimals: 1,
    suffix: '/5',
    label: 'Satisfação dos clientes',
    description: 'Média de 37 avaliações pós-entrega.',
  },
  {
    id: 'uptime',
    value: 99.98,
    decimals: 2,
    suffix: '%',
    label: 'Uptime médio',
    description: 'Monitoramento contínuo nos projetos hospedados.',
  },
];
