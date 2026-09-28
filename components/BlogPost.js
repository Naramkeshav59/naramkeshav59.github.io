'use client';

import { Calendar, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

function removeFrontmatter(markdown) {
  return markdown.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '');
}

export default function BlogPost({ blog, darkMode, onBack }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/content/blogs/${blog.slug}.md`)
      .then(res => res.text())
      .then(text => {
        setContent(removeFrontmatter(text));
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading blog:', err);
        setContent(blog.excerpt);
        setLoading(false);
      });
  }, [blog.slug, blog.excerpt]);

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className={`mb-6 flex items-center ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
        >
          ← Back to Blog
        </button>

        <article>
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.map((tag, idx) => (
              <span key={idx} 
                className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'}`}>
                {tag}
              </span>
            ))}
          </div>

          <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {blog.title}
          </h1>

          <div className="flex items-center space-x-4 mb-8 text-sm">
            <span className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <Calendar size={16} className="mr-1" />
              {new Date(blog.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <Clock size={16} className="mr-1" />
              {blog.readTime} min read
            </span>
            <span className={`px-3 py-1 rounded-full ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
              {blog.category}
            </span>
          </div>

          {loading ? (
            <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Loading...
            </div>
          ) : (
            <div className={`prose prose-lg max-w-none ${darkMode ? 'prose-invert text-gray-200' : 'text-gray-900'}`}>
              <div className={`p-8 rounded-lg ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'} shadow-lg`}>
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    code({node, inline, className, children, ...props}) {
                      return inline ? (
                        <code className={`${darkMode ? 'bg-gray-900 text-blue-300' : 'bg-gray-100 text-blue-600'} px-1 py-0.5 rounded text-sm`} {...props}>
                          {children}
                        </code>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}