'use client';

import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal';
import { Parallax } from '@/components/motion/parallax';
import { SectionHeading } from '@/components/section-heading';
import { about } from '@/content/about';
import { site } from '@/content/site';

/**
 * Bloco assimétrico: texto à esquerda (5 col), composição visual à direita
 * (7 col) com parallax por scrub. A composição é vetorial e usa duotone azul —
 * quando houver foto do time, ela entra no mesmo frame com a classe `.duotone`.
 */
export function About() {
  return (
    <section id="sobre" aria-labelledby="sobre-titulo" className="section-y relative">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 lg:col-span-5">
            <SectionHeading
              index="07"
              eyebrow={about.eyebrow}
              titleId="sobre-titulo"
              title={about.title}
            />

            <div className="mt-8 space-y-5 text-body">
              {about.paragraphs.map((paragraph) => (
                <Reveal key={paragraph.slice(0, 24)} delay={0.05}>
                  <p>{paragraph}</p>
                </Reveal>
              ))}
            </div>

            <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2" stagger={0.07}>
              {about.values.map((value) => (
                <RevealItem key={value.title}>
                  <div className="card-surface h-full rounded-card p-5">
                    <h3 className="text-body-sm font-bold text-title">{value.title}</h3>
                    <p className="mt-2 text-body-sm text-muted">{value.description}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          {/* Composição visual */}
          <div className="relative min-w-0 lg:col-span-7">
            <Parallax speed={-0.08} className="relative">
              <div className="relative overflow-hidden rounded-bento border border-line/70 bg-ink-800 p-8 lg:p-10">
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background:
                      'radial-gradient(90% 70% at 80% 0%, rgb(var(--glow) / 0.22), transparent 60%)',
                  }}
                />
                <div className="grid-layer" />

                <div className="relative">
                  <p className="font-mono text-label uppercase text-brand-soft">
                    {site.contact.city} · {site.contact.state}
                  </p>
                  <p className="mt-4 max-w-sm font-display text-display-md text-title">
                    Time fixo. Quem vende é quem constrói.
                  </p>

                  {/* Cards do time em duotone azul */}
                  <ul className="mt-9 grid gap-3 sm:grid-cols-2">
                    {about.team.map((member) => (
                      <li
                        key={member.name}
                        className="group flex items-center gap-4 rounded-card border border-line/70 bg-surface/50 p-4 transition-transform duration-500 ease-expo hover:-translate-y-1"
                      >
                        {/* TODO: substituir por foto real tratada em duotone (400×400) */}
                        <span className="relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-[14px] bg-gradient-to-br from-brand/70 to-accent/40 font-mono text-body-sm text-white">
                          <span className="absolute inset-0 opacity-40 mix-blend-overlay [background-image:radial-gradient(circle_at_30%_20%,white,transparent_60%)]" />
                          <span className="relative">{member.initials}</span>
                        </span>
                        <span className="min-w-0">
                          <span className="block text-body-sm font-bold text-title">
                            {member.name}
                          </span>
                          <span className="block text-body-sm text-muted">{member.role}</span>
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="divider-glow my-8" />

                  <dl className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Fundação', value: String(site.foundedYear) },
                      { label: 'Time', value: `${about.team.length + 3} pessoas` },
                      { label: 'Base', value: `${site.contact.city}/${site.contact.state}` },
                    ].map((item) => (
                      <div key={item.label}>
                        <dt className="font-mono text-label uppercase text-muted">{item.label}</dt>
                        <dd className="mt-2 font-mono text-body-sm text-title">{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </Parallax>

            {/* Cartão flutuante deslocado — quebra a grade de propósito */}
            <Parallax speed={0.12} className="absolute -bottom-8 -left-6 hidden w-64 lg:block">
              <div className="glass rounded-card p-5 shadow-float">
                <p className="font-mono text-label uppercase text-accent">Compromisso</p>
                <p className="mt-3 text-body-sm text-body">
                  Se o prazo combinado atrasar por nossa causa, você não paga a parcela daquele
                  marco. Está em contrato.
                </p>
              </div>
            </Parallax>
          </div>
        </div>
      </div>
    </section>
  );
}
