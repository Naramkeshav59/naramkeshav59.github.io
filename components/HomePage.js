'use client';

import Image from 'next/image';
import { Github, Linkedin, Mail, Download } from 'lucide-react';
import { portfolioData } from '../data/portfolio-data';

export default function HomePage({ darkMode }) {
  const { personal, projects, blogs } = portfolioData;

  return (
    
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <div className="mx-auto mb-6">
            <Image
              src="/photo.jpg"
              alt={personal.name}
              width={150}
              height={150}
              className="rounded-full border-4 border-blue-500 mx-auto"
            />
          </div>
          <h1 className={`font-comic tracking-wider text-6xl sm:text-7xl mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {personal.name}
          </h1>
          <h2 className={`text-2xl sm:text-3xl mb-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            {personal.title}
          </h2>
          <p className={`text-xl mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {personal.tagline}
          </p>
          
          <div className="flex justify-center space-x-4 mb-12">
            <a href={personal.github} target="_blank" rel="noopener noreferrer" 
              className={`p-3 rounded-full transition-colors ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'}`}>
              <Github size={24} />
            </a>
            <a href={personal.linkedin} target="_blank" rel="noopener noreferrer"
              className={`p-3 rounded-full transition-colors ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'}`}>
              <Linkedin size={24} />
            </a>
            <a href={`mailto:${personal.email}`}
              className={`p-3 rounded-full transition-colors ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'}`}>
              <Mail size={24} />
            </a>
          </div>
          <div className={`max-w-3xl mx-auto p-8 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>About Me</h3>
            <p className={`text-lg leading-relaxed mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {personal.bio}
            </p>
            <a href={personal.resume} download
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Download size={20} className="mr-2" />
              Download Resume
            </a>
          </div>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className={`text-4xl font-bold mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                {projects.length}+
              </div>
              <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Featured Projects</div>
            </div>
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className={`text-4xl font-bold mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                {blogs.length}+
              </div>
              <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Blog Articles</div>
            </div>
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className={`text-4xl font-bold mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                10+
              </div>
              <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Technologies</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}