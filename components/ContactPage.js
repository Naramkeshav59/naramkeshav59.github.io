'use client';

import { Mail, Github, Linkedin } from 'lucide-react';
import { portfolioData } from '../data/portfolio-data';

export default function ContactPage({ darkMode }) {
  const { personal } = portfolioData;

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-4xl font-bold mb-4 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Contact
        </h1>
        <p className={`text-xl mb-12 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Email is the fastest way to reach me. Code for everything on this site is on GitHub.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <a href={`mailto:${personal.email}`}
            className={`p-8 rounded-2xl border transition-colors text-center ${darkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
            <Mail size={40} className={`mx-auto mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h3 className={`font-semibold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Email</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{personal.email}</p>
          </a>

          <a href={personal.github} target="_blank" rel="noopener noreferrer"
            className={`p-8 rounded-2xl border transition-colors text-center ${darkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
            <Github size={40} className={`mx-auto mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h3 className={`font-semibold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>GitHub</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>View my code</p>
          </a>

          <a href={personal.linkedin} target="_blank" rel="noopener noreferrer"
            className={`p-8 rounded-2xl border transition-colors text-center ${darkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
            <Linkedin size={40} className={`mx-auto mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h3 className={`font-semibold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>LinkedIn</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Connect professionally</p>
          </a>
        </div>
      </div>
    </div>
  );
}