import { SITE } from '@/lib/site';
import { getAllBlogSlugs, getBlogBySlug } from '@/lib/markdown';

export const dynamic = 'force-static';

export default function sitemap() {
  const posts = getAllBlogSlugs().map((slug) => {
    const { date } = getBlogBySlug(slug)?.frontmatter ?? {};
    return {
      url: `${SITE.url}/blog/${slug}/`,
      lastModified: date ? new Date(date) : new Date(),
      changeFrequency: 'yearly',
      priority: 0.7,
    };
  });
  return [{ url: `${SITE.url}/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 }, ...posts];
}
