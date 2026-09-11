/**
 * Faixa marquee: tecnologias que usamos e clientes atendidos.
 * TODO: substituir por dado real — a lista de clientes é exemplo.
 * Para logos reais, adicionar SVG monocromático em /public/images/logos e
 * preencher `logo` (o marquee cai para o texto quando `logo` não existe).
 */
export type MarqueeItem = { name: string; logo?: string };

export const stackItems: MarqueeItem[] = [
  { name: 'Next.js' },
  { name: 'React' },
  { name: 'TypeScript' },
  { name: 'Node' },
  { name: 'Supabase' },
  { name: 'PostgreSQL' },
  { name: 'AWS' },
  { name: 'Vercel' },
  { name: 'WhatsApp API' },
  { name: 'OpenAI' },
  { name: 'React Native' },
  { name: 'Stripe' },
];

export const clientItems: MarqueeItem[] = [
  { name: 'Clínica Vitalis' },
  { name: 'Nord Engenharia' },
  { name: 'Mercado Vivo' },
  { name: 'Contabiliza+' },
  { name: 'Studio Lumen' },
  { name: 'AgroSul' },
  { name: 'Odonto Prime' },
  { name: 'Bella Estética' },
];
