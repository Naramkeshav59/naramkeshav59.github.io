'use client';

import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import HomePage from '../components/HomePage';
import ProjectsPage from '../components/ProjectsPage';
import BlogPage from '../components/BlogPage';
import ContactPage from '../components/ContactPage';
import Footer from '../components/Footer';

const PAGES = ['home', 'projects', 'blog', 'contact'];

export default function Portfolio() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  // #projects, #blog ... so a section can be linked to directly
  useEffect(() => {
    const syncFromHash = () => {
      const fromHash = window.location.hash.replace('#', '');
      if (PAGES.includes(fromHash)) setCurrentPage(fromHash);
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    try {
      if (localStorage.getItem('theme') === 'dark') setDarkMode(true);
    } catch {}
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    try { localStorage.setItem('theme', darkMode ? 'dark' : 'light'); } catch {}
  }, [darkMode]);

  const goTo = (page) => {
    setCurrentPage(page);
    window.history.replaceState(null, '', page === 'home' ? '/' : `/#${page}`);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'projects':
        return <ProjectsPage darkMode={darkMode} />;
      case 'blog':
        return <BlogPage darkMode={darkMode} />;
      case 'contact':
        return <ContactPage darkMode={darkMode} />;
      default:
        return <HomePage darkMode={darkMode} goTo={goTo} />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Navigation
        currentPage={currentPage}
        setCurrentPage={goTo}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      {renderPage()}
      <Footer darkMode={darkMode} />
    </div>
  );
}
