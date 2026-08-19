/**
 * Etapas da seção "Como trabalhamos" (pin + scroll horizontal).
 * Manter em 5 etapas — o pin foi calibrado para essa quantidade.
 */
export type ProcessStep = {
  number: string;
  title: string;
  duration: string;
  description: string;
  deliverables: string[];
};

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Diagnóstico',
    duration: '3 a 5 dias',
    description:
      'Conversa de uma hora, análise do que você já tem e leitura dos números. Saímos com o problema definido — não com uma lista de desejos.',
    deliverables: [
      'Mapa do funil atual',
      'Diagnóstico técnico do que existe',
      'Prioridades ordenadas por impacto',
    ],
  },
  {
    number: '02',
    title: 'Proposta e escopo',
    duration: '2 dias',
    description:
      'Escopo fechado, preço fechado, prazo fechado. Você recebe o que está incluso e, principalmente, o que não está.',
    deliverables: [
      'Escopo detalhado por entrega',
      'Cronograma com marcos',
      'Contrato e forma de pagamento',
    ],
  },
  {
    number: '03',
    title: 'Design',
    duration: '1 a 3 semanas',
    description:
      'Arquitetura da informação, protótipo navegável e interface finalizada. Você aprova antes de existir uma linha de código.',
    deliverables: [
      'Protótipo navegável no Figma',
      'Design system do projeto',
      'Textos revisados com você',
    ],
  },
  {
    number: '04',
    title: 'Desenvolvimento',
    duration: '2 a 10 semanas',
    description:
      'Entregas semanais em ambiente de testes. Você acompanha o produto crescendo, sem surpresa no dia da virada.',
    deliverables: [
      'Ambiente de homologação desde a semana 1',
      'Revisão semanal com o time',
      'Testes de carga e acessibilidade',
    ],
  },
  {
    number: '05',
    title: 'Lançamento e evolução',
    duration: 'contínuo',
    description:
      'Publicamos, monitoramos e ajustamos com base em dado real. O projeto termina; o produto continua.',
    deliverables: [
      'Publicação e monitoramento',
      'Treinamento do seu time',
      'Relatório mensal de resultado',
    ],
  },
];
