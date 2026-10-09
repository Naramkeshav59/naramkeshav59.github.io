import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { getAllBlogSlugs, getBlogBySlug } from '@/lib/markdown';
import CopyLink from '@/components/CopyLink';
import ThemeSync from '@/components/ThemeSync';
import { SITE } from '@/lib/site';
import { portfolioData } from '@/data/portfolio-data';

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

function excerptFor(slug, blog) {
  const listed = portfolioData.blogs.find((b) => b.slug === slug);
  if (listed) return listed.excerpt;
  // fallback: first paragraph of the post
  return blog.content.split(/\n\s*\n/).find((p) => p.trim() && !p.startsWith('#'))?.trim().slice(0, 200) ?? '';
}

export function generateMetadata({ params }) {
  const blog = getBlogBySlug(params.slug);
  if (!blog) return { title: 'Post not found' };
  const { title, date, tags = [] } = blog.frontmatter;
  const description = excerptFor(params.slug, blog);
  const path = `/blog/${params.slug}/`;
  return {
    title,
    description,
    keywords: tags,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      url: path,
      title,
      description,
      publishedTime: date,
      authors: [SITE.name],
      tags,
      images: [{ url: SITE.image, alt: SITE.name }],
    },
    twitter: { card: 'summary', title, description, images: [SITE.image] },
  };
}

function postJsonLd(slug, blog) {
  const { title, date, tags = [] } = blog.frontmatter;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: excerptFor(slug, blog),
    datePublished: date,
    keywords: tags.join(', '),
    url: `${SITE.url}/blog/${slug}/`,
    mainEntityOfPage: `${SITE.url}/blog/${slug}/`,
    author: { '@type': 'Person', name: SITE.name, url: SITE.url },
  };
}

export default function BlogPostPage({ params }) {
  const blog = getBlogBySlug(params.slug);
  if (!blog) {
    return <div className="p-24 text-center">Post not found.</div>;
  }
  const { title, date, tags = [] } = blog.frontmatter;
  const minutes = Math.max(1, Math.round(blog.content.split(/\s+/).length / 220));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ThemeSync />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(postJsonLd(params.slug, blog)) }} />
      <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">Keshav Naram</Link>
          <nav className="flex gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
            <a href="/#projects" className="hover:text-gray-900 dark:hover:text-white">Projects</a>
            <a href="/#blog" className="hover:text-gray-900 dark:hover:text-white">Writing</a>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-28 pb-24">
        <a href="/#blog" className="inline-flex items-center text-sm text-blue-700 dark:text-blue-400 hover:underline mb-8">
          <ArrowLeft size={16} className="mr-1" /> All writing
        </a>

        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <a key={tag} href={`/?tag=${encodeURIComponent(tag)}#blog`}
              className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-900">
              {tag}
            </a>
          ))}
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">{title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-10">
          <span className="flex items-center"><Calendar size={15} className="mr-1" />
            {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
          </span>
          <span className="flex items-center"><Clock size={15} className="mr-1" />{minutes} min read</span>
          <CopyLink />
        </div>

        <article className="prose prose-lg prose-zinc dark:prose-invert max-w-none prose-headings:tracking-tight prose-a:text-blue-700 dark:prose-a:text-blue-400 prose-table:text-base">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
            {blog.content}
          </ReactMarkdown>
        </article>

        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Keshav Naram · Machine Learning Engineer</span>
          <CopyLink />
        </div>
      </main>
    </div>
  );
}
