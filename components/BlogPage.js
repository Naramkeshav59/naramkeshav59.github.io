'use client';

import { useState } from 'react';
import { Search, X, Calendar, Clock } from 'lucide-react';
import { portfolioData } from '../data/portfolio-data';
import BlogPost from './BlogPost';

export default function BlogPage({ darkMode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [selectedBlog, setSelectedBlog] = useState(null);

  const categories = ['All', ...new Set(portfolioData.blogs.map(blog => blog.category))];
  const allTags = ['All', ...new Set(portfolioData.blogs.flatMap(blog => blog.tags))];

  const filteredBlogs = portfolioData.blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
    const matchesTag = selectedTag === 'All' || blog.tags.includes(selectedTag);
    
    return matchesSearch && matchesCategory && matchesTag;
  });

  if (selectedBlog) {
    return (
      <BlogPost 
        blog={selectedBlog} 
        darkMode={darkMode}
        onBack={() => setSelectedBlog(null)}
      />
    );
  }

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className={`text-4xl font-bold mb-4 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Blog & Research
        </h1>
        <p className={`text-xl mb-12 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Insights, tutorials, and research findings in GenAI
        </p>

        {/* Search and Filters */}
        <div className={`mb-8 p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="mb-4">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X size={20} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                </button>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : darkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTag === tag
                      ? darkMode ? 'bg-green-900 text-green-200' : 'bg-green-600 text-white'
                      : darkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Showing {filteredBlogs.length} {filteredBlogs.length === 1 ? 'article' : 'articles'}
        </p>

        <div className="space-y-6">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map(blog => (
              <article key={blog.id} 
                className={`p-6 rounded-lg shadow-lg transition-all cursor-pointer ${darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:shadow-xl'}`}
                onClick={() => setSelectedBlog(blog)}>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {blog.tags.map((tag, idx) => (
                    <span key={idx} 
                      className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'}`}>
                      {tag}
                    </span>
                  ))}
                  <span className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                    {blog.category}
                  </span>
                </div>

                <h2 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {blog.title}
                </h2>

                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {blog.excerpt}
                </p>

                <div className="flex items-center space-x-4 text-sm">
                  <span className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Calendar size={16} className="mr-1" />
                    {new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Clock size={16} className="mr-1" />
                    {blog.readTime} min read
                  </span>
                </div>

                <button className={`mt-4 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                  Read More →
                </button>
              </article>
            ))
          ) : (
            <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <p className="text-lg">No articles found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setSelectedTag('All');
                }}
                className="mt-4 text-blue-600 hover:text-blue-700"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}