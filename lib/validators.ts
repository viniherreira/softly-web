import { z } from 'zod';

/** Aceita "(48) 98844-0132", "48988440132", "+55 48 98844-0132". */
const phoneRegex = /^(\+?55\s?)?\(?\d{2}\)?[\s.-]?\d{4,5}[\s.-]?\d{4}$/;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Digite seu nome.')
    .max(80, 'Nome muito longo.'),
  phone: z
    .string()
    .trim()
    .min(10, 'Digite um WhatsApp com DDD.')
    .max(20, 'Número muito longo.')
    .regex(phoneRegex, 'Confira o número: use DDD + número.'),
  email: z
    .string()
    .trim()
    .email('Digite um e-mail válido.')
    .max(120)
    .optional()
    .or(z.literal('')),
  projectType: z.string().trim().min(2, 'Escolha o tipo de projeto.').max(60),
  message: z.string().trim().max(1200, 'Mensagem muito longa.').optional().or(z.literal('')),
  /**
   * Campo escondido (honeypot). Não validamos aqui de propósito: a rota trata
   * o preenchimento respondendo 200 em silêncio, para o robô não descobrir
   * qual campo o denunciou.
   */
  website: z.string().max(200).optional(),
  /** Resumo opcional vindo da calculadora de orçamento. */
  estimate: z
    .object({
      total: z.number().nonnegative(),
      min: z.number().nonnegative(),
      max: z.number().nonnegative(),
      weeks: z.number().nonnegative(),
      summary: z.string().max(400),
    })
    .optional(),
  source: z.string().max(60).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({
  email: z.string().trim().email('Digite um e-mail válido.').max(120),
  website: z.string().max(0).optional(),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
