/**
 * Rate limit em memória (janela deslizante simples).
 *
 * Suficiente para uma instância serverless de baixo volume: cada instância
 * mantém seu próprio mapa e o processo é reciclado com frequência.
 * TODO: para volume alto ou múltiplas regiões, trocar por Upstash Redis
 * (@upstash/ratelimit) — a interface abaixo já é compatível.
 */
type Entry = { count: number; expiresAt: number };

const buckets = new Map<string, Entry>();

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export function rateLimit(
  key: string,
  { limit = 5, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {},
): RateLimitResult {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || entry.expiresAt <= now) {
    buckets.set(key, { count: 1, expiresAt: now + windowMs });
    return { success: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  entry.count += 1;

  // Limpeza oportunista para o mapa não crescer sem limite.
  if (buckets.size > 5_000) {
    for (const [bucketKey, value] of buckets) {
      if (value.expiresAt <= now) buckets.delete(bucketKey);
    }
  }

  if (entry.count > limit) {
    return {
      success: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((entry.expiresAt - now) / 1000),
    };
  }

  return { success: true, remaining: limit - entry.count, retryAfterSeconds: 0 };
}

/** Melhor esforço para identificar o cliente atrás de proxy/CDN. */
export function clientKey(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || headers.get('x-real-ip') || 'desconhecido';
  return ip;
}
