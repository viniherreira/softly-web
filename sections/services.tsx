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
              O que a Softly constrói —{' '}
              <span className="text-accent-gradient">e o problema que cada coisa resolve.</span>
            </>
          }
          description="Seis frentes, um critério: entra no escopo o que muda um número do seu negócio. O resto a gente diz que não vale a pena."
        />

        <RevealGroup className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-12" stagger={0.075}>
          {services.map((service) => (
            <RevealItem
              key={service.id}
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

  return (
    <SpotlightCard
      as="article"
      className={cn(
        'flex h-full flex-col p-7 lg:p-8',
        featured && 'lg:p-10',
        band && 'lg:flex-row lg:items-center lg:gap-12',
      )}
    >
      <div className={cn(band && 'lg:max-w-md')}>
        <ServiceGlyph name={service.icon} />

        <h3
          className={cn(
            'mt-6 text-display-sm text-title',
            featured && 'text-display-md',
          )}
        >
          {service.title}
        </h3>

        <p className={cn('mt-3 text-body-sm text-body', featured && 'max-w-md text-body')}>
          {service.description}
        </p>
      </div>

      <div className={cn('mt-6 flex flex-1 flex-col', band && 'lg:mt-0 lg:flex-row lg:items-center lg:gap-12')}>
        <ul className={cn('space-y-2.5', band && 'lg:grid lg:grid-cols-3 lg:gap-x-8 lg:space-y-0')}>
          {service.deliverables.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-body-sm text-muted">
              <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-brand-soft" />
              {item}
            </li>
          ))}
        </ul>

        {/* Ilustração exclusiva do card em destaque */}
        {featured ? <FeaturedIllustration /> : null}

        <div className={cn('mt-7 pt-1', band ? 'lg:ml-auto lg:mt-0' : 'mt-auto')}>
          <Link
            href={service.href}
            className="group/link inline-flex items-center gap-2 font-mono text-label uppercase text-brand-soft"
          >
            Saiba mais
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-expo group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </SpotlightCard>
  );
}

/** Composição própria do card grande: um "funil" que ganha luz no hover. */
function FeaturedIllustration() {
  return (
    <div className="relative mt-8 aspect-[16/7] w-full overflow-hidden rounded-[18px] border border-line/60 bg-ink-900/60">
      <div
        className="absolute inset-0 opacity-70 transition-opacity duration-700 ease-expo group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(120% 100% at 20% 0%, rgb(var(--glow) / 0.3), transparent 58%)',
        }}
      />
      <div className="dot-layer" />
      <svg viewBox="0 0 520 220" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="funnel" x1="0" y1="0" x2="520" y2="220" gradientUnits="userSpaceOnUse">
            <stop stopColor="rgb(var(--brand-soft))" />
            <stop offset="1" stopColor="rgb(var(--accent))" />
          </linearGradient>
        </defs>
        {[0, 1, 2].map((index) => (
          <g key={index}>
            <rect
              x={60 + index * 60}
              y={40 + index * 22}
              width={400 - index * 120}
              height="34"
              rx="17"
              fill="rgb(var(--ink-700))"
              fillOpacity={0.8 - index * 0.18}
              stroke="rgb(var(--border))"
            />
            <rect
              x={60 + index * 60}
              y={40 + index * 22}
              width={(400 - index * 120) * (0.9 - index * 0.22)}
              height="34"
              rx="17"
              fill="url(#funnel)"
              fillOpacity={0.22}
              className="origin-left transition-transform duration-700 ease-expo group-hover:scale-x-105"
            />
          </g>
        ))}
        <text
          x="60"
          y="176"
          className="fill-[rgb(var(--slate-500))] font-mono"
          fontSize="13"
          letterSpacing="2"
        >
          VISITA → CONTATO → CLIENTE
        </text>
        <circle cx="452" cy="170" r="6" fill="rgb(var(--accent))" />
      </svg>
    </div>
  );
}
