'use client';

import Link from 'next/link';
import { ServiceGlyph } from '@/components/icons/service-icons';
import { ArrowUpRight, Check } from '@/components/icons/ui-icons';
import { RevealGroup, RevealItem } from '@/components/motion/reveal';
import { SectionHeading } from '@/components/section-heading';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { services, type Service } from '@/content/services';
import { cn } from '@/lib/utils';

/**
 * Bento grid assimétrico (12 colunas no desktop):
 *   destaque 7×2 · apps 5 · sistemas 5 · automação 6 · IA 6 · performance 12
 * A variação de tamanho segue peso comercial, não estética: o serviço que mais
 * entra em contato ocupa mais área.
 *
 * O card de destaque também sobe um nível de superfície (ver SpotlightCard).
 * Antes ele era maior, mas com o mesmo tom e a mesma sombra dos vizinhos —
 * área sozinha não cria hierarquia num campo de retângulos escuros iguais.
 *
 * Entrada: `mask`, não o fade-up padrão. Os cards são descobertos de baixo
 * para cima, como se já estivessem ali — coerente com "o que a Softly
 * constrói" e diferente do gesto das outras seções.
 */
const SPAN: Record<string, string> = {
  sites: 'lg:col-span-7 lg:row-span-2',
  apps: 'lg:col-span-5',
  sistemas: 'lg:col-span-5',
  automacao: 'lg:col-span-6',
  ia: 'lg:col-span-6',
  performance: 'lg:col-span-12',
};

export function Services() {
  return (
    <section id="servicos" aria-labelledby="servicos-titulo" className="section-y relative">
      <div className="shell">
        <SectionHeading
          index="01"
          eyebrow="Serviços"
          titleId="servicos-titulo"
          title={
            <>
              O que a Softly constrói{' '}
              <span className="text-brand-soft">e o problema que cada coisa resolve.</span>
            </>
          }
          description="Seis frentes, um critério: entra no escopo o que muda um número do seu negócio. O resto a gente diz que não vale a pena."
        />

        <RevealGroup className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-12" stagger={0.075}>
          {services.map((service) => (
            <RevealItem
              key={service.id}
              variant="mask"
              className={cn('min-w-0 sm:col-span-1', SPAN[service.id])}
            >
              <ServiceCard service={service} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

function ServiceCard({ service }: { service: Service }) {
  const featured = service.size === 'featured';
  const band = service.id === 'performance';

  if (band) return <PerformanceBand service={service} />;

  return (
    <SpotlightCard
      as="article"
      level={featured ? 2 : 1}
      className={cn('flex h-full flex-col p-7 lg:p-8', featured && 'lg:p-10')}
    >
      <ServiceGlyph name={service.icon} />

      <h3 className={cn('mt-6 text-display-sm text-title', featured && 'text-display-md')}>
        {service.title}
      </h3>

      <p className={cn('mt-3 text-body-sm text-body', featured && 'max-w-md text-body')}>
        {service.description}
      </p>

      <div className="mt-6 flex flex-1 flex-col">
        {/* Só o destaque lista entregáveis (ver content/services.ts): nos
            outros a lista repetia a descrição do próprio card. */}
        {service.deliverables ? (
          <ul className="space-y-2.5">
            {service.deliverables.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-body-sm text-muted">
                <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-brand-soft" />
                {item}
              </li>
            ))}
          </ul>
        ) : null}

        {/* Só o card de destaque ganha ilustração — é o que sustenta a área extra */}
        {featured ? <ConversionChart /> : null}

        <div className="mt-auto pt-7">
          <ServiceLink href={service.href} />
        </div>
      </div>
    </SpotlightCard>
  );
}

/**
 * Faixa larga do fim do grid. Antes ela reaproveitava o layout do card comum
 * com modificadores `lg:` empilhados, e no desktop o "Saiba mais" era espremido
 * na última coluna e quebrava em duas linhas. Aqui a faixa é o que ela é: três
 * regiões (assunto · entregáveis · ação), cada uma com largura própria.
 */
function PerformanceBand({ service }: { service: Service }) {
  return (
    <SpotlightCard
      as="article"
      level={1}
      className="flex h-full flex-col gap-8 p-7 lg:flex-row lg:items-center lg:gap-12 lg:p-9"
    >
      <div className="lg:w-[26rem] lg:shrink-0">
        <div className="flex items-center gap-4">
          <ServiceGlyph name={service.icon} />
          <h3 className="text-display-sm text-title">{service.title}</h3>
        </div>
        <p className="mt-4 text-body-sm text-body">{service.description}</p>
      </div>

      {service.deliverables ? (
        <ul className="grid flex-1 gap-x-8 gap-y-3 sm:grid-cols-3">
          {service.deliverables.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-body-sm text-muted">
              <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-brand-soft" />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex-1" />
      )}

      <div className="lg:shrink-0">
        <ServiceLink href={service.href} />
      </div>
    </SpotlightCard>
  );
}

/**
 * Link de card: a seta anda e o traço sob o texto cresce da esquerda.
 *
 * O `::before` transparente é o alvo de toque. Em caixa-alta de 12px o link
 * mede 16px de altura — metade do mínimo de 24px da WCAG e um terço do que o
 * polegar pede. Crescer por `padding` levaria junto o traço do sublinhado,
 * que está preso em `-bottom-1.5`; o pseudo-elemento estende só a área
 * clicável, sem mexer em uma linha do layout.
 */
function ServiceLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="group/link relative inline-flex items-center gap-2 whitespace-nowrap font-mono text-label uppercase text-brand-soft before:absolute before:-inset-x-2 before:-inset-y-3.5 before:content-['']"
    >
      Saiba mais
      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-expo group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
      <span
        aria-hidden="true"
        className="absolute -bottom-1.5 left-0 right-6 h-px origin-left scale-x-0 bg-brand-soft/70 transition-transform duration-300 ease-expo group-hover/link:scale-x-100"
      />
    </Link>
  );
}

/**
 * Ilustração do card de destaque.
 *
 * A anterior eram três retângulos arredondados sobrepostos com um rótulo
 * "VISITA → CONTATO → CLIENTE" embaixo: lia como enfeite, não como funil.
 * Esta mostra o número em cada etapa e a taxa entre elas, na mesma linguagem
 * de instrumento do painel do hero. As barras crescem no hover do card.
 *
 * IMPORTANTE: os números abaixo são um exemplo de leitura, e a legenda diz
 * isso na cara. Não troque o rótulo por "cliente real" sem colocar aqui um
 * funil de projeto que realmente exista — número inventado com cara de caso
 * de sucesso é a única coisa nesta página que custaria a confiança de quem lê.
 * TODO: substituir por um funil real (com o cliente ciente) quando houver.
 */
const FUNNEL = [
  { stage: 'Visitas', value: '1.000', width: 1, drop: null },
  { stage: 'Contatos', value: '180', width: 0.52, drop: '18%' },
  { stage: 'Clientes', value: '43', width: 0.26, drop: '24%' },
] as const;

function ConversionChart() {
  /* `bg-bg`, e nao `bg-ink-900`: a cor precisa trocar com o tema. Com o valor
     cru da paleta escura, este painel virava uma caixa cinza no tema claro e os
     rotulos sumiam dentro dela. */
  return (
    <figure className="relative mt-8 overflow-hidden rounded-[18px] border border-line/60 bg-bg/70 p-6">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-70 transition-opacity duration-700 ease-expo group-hover:opacity-100"
        style={{
          background: 'radial-gradient(120% 100% at 20% 0%, rgb(var(--glow) / 0.26), transparent 60%)',
        }}
      />
      <div className="dot-layer" />

      <figcaption className="relative flex items-baseline justify-between gap-4">
        <span className="font-mono text-label uppercase text-muted">O funil que a gente mede</span>
        <span className="font-mono text-label uppercase text-muted/70">Exemplo</span>
      </figcaption>

      <div className="relative mt-5 space-y-3">
        {FUNNEL.map((step) => (
          <div key={step.stage} className="flex items-center gap-4">
            <span className="w-16 shrink-0 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-muted">
              {step.stage}
            </span>

            <div className="relative h-7 flex-1">
              <div
                className="h-full origin-left rounded-[6px] bg-gradient-to-r from-brand/70 to-accent/45 transition-transform duration-700 ease-expo group-hover:scale-x-[1.03]"
                style={{ width: `${step.width * 100}%` }}
              />
              <span className="absolute inset-y-0 left-3 flex items-center font-mono text-body-sm text-title">
                {step.value}
              </span>
            </div>

            <span className="w-10 shrink-0 text-right font-mono text-[0.6875rem] text-accent">
              {step.drop ?? ''}
            </span>
          </div>
        ))}
      </div>
    </figure>
  );
}
