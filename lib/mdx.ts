import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

/**
 * Blog em MDX lido do sistema de arquivos em tempo de build.
 * Para publicar um post novo: criar content/blog/<slug>.mdx com o frontmatter
 * abaixo. Nenhum cadastro em outro lugar é necessário.
 */
export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  readingTime: number;
  category: string;
  author: string;
  featured?: boolean;
};

export type Post = PostFrontmatter & { slug: string; content: string };

const BLOG_DIR = join(process.cwd(), 'content', 'blog');

export function getPostSlugs(): string[] {
  return readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
}

export function getPost(slug: string): Post | null {
  try {
    const raw = readFileSync(join(BLOG_DIR, `${slug}.mdx`), 'utf8');
    const { data, content } = matter(raw);
    return { ...(data as PostFrontmatter), slug, content };
  } catch {
    return null;
  }
}

export function getAllPosts(): Post[] {
  return getPostSlugs()
    .map((slug) => getPost(slug))
    .filter((post): post is Post => post !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
