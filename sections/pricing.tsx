'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Check, Close, Minus } from '@/components/icons/ui-icons';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal';
import { SectionHeading } from '@/components/section-heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { annualDiscountLabel, comparisonGroups, paymentNote, plans, type Plan } from '@/content/pricing';
import { track } from '@/lib/analytics';
import { formatCurrencyValue } from '@/lib/format';
import { EASE_EXPO } from '@/lib/motion';
import { cn } from '@/lib/utils';

export function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="precos" aria-labelledby="precos-titulo" className="section-y relative overflow-hidden">
      {/* halo atrás do plano do meio */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[34rem] w-[34rem] -translate-x-1/2 rounded-pill blur-[130px]"
        style={{ background: 'radial-gradient(circle, rgb(var(--glow) / 0.16), transparent 65%)' }}
      />

      <div className="shell">
        <SectionHeading
          index="04"
          eyebrow="Preços"
          titleId="precos-titulo"
          title="Preço na mesa antes da primeira reunião."
          description="Faixas reais para você saber se faz sentido conversar. O valor final sai fechado na proposta, depois do diagnóstico."
          align="center"
        />

        {/* Toggle mensal/anual */}
        <Reveal delay={0.1} className="mt-10 flex flex-col items-center gap-4">
          <div className="glass flex items-center gap-4 rounded-pill px-5 py-3">
            <span
              className={cn(
                'font-mono text-body-sm transition-colors duration-micro',
                !annual ? 'text-title' : 'text-muted',
              )}
            >
              Mensal
            </span>
            <Switch
              checked={annual}
              onCheckedChange={(checked) => {
                setAnnual(checked);
                track('pricing_toggle', { plan: checked ? 'anual' : 'mensal' });
              }}
              aria-label="Alternar entre cobrança mensal e anual"
            />
            <span
              className={cn(
                'font-mono text-body-sm transition-colors duration-micro',
                annual ? 'text-title' : 'text-muted',
              )}
            >
              Anual
            </span>
            <AnimatePresence>
              {annual ? (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8, x: -6 }}
                  animate={{ opacity: 1, scale: 1, x: 0, transition: { duration: 0.4, ease: EASE_EXPO } }}
                  exit={{ opacity: 0, scale: 0.8, x: -6, transition: { duration: 0.2 } }}
                >
                  <Badge variant="accent">{annualDiscountLabel}</Badge>
                </motion.span>
              ) : null}
            </AnimatePresence>
          </div>
        </Reveal>

        <RevealGroup className="mt-12 grid items-stretch gap-5 lg:grid-cols-3" stagger={0.08}>
          {plans.map((plan) => (
            <RevealItem key={plan.id} className="h-full min-w-0">
              <PlanCard plan={plan} annual={annual} />
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-8 max-w-2xl text-center text-body-sm text-muted">{paymentNote}</p>
        </Reveal>

        <ComparisonTable />
      </div>
    </section>
  );
}

function PlanCard({ plan, annual }: { plan: Plan; annual: boolean }) {
  const price = annual ? plan.priceAnnual : plan.priceMonthly;
  const highlighted = plan.highlighted;

  return (
    <div
      className={cn(
        'relative flex h-full min-w-0 flex-col overflow-hidden rounded-bento p-7 transition-transform duration-500 ease-expo sm:p-8',
        highlighted
          ? 'bg-surface/80 lg:-translate-y-4 lg:scale-[1.02]'
          : 'card-surface hover:-translate-y-1.5',
      )}
    >
      {/* Borda em gradiente animado no plano destacado */}
      {highlighted ? (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-bento"
          >
            <span className="absolute left-1/2 top-1/2 h-[220%] w-[220%] -translate-x-1/2 -translate-y-1/2 animate-border-spin bg-[conic-gradient(from_0deg,transparent_0deg,rgb(var(--brand))_60deg,rgb(var(--accent))_120deg,transparent_190deg)]" />
          </span>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-px -z-10 rounded-[27px] bg-surface"
          />
        </>
      ) : null}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-display-sm text-title">{plan.name}</h3>
          <p className="mt-1.5 text-body-sm text-muted">{plan.audience}</p>
        </div>
        {plan.badge ? <Badge variant="solid">{plan.badge}</Badge> : null}
      </div>

      <p className="mt-6 text-body-sm text-body">{plan.description}</p>

      <div className="mt-8">
        {plan.prefix ? (
          <p className="font-mono text-label uppercase text-muted">{plan.prefix}</p>
        ) : null}
        <p className="mt-2 flex items-baseline gap-1.5">
          {price === null ? (
            <span className="font-display text-[clamp(1.7rem,6.4vw,2.25rem)] font-bold leading-none tracking-[-0.035em] text-title">
              Sob consulta
            </span>
          ) : (
            <>
              <span className="font-mono text-lead text-muted">R$</span>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={price}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE_EXPO } }}
                  exit={{ opacity: 0, y: -12, transition: { duration: 0.15 } }}
                  className="numeric font-display text-[clamp(2.25rem,8vw,3rem)] font-bold leading-none tracking-[-0.04em] text-title"
                >
                  {formatCurrencyValue(price)}
                </motion.span>
              </AnimatePresence>
              {plan.suffix ? (
                <span className="font-mono text-body-sm text-muted">{plan.suffix}</span>
              ) : null}
            </>
          )}
        </p>
        <p className="mt-3 text-body-sm text-muted">{plan.priceNote}</p>
      </div>

      <div className="divider-glow my-7" />

      <p className="font-mono text-label uppercase text-brand-soft">{plan.delivery}</p>

      <ul className="mt-5 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-body-sm text-body">
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-pill border border-brand/40 bg-brand/12 text-brand-soft transition-transform duration-300 ease-expo hover:scale-110">
              <Check className="h-3 w-3" />
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <Button
        asChild
        variant={highlighted ? 'primary' : 'outline'}
        size="lg"
        className="mt-8 w-full"
        trailing={<ArrowRight className="h-5 w-5" />}
        onClick={() => track('cta_click', { location: 'pricing', plan: plan.id })}
      >
        <Link href={plan.cta.href}>{plan.cta.label}</Link>
      </Button>
    </div>
  );
}

function Cell({ value }: { value: string | boolean }) {
  if (value === true)
    return (
      <span className="inline-grid h-6 w-6 place-items-center rounded-pill bg-brand/15 text-brand-soft">
        <Check className="h-3.5 w-3.5" />
        <span className="sr-only">Incluído</span>
      </span>
    );
  if (value === false)
    return (
      <span className="inline-grid h-6 w-6 place-items-center rounded-pill bg-surface text-muted">
        <Minus className="h-3.5 w-3.5" />
        <span className="sr-only">Não incluído</span>
      </span>
    );
  return <span className="font-mono text-body-sm text-body">{value}</span>;
}

function ComparisonTable() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-16">
      <Reveal className="flex justify-center">
        <Button variant="secondary" onClick={() => setOpen((value) => !value)}>
          {open ? 'Esconder comparativo' : 'Ver comparativo completo'}
        </Button>
      </Reveal>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_EXPO } }}
            exit={{ opacity: 0, y: 8, transition: { duration: 0.25 } }}
            className="mt-10 overflow-hidden rounded-bento border border-line/70"
          >
            <div className="no-scrollbar overflow-x-auto">
              <table className="w-full min-w-[46rem] border-collapse text-left">
                <caption className="sr-only">
                  Comparativo de recursos entre os planos Essencial, Growth e Sob medida
                </caption>
                <thead>
                  <tr className="bg-surface/70">
                    <th scope="col" className="px-6 py-5 font-mono text-label uppercase text-muted">
                      Recurso
                    </th>
                    {plans.map((plan) => (
                      <th
                        key={plan.id}
                        scope="col"
                        className={cn(
                          'px-6 py-5 font-display text-display-sm text-title',
                          plan.highlighted && 'text-brand-soft',
                        )}
                      >
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonGroups.map((group) => (
                    <>
                      <tr key={group.group} className="bg-surface/40">
                        <th
                          scope="colgroup"
                          colSpan={4}
                          className="px-6 py-3 font-mono text-label uppercase text-brand-soft"
                        >
                          {group.group}
                        </th>
                      </tr>
                      {group.rows.map((row) => (
                        <tr key={row.feature} className="border-t border-line/50">
                          <th
                            scope="row"
                            className="px-6 py-4 text-body-sm font-normal text-body"
                          >
                            {row.feature}
                          </th>
                          <td className="px-6 py-4">
                            <Cell value={row.essencial} />
                          </td>
                          <td className="bg-brand/[0.04] px-6 py-4">
                            <Cell value={row.growth} />
                          </td>
                          <td className="px-6 py-4">
                            <Cell value={row.sobMedida} />
                          </td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
