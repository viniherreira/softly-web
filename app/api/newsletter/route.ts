import { NextResponse } from 'next/server';
import { clientKey, rateLimit } from '@/lib/rate-limit';
import { newsletterSchema } from '@/lib/validators';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Inscrição na newsletter (Insights).
 * Mesmo trio de proteção do formulário de contato.
 * Configure NEWSLETTER_WEBHOOK_URL para plugar no seu provedor de e-mail.
 */
export async function POST(request: Request) {
  const limit = rateLimit(`newsletter:${clientKey(request.headers)}`, { limit: 3, windowMs: 60_000 });
  if (!limit.success) {
    return NextResponse.json(
      { message: 'Calma lá. Tente de novo em um minuto.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: 'Requisição inválida.' }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? 'E-mail inválido.' },
      { status: 422 },
    );
  }

  if (parsed.data.website) return NextResponse.json({ message: 'Inscrito.' });

  const webhook = process.env.NEWSLETTER_WEBHOOK_URL;
  try {
    if (webhook) {
      const response = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: parsed.data.email, origem: 'site' }),
      });
      if (!response.ok) throw new Error(`Webhook respondeu ${response.status}`);
    } else {
      // eslint-disable-next-line no-console
      console.info('[newsletter] inscrição recebida (sem integração):', parsed.data.email);
    }
    return NextResponse.json({ message: 'Pronto. Você recebe o próximo Insights.' });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[newsletter] falha:', error);
    return NextResponse.json({ message: 'Não deu certo agora. Tente mais tarde.' }, { status: 502 });
  }
}
