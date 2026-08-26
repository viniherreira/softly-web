# Softly — site institucional

Site de uma página (com rotas internas) para a Softly: engenharia de produto
digital — sites, aplicativos, sistemas sob medida, automações e IA aplicada.

Construído em **Next.js 14 (App Router) + TypeScript strict + Tailwind CSS**, com
**GSAP/ScrollTrigger**, **Framer Motion** e **Lenis** para o sistema de movimento.

---

## Sumário

1. [Como rodar](#1-como-rodar)
2. [Estrutura de pastas](#2-estrutura-de-pastas)
3. [Onde editar cada conteúdo](#3-onde-editar-cada-conteúdo)
4. [Como trocar cores](#4-como-trocar-cores)
5. [Como trocar fontes](#5-como-trocar-fontes)
6. [Sistema de movimento](#6-sistema-de-movimento)
7. [Formulários e integrações](#7-formulários-e-integrações)
8. [Variáveis de ambiente](#8-variáveis-de-ambiente)
9. [Publicar na Vercel](#9-publicar-na-vercel)
10. [Acessibilidade e performance](#10-acessibilidade-e-performance)
11. [Pendências: TODOs e assets](#11-pendências-todos-e-assets)

---

## 1. Como rodar

Requisitos: **Node 18.17+** (testado no 22) e npm.

```bash
npm install
npm run dev      # http://localhost:3000
```

Outros comandos:

```bash
npm run build      # build de produção
npm start          # sobe o build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint (next/core-web-vitals)
npm run fonts:sync # recopia os .woff2 do node_modules para app/fonts
```

Os arquivos de fonte já estão versionados em `app/fonts`, então **o build não
depende de rede**. Só rode `fonts:sync` se trocar as famílias.

`sharp` entra como dependência opcional — é o que otimiza as imagens em
produção. Na Vercel ela já vem no ambiente; em self-hosting, o `npm install`
resolve. Sem ela o site roda igual, só sem otimizar bitmap.

---

## 2. Estrutura de pastas

```
app/                  rotas (App Router)
  api/contato         recebe o formulário (Zod + honeypot + rate limit)
  api/newsletter      inscrição do rodapé
  api/og              imagem de Open Graph gerada sob demanda
  insights/           blog em MDX (índice + [slug])
  projetos/[slug]/    case studies
  politica-de-privacidade, termos-de-uso
  layout.tsx          shell: fontes, tema, providers, header/footer
  globals.css         TOKENS de cor, espaço e movimento
components/
  icons/              logo, ícones de UI e de serviço (SVG próprios)
  layout/             header, footer, banner LGPD, flutuantes, analytics
  motion/             preloader, reveal, split-text, marquee, cursor, parallax…
  ui/                 botão, campo, switch, accordion, badge, card, slider
content/              TODO O TEXTO DO SITE (é aqui que se edita)
  blog/*.mdx          posts
hooks/                media query, reduced motion, scroll, spotlight
lib/                  utils, tokens de motion, SEO, JSON-LD, cálculo do orçamento
sections/             as 12 seções da home, uma por arquivo
```

Regra do projeto: **componente não guarda texto e não guarda cor**. Texto vem de
`content/`, cor vem dos tokens.

---

## 3. Onde editar cada conteúdo

| O que mudar | Arquivo |
| --- | --- |
| Nome, WhatsApp, e-mail, cidade, CNPJ, redes sociais | `content/site.ts` |
| Itens do menu e do rodapé | `content/site.ts` |
| Os 6 serviços do bento grid | `content/services.ts` |
| As 5 etapas do processo | `content/process.ts` |
| Projetos do portfólio e páginas de case study | `content/projects.ts` |
| Planos, preços e tabela comparativa | `content/pricing.ts` |
| Opções e valores da calculadora | `content/calculator.ts` |
| Depoimentos e nota média | `content/testimonials.ts` |
| Perguntas do FAQ (alimentam o JSON-LD também) | `content/faq.ts` |
| Métricas do hero e da faixa de números | `content/stats.ts` |
| Faixa marquee (clientes e stack) | `content/stack.ts` |
| Texto do bloco "Sobre" e time | `content/about.ts` |
| Política de Privacidade e Termos de Uso | `content/legal.ts` |
| Posts do blog | `content/blog/*.mdx` |

### Publicar um post

Crie `content/blog/meu-post.mdx`:

```mdx
---
title: "Título do post"
description: "Resumo de uma linha, usado no card e no Google."
date: "2026-03-01"
readingTime: 6
category: "Performance"
author: "Nome de quem escreveu"
featured: false
---

Conteúdo em MDX. Tabelas, listas e links já vêm estilizados.
```

Nada mais precisa ser cadastrado: índice, rota, sitemap e JSON-LD leem a pasta.

### Trocar um preço

`content/pricing.ts` → `priceMonthly` / `priceAnnual` (números em reais, `null`
vira "Sob consulta"). O desconto anual já está embutido nos dois campos — não há
cálculo automático, justamente para o valor exibido ser sempre o valor real.

---

## 4. Como trocar cores

Tudo vive em `app/globals.css`, em **canais RGB** (para permitir `cor/opacidade`
no Tailwind). Há duas camadas:

```css
:root {
  --blue-600: 27 92 255;   /* 1. paleta bruta */
  ...
}

:root, [data-theme='dark'] {
  --brand: var(--blue-600); /* 2. camada semântica: é o que os componentes usam */
  --bg: var(--ink-900);
  ...
}

[data-theme='light'] { /* mesma identidade traduzida para fundo claro */ }
```

Para mudar a cor primária do site inteiro, altere `--brand` (e `--brand-hover`,
`--brand-soft`) nos dois temas. Nenhum componente precisa ser tocado.

Notas de contraste (WCAG AA), caso troque os azuis:

- `--brand` é **cor de preenchimento** (botão com texto branco em cima).
- `--brand-soft` é **cor de texto** — no escuro precisa de ~7:1 sobre o fundo.
  Por isso links e destaques usam `--brand-soft`, não `--brand`.

O tema é definido antes da primeira pintura por um script inline
(`components/theme-provider.tsx`), lendo `localStorage` e, na falta dele,
`prefers-color-scheme`. Para forçar escuro sempre, troque o fallback
`(m?'light':'dark')` por `'dark'` em `themeInitScript`.

---

## 5. Como trocar fontes

As famílias são carregadas em `lib/fonts.ts` com `next/font/local`, auto-hospedadas
a partir de `app/fonts`, com `font-display: swap` e só os pesos usados.

**Estado atual:** a direção original pedia **Clash Display + Satoshi**, que só são
distribuídas pela Fontshare e não podem ser instaladas via npm. O projeto usa as
alternativas autorizadas — **Unbounded** (display) e **Manrope** (corpo) — mais
**JetBrains Mono** para dados. Nenhuma fonte de sistema é usada.

Para colocar Clash Display + Satoshi quando tiver os arquivos licenciados:

1. copie os `.woff2` para `app/fonts` (ex.: `ClashDisplay-Medium.woff2`);
2. troque os `src` em `lib/fonts.ts`;
3. em `tailwind.config.ts`, aumente o teto de cada tamanho display em ~30% — a
   escala atual foi calibrada para a largura do Unbounded, que é bem mais largo
   (o comentário no arquivo tem os valores sugeridos);
4. remova `@fontsource/unbounded` e `@fontsource/manrope` do `package.json`.

---

## 6. Sistema de movimento

| Recurso | Onde |
| --- | --- |
| Preloader (traço do logo + contador + cortina) | `components/motion/preloader.tsx` |
| Reveal padrão e cascata | `components/motion/reveal.tsx` |
| Split por palavra / caractere / linha | `components/motion/split-text.tsx` |
| Marquee infinito com inversão pelo scroll | `components/motion/marquee.tsx` |
| Parallax por scrub (GSAP) | `components/motion/parallax.tsx` |
| Pin + scroll horizontal | `sections/process.tsx` |
| Cursor customizado | `components/motion/custom-cursor.tsx` |
| Smooth scroll (Lenis + ScrollTrigger) | `components/motion/smooth-scroll.tsx` |
| Contadores | `components/motion/counter.tsx`, `animated-number.tsx` |
| Curvas e durações | `lib/motion.ts` + `app/globals.css` |

Regras aplicadas em todo o site:

- anima-se **apenas `transform` e `opacity`** (a única exceção consciente é a
  altura do accordion, comentada no `tailwind.config.ts`);
- easing padrão `cubic-bezier(0.16, 1, 0.3, 1)`; micro 180ms, entrada 700ms,
  cinematográfica 1200ms;
- `prefers-reduced-motion: reduce` desliga preloader, Lenis, parallax, scrub,
  cursor e revelação por caractere — sobra fade de 150ms;
- no mobile não há pin/scrub, cursor custom nem partículas.

**Decisão registrada:** não há Three.js/R3F. O ganho visual não pagava ~150KB de
JS competindo com o LCP do hero; a profundidade foi obtida com camadas compostas
na GPU (`components/hero-background.tsx`). O ponto de extensão é justamente esse
componente, caso se queira plugar R3F depois — ele já recebe `variant` e é
carregado só no cliente.

GSAP entra por `import()` dinâmico: quem não chega na seção com pin nunca baixa
a biblioteca.

---

## 7. Formulários e integrações

`POST /api/contato` valida com o mesmo schema Zod do cliente
(`lib/validators.ts`) e aplica, nesta ordem:

1. **rate limit** por IP — 5 envios/minuto (`lib/rate-limit.ts`, em memória);
2. **honeypot** — o campo escondido `website` precisa chegar vazio; se vier
   preenchido, a resposta é 200 silencioso (o robô não descobre o que o denunciou);
3. **validação** dos campos.

A entrega do lead segue o que estiver configurado:

- `CONTACT_WEBHOOK_URL` → POST em JSON (Make, n8n, Zapier, CRM próprio);
- `RESEND_API_KEY` + `CONTACT_TO_EMAIL` → e-mail via Resend (sem SDK);
- nenhum dos dois → o lead é registrado no log do servidor e a resposta é 200
  (bom para desenvolvimento).

A calculadora de orçamento manda a estimativa junto do lead: a conta
(`lib/estimate.ts`) é pura e determinística, então o número que o visitante viu é
o mesmo que chega para a Softly. Depois do envio, o botão "Continuar no WhatsApp"
abre a conversa já preenchida com nome, tipo de projeto e estimativa.

---

## 8. Variáveis de ambiente

Copie `.env.example` para `.env.local`. **Nenhuma é obrigatória para rodar.**

| Variável | Para quê | Obrigatória |
| --- | --- | --- |
| `SITE_URL` | canonical, OG, sitemap, robots | recomendada em produção |

> **Ao cadastrar `SITE_URL`:** use a URL completa, com `https://`
> (ex.: `https://softly.com.br`). Deixá-la **vazia** ou sem protocolo já
> derrubou build na Vercel com `TypeError: Invalid URL` em `/_not-found`.
> Hoje `lib/seo.ts` normaliza o valor e cai para o domínio de produção da
> Vercel — e depois para `content/site.ts` — em vez de quebrar, mas o
> canonical só fica correto com o valor certo.
>
> Ela **não** leva o prefixo `NEXT_PUBLIC_`: só o servidor a lê, e o prefixo
> serviria apenas para expor o valor ao navegador. `NEXT_PUBLIC_SITE_URL`
> continua aceita por compatibilidade. Já `NEXT_PUBLIC_GA_ID` e
> `NEXT_PUBLIC_META_PIXEL_ID` precisam do prefixo — são lidos pelo navegador
> e são identificadores públicos por natureza.
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 | não |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel | não |
| `CONTACT_WEBHOOK_URL` | recebe o lead em JSON | não |
| `NEWSLETTER_WEBHOOK_URL` | recebe a inscrição da newsletter | não |
| `RESEND_API_KEY` | envio de e-mail | não |
| `CONTACT_TO_EMAIL` | destinatário dos leads | se usar Resend |
| `CONTACT_FROM_EMAIL` | remetente verificado no Resend | se usar Resend |

GA4 e Meta Pixel só são injetados se as variáveis existirem, entram com
`strategy="afterInteractive"` e **começam com o consentimento negado**
(Consent Mode v2). Quem libera é o banner LGPD.

---

## 9. Publicar na Vercel

1. Suba o repositório no GitHub.
2. Na Vercel: **Add New → Project** e importe o repositório. O framework é
   detectado sozinho (build `next build`, sem configuração extra).
3. Em **Settings → Environment Variables**, cadastre as da tabela acima para
   *Production* e *Preview*.
4. Deploy. Depois, em **Settings → Domains**, aponte o domínio e ajuste
   `NEXT_PUBLIC_SITE_URL` para ele (é o que alimenta canonical e sitemap).
5. Confira depois do primeiro deploy:
   - `/sitemap.xml` e `/robots.txt` respondendo;
   - `/api/og?title=Teste` devolvendo PNG;
   - um envio real do formulário chegando no destino configurado.

O `app/api/og` roda no runtime edge; o restante é estático ou Node.

---

## 10. Acessibilidade e performance

Já implementado:

- HTML semântico, um único `<h1>` por página, hierarquia sem saltos (auditado);
- skip-link, navegação completa por teclado e foco visível de 2px em tudo;
- `aria-label` nos ícones, `alt`/`role="img"` nos mockups, `aria-live` no
  resultado da calculadora, `role="alert"` nos erros de formulário;
- contraste AA: azul de **texto** é `--brand-soft` (7,9:1 no escuro), azul de
  **preenchimento** é `--brand` (4,9:1 com texto branco);
- `prefers-reduced-motion` respeitado em todo o sistema de movimento;
- sem overflow horizontal de 320px a 2560px (verificado);
- CLS praticamente zero — os mockups são vetoriais com proporção fixa e as
  fontes são auto-hospedadas com `swap`.

Medido localmente no build de produção (desktop, sem throttle): **LCP ~0,5s**,
**CLS ~0,0001**. Rode o Lighthouse no deploy real antes de bater o martelo em
"≥95": a nota final depende de rede, imagens reais e das tags de analytics.

---

## 11. Pendências: TODOs e assets

Todo dado inventado está marcado com `// TODO: substituir por dado real` no
código. Para listar tudo:

```bash
grep -rn "TODO: substituir" content lib app components
```

### Dados que só a empresa tem

| Onde | O que trocar |
| --- | --- |
| `content/site.ts` | CNPJ, razão social, WhatsApp, e-mail, endereço, CEP, cidade/UF, ano de fundação, domínio, perfis sociais |
| `content/pricing.ts` | todos os preços, valor de setup, faixa do "Sob medida", formas de pagamento |
| `content/calculator.ts` | valores base, preço por página/tela, preço das integrações, multiplicadores |
| `content/projects.ts` | os 6 projetos: cliente, números, depoimento, stack, duração |
| `content/testimonials.ts` | depoimentos, nomes, cargos, empresas e a nota média do `AggregateRating` |
| `content/stats.ts` | projetos entregues, anos, recorrência, prazo médio, satisfação, uptime |
| `content/stack.ts` | lista real de clientes atendidos |
| `content/about.ts` | história, valores e time |
| `content/legal.ts` | revisão jurídica, e-mail do encarregado (DPO), foro |
| `lib/jsonld.ts` | latitude/longitude do endereço |
| `sections/hero.tsx` | a linha "Agenda aberta · 2 vagas neste trimestre" |

### Assets que faltam

| Asset | Onde entra | Especificação |
| --- | --- | --- |
| Capturas dos 6 projetos | `content/projects.ts` → campo `image` | 1600×1000, AVIF/WebP, em `/public/images/projects` |
| Logos de clientes | `content/stack.ts` → campo `logo` | SVG monocromático em `/public/images/logos` |
| Fotos dos depoimentos | `content/testimonials.ts` → `avatar` | 400×400, AVIF |
| Fotos do time | `sections/about.tsx` | 400×400, tratamento duotone (classe `.duotone` pronta) |
| Depoimento em vídeo | `content/testimonials.ts` → `video` | MP4/WebM; o player customizado já existe e só aparece quando o campo é preenchido |
| Ícones PNG do PWA | `app/manifest.ts` | opcional — hoje o manifest usa `icon.svg`, que já atende ao critério de instalação |

Enquanto as imagens reais não chegam, os cards renderizam mockups vetoriais
(`components/project-frame.tsx`): proporção correta, ~1KB, duotone azul e zero CLS.

### Limitações conhecidas

- **Rate limit em memória**: funciona por instância serverless. Para volume alto
  ou múltiplas regiões, troque por Upstash Redis — a interface de
  `lib/rate-limit.ts` já é compatível.
- **Transição de saída entre páginas**: o App Router desmonta a rota antiga antes
  do `AnimatePresence` completar o *exit*. A entrada anima normalmente; a saída é
  praticamente instantânea. É limitação do framework, não do componente.
- **Imagem de OG**: o gerador (Satori) não lê `.woff2`, então usa a fonte padrão
  embutida. Para usar a Unbounded na imagem, converta o arquivo para `.ttf` e
  registre em `app/api/og/route.tsx`.
