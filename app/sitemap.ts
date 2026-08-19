import type { MetadataRoute } from 'next';
import { projects } from '@/content/projects';
import { getAllPosts } from '@/lib/mdx';
import { absoluteUrl } from '@/lib/seo';

/** Sitemap gerado a partir do conteúdo — nada de lista manual para esquecer. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: absoluteUrl('/insights'), lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    {
      url: absoluteUrl('/politica-de-privacidade'),
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    { url: absoluteUrl('/termos-de-uso'), lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: absoluteUrl(`/projetos/${project.slug}`),
    lastModified: new Date(`${project.year}-12-01`),
    changeFrequency: 'yearly',
    priority: 0.8,
  }));

  const postRoutes: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: absoluteUrl(`/insights/${post.slug}`),
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes, ...postRoutes];
}
