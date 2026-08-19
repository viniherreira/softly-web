/**
 * Portfólio + páginas de case study (/projetos/[slug]).
 *
 * Os nomes de cliente, números e depoimentos abaixo são exemplos plausíveis.
 * TODO: substituir por dado real — todos os campos deste arquivo.
 *
 * IMAGENS: enquanto não houver captura real, o card renderiza um mockup vetorial
 * gerado em componente (components/project-frame.tsx). Para usar a imagem real,
 * preencha `image` com um arquivo em /public/images/projects (1600×1000, AVIF/WebP).
 */
export type ProjectCategory = 'Sites' | 'Aplicativos' | 'Sistemas' | 'Automação e IA';

export type Project = {
  slug: string;
  client: string;
  title: string;
  category: ProjectCategory;
  segment: string;
  year: number;
  /** Frase curta e numérica exibida no card do portfólio. */
  headlineResult: string;
  summary: string;
  /** 'featured' ocupa duas colunas no grid assimétrico. */
  size: 'featured' | 'default' | 'tall';
  image?: string;
  device: 'desktop' | 'mobile' | 'dashboard';
  challenge: string[];
  solution: string[];
  stack: string[];
  results: { value: string; label: string }[];
  testimonial?: { quote: string; author: string; role: string };
  duration: string;
};

export const projects: Project[] = [
  {
    slug: 'clinica-vitalis',
    client: 'Clínica Vitalis',
    title: 'Agendamento online que reduziu falta de paciente pela metade',
    category: 'Sites',
    segment: 'Saúde · 3 unidades',
    year: 2025,
    headlineResult: '+142% em leads em 3 meses',
    summary:
      'Site novo, agenda integrada e confirmação automática por WhatsApp para uma clínica que perdia hora vaga toda semana.',
    size: 'featured',
    device: 'desktop',
    duration: '7 semanas',
    challenge: [
      'O site antigo demorava 6,2s para carregar no celular — e 71% do tráfego vinha de celular.',
      'O agendamento era feito só por telefone, das 9h às 18h. Fora disso, o paciente desistia.',
      'A taxa de falta chegava a 27% das consultas marcadas, sem nenhuma confirmação prévia.',
    ],
    solution: [
      'Site reconstruído em Next.js com renderização estática e imagens em AVIF: 1,1s de carregamento no 4G.',
      'Agendamento online conectado à agenda das três unidades, com bloqueio de horário em tempo real.',
      'Régua automática no WhatsApp: confirmação em 48h, lembrete em 3h e reagendamento em um clique.',
      'Landing pages por especialidade, alimentando campanhas separadas de tráfego pago.',
    ],
    stack: ['Next.js', 'TypeScript', 'Supabase', 'WhatsApp API', 'Vercel'],
    results: [
      { value: '+142%', label: 'leads em 3 meses' },
      { value: '-68%', label: 'faltas em consultas' },
      { value: '1,1s', label: 'carregamento no celular' },
      { value: '38%', label: 'das marcações fora do horário comercial' },
    ],
    testimonial: {
      quote:
        'A agenda encheu e o telefone parou de tocar o dia inteiro. Minha recepção voltou a atender quem está na clínica.',
      author: 'Dra. Marina Ferraz',
      role: 'Diretora clínica, Clínica Vitalis',
    },
  },
  {
    slug: 'nord-engenharia',
    client: 'Nord Engenharia',
    title: 'Portal do cliente que tirou o acompanhamento de obra do e-mail',
    category: 'Sistemas',
    segment: 'Engenharia · B2B',
    year: 2025,
    headlineResult: '3,4× mais propostas enviadas',
    summary:
      'Site institucional e portal onde cada cliente acompanha medição, cronograma e documento da própria obra.',
    size: 'default',
    device: 'dashboard',
    duration: '11 semanas',
    challenge: [
      'Cada obra gerava dezenas de e-mails com anexos duplicados e versões trocadas.',
      'A equipe comercial levava 5 dias para montar uma proposta a partir de planilhas soltas.',
      'Não havia registro de quem aprovou o quê — e isso já tinha custado retrabalho.',
    ],
    solution: [
      'Portal com login por obra: cronograma, medições, fotos da semana e documentos versionados.',
      'Gerador de propostas com composição de custo pré-cadastrada e PDF assinado digitalmente.',
      'Trilha de auditoria em cada aprovação, exportável para o jurídico.',
    ],
    stack: ['Next.js', 'Node', 'PostgreSQL', 'AWS S3', 'Resend'],
    results: [
      { value: '3,4×', label: 'propostas enviadas por mês' },
      { value: '5d → 6h', label: 'tempo de montagem da proposta' },
      { value: '100%', label: 'das aprovações com registro' },
    ],
    testimonial: {
      quote:
        'O cliente para de ligar perguntando como está a obra. Ele abre o portal e vê. Isso mudou nossa rotina.',
      author: 'Rafael Nordmann',
      role: 'Sócio-diretor, Nord Engenharia',
    },
  },
  {
    slug: 'mercado-vivo',
    client: 'Mercado Vivo',
    title: 'App de pedidos que colocou 31% do faturamento no digital',
    category: 'Aplicativos',
    segment: 'Varejo alimentar',
    year: 2024,
    headlineResult: '31% do faturamento vindo do app',
    summary:
      'PWA de pedidos com lista recorrente, rota de entrega e pagamento no Pix — instalável sem passar por loja.',
    size: 'tall',
    device: 'mobile',
    duration: '9 semanas',
    challenge: [
      'Os pedidos chegavam por WhatsApp e eram digitados à mão no caixa, com erro em 1 a cada 8.',
      'Não existia histórico: o cliente recomeçava a compra do zero toda semana.',
      'A entrega era roteirizada no olho, com dois entregadores cruzando o mesmo bairro.',
    ],
    solution: [
      'PWA instalável, com catálogo em cache e funcionamento parcial offline.',
      '"Comprar de novo" a partir do último pedido — a compra recorrente virou dois toques.',
      'Roteirização automática das entregas por proximidade e janela de horário.',
      'Pix com confirmação automática, sem conferência manual no caixa.',
    ],
    stack: ['Next.js', 'PWA', 'Supabase', 'Pix API', 'Mapbox'],
    results: [
      { value: '31%', label: 'do faturamento no canal digital' },
      { value: '2,4×', label: 'frequência de recompra' },
      { value: '-41%', label: 'custo por entrega' },
    ],
    testimonial: {
      quote:
        'A gente vendia por WhatsApp e achava que estava indo bem. Depois do app, vi o tamanho do que estava deixando na mesa.',
      author: 'Cláudia Mesquita',
      role: 'Proprietária, Mercado Vivo',
    },
  },
  {
    slug: 'contabiliza-mais',
    client: 'Contabiliza+',
    title: 'Onboarding de cliente automatizado do contrato ao primeiro balancete',
    category: 'Automação e IA',
    segment: 'Contabilidade',
    year: 2025,
    headlineResult: '22 horas por semana devolvidas ao time',
    summary:
      'Fluxo que recebe documento, valida, cadastra no sistema contábil e avisa o responsável — sem ninguém digitar.',
    size: 'default',
    device: 'dashboard',
    duration: '6 semanas',
    challenge: [
      'Cada cliente novo consumia 4 horas de digitação e conferência de documento.',
      'Documento faltando só aparecia no fim do mês, atrasando a entrega fiscal.',
      'O time perdia o dia respondendo "quais documentos faltam?" no WhatsApp.',
    ],
    solution: [
      'Portal de envio com checklist por regime tributário e validação na hora do upload.',
      'Leitura automática de documento com IA, extraindo CNPJ, sócios e datas para conferência.',
      'Robô de cadastro no sistema contábil e alerta no WhatsApp a cada pendência.',
    ],
    stack: ['Next.js', 'OpenAI', 'Node', 'PostgreSQL', 'WhatsApp API'],
    results: [
      { value: '22h', label: 'por semana devolvidas ao time' },
      { value: '4h → 25min', label: 'para abrir um cliente novo' },
      { value: '-83%', label: 'de pendência descoberta no fim do mês' },
    ],
    testimonial: {
      quote:
        'Contratamos esperando organizar processo. Ganhamos capacidade: entramos 40 clientes sem contratar ninguém.',
      author: 'Eduardo Salles',
      role: 'Sócio, Contabiliza+',
    },
  },
  {
    slug: 'studio-lumen',
    client: 'Studio Lumen',
    title: 'Portfólio que ranqueou em primeiro no Google local em 4 meses',
    category: 'Sites',
    segment: 'Arquitetura',
    year: 2024,
    headlineResult: '1º lugar em "arquiteto em Florianópolis"',
    summary:
      'Site editorial com foco em obra, carregamento instantâneo e SEO local trabalhado projeto a projeto.',
    size: 'default',
    device: 'desktop',
    duration: '5 semanas',
    challenge: [
      'O portfólio vivia no Instagram — e sumia da busca de quem procurava por serviço na cidade.',
      'As fotos de obra pesavam 8MB cada e travavam o site antigo.',
      'Não havia página por projeto para o Google indexar.',
    ],
    solution: [
      'Página dedicada por obra, com dados estruturados e texto escrito para busca local.',
      'Pipeline de imagem em AVIF com placeholder progressivo: 8MB viraram 180KB sem perda visível.',
      'Perfil do Google Empresas conectado ao site e alimentado por projeto novo.',
    ],
    stack: ['Next.js', 'MDX', 'Cloudflare', 'Schema.org'],
    results: [
      { value: '1º', label: 'no Google para a busca principal' },
      { value: '+310%', label: 'tráfego orgânico em 4 meses' },
      { value: '96', label: 'de performance no Lighthouse' },
    ],
    testimonial: {
      quote:
        'Passei a receber contato de quem já viu a obra inteira. A conversa começa muito mais adiantada.',
      author: 'Helena Prado',
      role: 'Arquiteta e fundadora, Studio Lumen',
    },
  },
  {
    slug: 'agrosul-distribuidora',
    client: 'AgroSul Distribuidora',
    title: 'IA que responde pedido no WhatsApp em 40 segundos',
    category: 'Automação e IA',
    segment: 'Distribuição · B2B',
    year: 2025,
    headlineResult: 'Resposta em 40s, antes eram 4 minutos',
    summary:
      'Assistente que entende o pedido em texto ou áudio, consulta preço e estoque e devolve orçamento formatado.',
    size: 'default',
    device: 'mobile',
    duration: '8 semanas',
    challenge: [
      'Três vendedores respondiam 400 mensagens por dia, cada uma exigindo consulta manual de preço.',
      'Pedido enviado em áudio era transcrito na mão e frequentemente errava quantidade.',
      'Fora do horário comercial, o pedido esperava até a manhã seguinte.',
    ],
    solution: [
      'Assistente com IA lendo texto e áudio, conectado à tabela de preço e ao estoque em tempo real.',
      'Orçamento devolvido formatado, com prazo de entrega e link de confirmação.',
      'Escalonamento para vendedor humano em qualquer caso de exceção ou desconto.',
    ],
    stack: ['Node', 'OpenAI', 'WhatsApp API', 'PostgreSQL', 'Redis'],
    results: [
      { value: '40s', label: 'tempo médio de resposta' },
      { value: '+28%', label: 'pedidos fechados fora do horário' },
      { value: '0', label: 'contratações extras no comercial' },
    ],
    testimonial: {
      quote:
        'O robô não substituiu vendedor. Tirou dele a parte chata e deixou o time negociando o que importa.',
      author: 'Vinícius Krauss',
      role: 'Gerente comercial, AgroSul',
    },
  },
];

export const projectCategories: ('Todos' | ProjectCategory)[] = [
  'Todos',
  'Sites',
  'Aplicativos',
  'Sistemas',
  'Automação e IA',
];

export const getProject = (slug: string): Project | undefined =>
  projects.find((project) => project.slug === slug);
