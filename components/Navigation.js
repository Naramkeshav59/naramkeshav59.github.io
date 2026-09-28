'use client';

import { useState } from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';

export default function Navigation({ currentPage, setCurrentPage, darkMode, setDarkMode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pages = [
    { id: 'home', label: 'Home' },
    { id: 'projects', label: 'Projects' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 backdrop-blur-md ${darkMode ? 'bg-gray-900/90 border-gray-800' : 'bg-white/90 border-gray-200'} border-b`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={() => setCurrentPage('home')}
              className={`font-comic tracking-wider text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}
            >
              Portfolio
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {pages.map(page => (
              <button
                key={page.id}
                onClick={() => setCurrentPage(page.id)}
                className={`font-medium transition-colors ${
                  currentPage === page.id
                    ? darkMode ? 'text-blue-400' : 'text-blue-600'
                    : darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {page.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {pages.map(page => (
              <button
                key={page.id}
                onClick={() => {
                  setCurrentPage(page.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded ${
                  currentPage === page.id
                    ? darkMode ? 'bg-gray-800 text-blue-400' : 'bg-gray-100 text-blue-600'
                    : darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {page.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}