import Link from 'next/link';
import { ArrowUpRight } from '@/components/icons/ui-icons';
import { JsonLd } from '@/components/json-ld';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal';
import { SplitText } from '@/components/motion/split-text';
import { getAllPosts } from '@/lib/mdx';
import { formatDate } from '@/lib/format';
import { breadcrumbSchema } from '@/lib/jsonld';
import { buildMetadata } from '@/lib/seo';
import { cn } from '@/lib/utils';

export const metadata = buildMetadata({
  title: 'Insights',
  description:
    'Textos diretos sobre preço de software, automação, performance e o que realmente muda resultado em projeto digital.',
  path: '/insights',
  ogTitle: 'Insights da Softly',
  ogSubtitle: 'Preço, automação e performance explicados sem jargão.',
});

/** Índice do blog. Para publicar, basta criar um .mdx em content/blog. */
export default function InsightsPage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <div className="pb-24">
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Início', path: '/' },
          { name: 'Insights', path: '/insights' },
        ])}
      />

      <header className="relative isolate overflow-hidden pb-14 pt-[calc(var(--header-h)+4rem)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-[12%] -top-[26%] -z-10 h-[38rem] w-[38rem] animate-mesh-drift rounded-pill blur-[130px]"
          style={{ background: 'radial-gradient(circle, rgb(var(--glow) / 0.3), transparent 62%)' }}
        />
        <div className="grid-layer -z-10" />

        <div className="shell">
          <Reveal>
            <p className="eyebrow">Insights</p>
          </Reveal>
          <h1 className="mt-6 max-w-3xl text-display-hero text-title">
            <SplitText text="O que a gente aprendeu construindo." mode="word" />
          </h1>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-xl text-lead text-body">
              Sem post de “5 dicas”. Texto sobre decisão real de projeto: quanto custa, o que
              automatizar, o que medir e onde a maioria erra.
            </p>
          </Reveal>
        </div>
      </header>

      <div className="shell">
        {featured ? (
          <Reveal>
            <Link
              href={`/insights/${featured.slug}`}
              data-cursor="ler"
              className="card-surface border-sheen group grid gap-8 overflow-hidden rounded-bento p-8 transition-transform duration-500 ease-expo hover:-translate-y-1.5 lg:grid-cols-12 lg:p-10"
            >
              <div className="lg:col-span-8">
                <div className="flex flex-wrap items-center gap-3 font-mono text-label uppercase text-muted">
                  <span className="rounded-pill border border-brand/40 bg-brand/12 px-3 py-1.5 text-brand-soft">
                    {featured.category}
                  </span>
                  <span>{formatDate(featured.date)}</span>
                  <span aria-hidden="true">·</span>
                  <span>{featured.readingTime} min de leitura</span>
                </div>
                <h2 className="mt-6 text-display-lg text-title">{featured.title}</h2>
                <p className="mt-4 max-w-2xl text-body text-body">{featured.description}</p>
              </div>
              <div className="flex items-end justify-start lg:col-span-4 lg:justify-end">
                <span className="inline-flex items-center gap-2 font-mono text-label uppercase text-brand-soft">
                  Ler agora
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-expo group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
              </div>
            </Link>
          </Reveal>
        ) : null}

        <RevealGroup className="mt-5 grid gap-5 md:grid-cols-2">
          {rest.map((post) => (
            <RevealItem key={post.slug}>
              <Link
                href={`/insights/${post.slug}`}
                data-cursor="ler"
                className={cn(
                  'card-surface border-sheen group flex h-full flex-col rounded-bento p-7 transition-transform duration-500 ease-expo hover:-translate-y-1.5',
                )}
              >
                <div className="flex flex-wrap items-center gap-3 font-mono text-label uppercase text-muted">
                  <span className="rounded-pill border border-line px-3 py-1.5">{post.category}</span>
                  <span>{post.readingTime} min</span>
                </div>
                <h2 className="mt-6 text-display-sm text-title">{post.title}</h2>
                <p className="mt-3 flex-1 text-body-sm text-body">{post.description}</p>
                <div className="mt-6 flex items-center justify-between gap-4">
                  <span className="font-mono text-label uppercase text-muted">
                    {formatDate(post.date)}
                  </span>
                  <span className="grid h-9 w-9 place-items-center rounded-pill border border-line text-brand-soft transition-all duration-300 ease-expo group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </div>
  );
}
