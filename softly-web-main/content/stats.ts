/**
 * Métricas com contador animado.
 * TODO: substituir por dado real — todos os números abaixo são exemplos.
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

/** Prova social compacta exibida no hero. */
export const heroStats: Stat[] = [
  { id: 'projetos', value: 87, prefix: '+', label: 'projetos entregues', description: 'desde 2019' },
  { id: 'anos', value: 6, label: 'anos de mercado', description: 'time fixo, sem terceirização' },
  { id: 'recorrentes', value: 78, suffix: '%', label: 'clientes recorrentes', description: 'voltam com o segundo projeto' },
];

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
