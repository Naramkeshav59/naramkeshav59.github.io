'use client';

import { useState, useEffect } from 'react';
import { Search, X, Calendar, Clock, ArrowRight } from 'lucide-react';
import { portfolioData } from '../data/portfolio-data';

export default function BlogPage({ darkMode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  // tags on a post page link back here as /?tag=Evals#blog
  useEffect(() => {
    const tag = new URLSearchParams(window.location.search).get('tag');
    if (tag) setSelectedTag(tag);
  }, []);

  const blogs = [...portfolioData.blogs].sort((a, b) => b.date.localeCompare(a.date));
  const tagCounts = blogs.flatMap((b) => b.tags).reduce((acc, t) => ({ ...acc, [t]: (acc[t] || 0) + 1 }), {});
  const allTags = ['All', ...Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a] || a.localeCompare(b))];

  const filtered = blogs.filter((blog) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = blog.title.toLowerCase().includes(q) || blog.excerpt.toLowerCase().includes(q);
    return matchesSearch && (selectedTag === 'All' || blog.tags.includes(selectedTag));
  });

  const card = darkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-gray-300';
  const muted = darkMode ? 'text-gray-400' : 'text-gray-500';
  const chip = (active) => `px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
    active
      ? 'bg-blue-700 text-white'
      : darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
  }`;

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-4xl font-bold tracking-tight mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Writing</h1>
        <p className={`text-lg mb-10 ${muted}`}>
          Engineering notes from building agents, retrieval systems and fine-tuned models: what the measurements showed.
        </p>

        <div className="relative mb-5">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${muted}`} size={18} />
          <input
            type="text"
            placeholder="Search posts"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-10 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
            }`}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2" aria-label="Clear search">
              <X size={18} className={muted} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {allTags.map((tag) => (
            <button key={tag} onClick={() => setSelectedTag(tag)} className={chip(selectedTag === tag)}>
              {tag}{tag !== 'All' && <span className="ml-1 opacity-60">{tagCounts[tag]}</span>}
            </button>
          ))}
        </div>

        <div className="space-y-5">
          {filtered.map((blog) => (
            <a key={blog.slug} href={`/blog/${blog.slug}/`}
              className={`block p-6 rounded-2xl border transition-colors ${card}`}>
              <div className="flex flex-wrap gap-2 mb-3">
                {blog.tags.map((tag) => (
                  <span key={tag} className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${darkMode ? 'bg-blue-900/40 text-blue-200' : 'bg-blue-50 text-blue-800'}`}>
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className={`text-xl sm:text-2xl font-semibold tracking-tight mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {blog.title}
              </h2>
              <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{blog.excerpt}</p>
              <div className={`flex items-center gap-4 text-sm ${muted}`}>
                <span className="flex items-center"><Calendar size={15} className="mr-1" />
                  {new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}
                </span>
                <span className="flex items-center"><Clock size={15} className="mr-1" />{blog.readTime} min read</span>
                <span className={`ml-auto flex items-center font-medium ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                  Read <ArrowRight size={15} className="ml-1" />
                </span>
              </div>
            </a>
          ))}
          {filtered.length === 0 && (
            <div className={`text-center py-12 ${muted}`}>
              <p>No posts match.</p>
              <button onClick={() => { setSearchTerm(''); setSelectedTag('All'); }} className="mt-3 text-blue-700 hover:underline">
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
