'use client';

import { Mail, Github, Linkedin } from 'lucide-react';
import { portfolioData } from '../data/portfolio-data';

export default function ContactPage({ darkMode }) {
  const { personal } = portfolioData;

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-4xl font-bold mb-4 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Let's Connect
        </h1>
        <p className={`text-xl mb-12 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Interested in collaborating or discussing GenAI opportunities? Feel free to reach out!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <a href={`mailto:${personal.email}`}
            className={`p-8 rounded-lg shadow-lg transition-all text-center ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:shadow-xl'}`}>
            <Mail size={40} className={`mx-auto mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h3 className={`font-semibold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Email</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{personal.email}</p>
          </a>

          <a href={personal.github} target="_blank" rel="noopener noreferrer"
            className={`p-8 rounded-lg shadow-lg transition-all text-center ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:shadow-xl'}`}>
            <Github size={40} className={`mx-auto mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h3 className={`font-semibold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>GitHub</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>View my code</p>
          </a>

          <a href={personal.linkedin} target="_blank" rel="noopener noreferrer"
            className={`p-8 rounded-lg shadow-lg transition-all text-center ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:shadow-xl'}`}>
            <Linkedin size={40} className={`mx-auto mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h3 className={`font-semibold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>LinkedIn</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Connect professionally</p>
          </a>
        </div>
      </div>
    </div>
  );
}