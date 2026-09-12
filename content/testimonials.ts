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

/* Três depoimentos, não seis. Seis viravam 256 palavras num carrossel que
   ninguém arrasta até o fim — os três primeiros já cobrem prazo, clareza de
   escopo e recorrência, que são os três medos de quem contrata. */
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
];

/** Usado no JSON-LD de AggregateRating. */
export const aggregateRating = {
  value: 4.9, // TODO: substituir por dado real
  count: 37, // TODO: substituir por dado real
};
