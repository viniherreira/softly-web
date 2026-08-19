'use client';

import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Reveal } from '@/components/motion/reveal';
import { SectionHeading } from '@/components/section-heading';
import { faq } from '@/content/faq';
import { site, whatsappUrl } from '@/content/site';

/** FAQ em duas colunas no desktop. As mesmas perguntas alimentam o JSON-LD. */
export function Faq() {
  const half = Math.ceil(faq.length / 2);
  const columns = [faq.slice(0, half), faq.slice(half)];

  return (
    <section id="faq" aria-labelledby="faq-titulo" className="section-y relative">
      <div className="shell">
        <SectionHeading
          index="08"
          eyebrow="Perguntas frequentes"
          titleId="faq-titulo"
          title="O que perguntam antes de fechar."
          description={
            <>
              Ficou algo de fora?{' '}
              <a
                href={whatsappUrl('Olá! Tenho uma dúvida sobre os serviços da Softly.')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-soft underline underline-offset-4"
              >
                Pergunte no WhatsApp
              </a>{' '}
              ou escreva para{' '}
              <Link
                href={`mailto:${site.contact.email}`}
                className="text-brand-soft underline underline-offset-4"
              >
                {site.contact.email}
              </Link>
              .
            </>
          }
        />

        <div className="mt-14 grid gap-4 lg:grid-cols-2 lg:gap-5">
          {columns.map((column, columnIndex) => (
            <Reveal key={columnIndex} delay={columnIndex * 0.08} className="space-y-4">
              <Accordion type="single" collapsible className="space-y-4">
                {column.map((item) => (
                  <AccordionItem key={item.question} value={item.question}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
