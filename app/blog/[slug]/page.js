import { getAllBlogSlugs, getBlogBySlug } from '@/lib/markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

// Pre-render every post at build time (required for static hosting).
export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export default function BlogPostPage({ params }) {
  const blog = getBlogBySlug(params.slug);
  
  if (!blog) {
    return <div>Blog not found</div>;
  }

  return (
    <div className="prose prose-lg max-w-4xl mx-auto py-24 px-4">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {blog.content}
      </ReactMarkdown>
    </div>
  );
}