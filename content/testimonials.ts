/**
 * Depoimentos exibidos no carrossel arrastável.
 * TODO: substituir por dado real — nomes, cargos e textos são exemplos.
 * `avatar`: quando houver foto, apontar para /public/images/depoimentos (400×400).
 * `video`: quando houver depoimento em vídeo, apontar para o arquivo MP4/WebM.
 */
export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: 1 | 2 | 3 | 4 | 5;
  initials: string;
  avatar?: string;
  video?: string;
  projectSlug?: string;
};

export const testimonials: Testimonial[] = [
  {
    id: 'marina',
    quote:
      'Em três meses a agenda encheu e o telefone parou de tocar o dia inteiro. A Softly não entregou um site: entregou uma operação que funciona sozinha à noite e no fim de semana.',
    author: 'Dra. Marina Ferraz',
    role: 'Diretora clínica',
    company: 'Clínica Vitalis',
    rating: 5,
    initials: 'MF',
    projectSlug: 'clinica-vitalis',
  },
  {
    id: 'rafael',
    quote:
      'Já tinha contratado agência antes e sempre travava na hora de integrar com o que a gente usa. Aqui foi o contrário: perguntaram do nosso processo antes de falar de tela.',
    author: 'Rafael Nordmann',
    role: 'Sócio-diretor',
    company: 'Nord Engenharia',
    rating: 5,
    initials: 'RN',
    projectSlug: 'nord-engenharia',
  },
  {
    id: 'claudia',
    quote:
      'O que mais me surpreendeu foi o prazo. Combinaram nove semanas e entregaram em nove semanas, com tudo funcionando no dia da virada.',
    author: 'Cláudia Mesquita',
    role: 'Proprietária',
    company: 'Mercado Vivo',
    rating: 5,
    initials: 'CM',
    projectSlug: 'mercado-vivo',
  },
  {
    id: 'eduardo',
    quote:
      'Explicaram o que dava para automatizar e, com a mesma clareza, o que não valia a pena. É raro fornecedor tirar item do próprio orçamento.',
    author: 'Eduardo Salles',
    role: 'Sócio',
    company: 'Contabiliza+',
    rating: 5,
    initials: 'ES',
    projectSlug: 'contabiliza-mais',
  },
  {
    id: 'helena',
    quote:
      'O site ficou com a cara do estúdio, não com a cara de um tema pronto. E carrega instantaneamente até com foto de obra em alta resolução.',
    author: 'Helena Prado',
    role: 'Arquiteta e fundadora',
    company: 'Studio Lumen',
    rating: 5,
    initials: 'HP',
    projectSlug: 'studio-lumen',
  },
  {
    id: 'vinicius',
    quote:
      'Seguimos juntos há dois anos. Quando aparece uma ideia, eles dizem em dois dias se vale e quanto custa. Isso vale mais que o desenvolvimento em si.',
    author: 'Vinícius Krauss',
    role: 'Gerente comercial',
    company: 'AgroSul Distribuidora',
    rating: 5,
    initials: 'VK',
    projectSlug: 'agrosul-distribuidora',
  },
];

/** Usado no JSON-LD de AggregateRating. */
export const aggregateRating = {
  value: 4.9, // TODO: substituir por dado real
  count: 37, // TODO: substituir por dado real
};
