import Link from 'next/link';
import type { MDXComponents } from 'mdx/types';

/**
 * Estilo do conteúdo em MDX.
 * Nenhum plugin de tipografia: cada elemento é estilizado com os tokens do
 * design system, para o post ter a mesma voz visual do resto do site.
 */
export const mdxComponents: MDXComponents = {
  h2: ({ children }) => (
    <h2 className="mt-14 text-display-lg text-title first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => <h3 className="mt-10 text-display-sm text-title">{children}</h3>,
  p: ({ children }) => <p className="mt-5 text-body text-body">{children}</p>,
  ul: ({ children }) => <ul className="mt-5 space-y-3">{children}</ul>,
  ol: ({ children }) => <ol className="mt-5 list-decimal space-y-3 pl-5">{children}</ol>,
  li: ({ children }) => (
    <li className="relative pl-6 text-body text-body marker:text-brand-soft [ol>&]:pl-0">
      <span
        aria-hidden="true"
        className="absolute left-0 top-3 h-1.5 w-1.5 rounded-pill bg-brand-soft [ol>&]:hidden"
      />
      {children}
    </li>
  ),
  strong: ({ children }) => <strong className="font-bold text-title">{children}</strong>,
  em: ({ children }) => <em className="text-brand-soft">{children}</em>,
  a: ({ href, children }) => {
    const target = href ?? '#';
    const external = target.startsWith('http');
    return external ? (
      <a
        href={target}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand-soft underline underline-offset-4 transition-colors hover:text-accent"
      >
        {children}
      </a>
    ) : (
      <Link
        href={target}
        className="text-brand-soft underline underline-offset-4 transition-colors hover:text-accent"
      >
        {children}
      </Link>
    );
  },
  blockquote: ({ children }) => (
    <blockquote className="mt-8 border-l-2 border-brand/60 pl-6 text-lead text-title">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="no-scrollbar mt-8 overflow-x-auto rounded-card border border-line/70">
      <table className="w-full min-w-[32rem] border-collapse text-left">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-surface/70">{children}</thead>,
  th: ({ children }) => (
    <th className="px-5 py-4 font-mono text-label uppercase text-muted">{children}</th>
  ),
  td: ({ children }) => (
    <td className="border-t border-line/50 px-5 py-4 text-body-sm text-body">{children}</td>
  ),
  code: ({ children }) => (
    <code className="rounded-[6px] border border-line/70 bg-surface/70 px-1.5 py-0.5 font-mono text-[0.9em] text-brand-soft">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="no-scrollbar mt-6 overflow-x-auto rounded-card border border-line/70 bg-surface/60 p-5 font-mono text-body-sm">
      {children}
    </pre>
  ),
  hr: () => <div className="divider-glow my-12" />,
};
