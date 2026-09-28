'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Navigation from '../components/Navigation';
import HomePage from '../components/HomePage';
import ProjectsPage from '../components/ProjectsPage';
import BlogPage from '../components/BlogPage';
import ContactPage from '../components/ContactPage';
import Footer from '../components/Footer';

const SpiderMan3D = dynamic(() => import('../components/SpiderMan3D'), { ssr: false });

export default function Portfolio() {
  const [darkMode, setDarkMode] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    window.scrollTo(0, 0);
  }, [darkMode, currentPage]);

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <HomePage darkMode={darkMode} />;
      case 'projects':
        return <ProjectsPage darkMode={darkMode} />;
      case 'blog':
        return <BlogPage darkMode={darkMode} />;
      case 'contact':
        return <ContactPage darkMode={darkMode} />;
      default:
        return <HomePage darkMode={darkMode} />;
    }
  };

  return (
    <div className={`spidey-web-bg relative min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Navigation 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      
      <SpiderMan3D visible={currentPage === 'home'} />

      {renderPage()}

      <Footer darkMode={darkMode} />
    </div>
  );
}