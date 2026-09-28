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

        {/* <div className={`p-8 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Available For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <h3 className={`font-semibold mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                ✓ Full-time Opportunities
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Open to GenAI Engineer and ML Engineer roles
              </p>
            </div>
            <div className={`p-4 rounded ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <h3 className={`font-semibold mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                ✓ Consulting Projects
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                AI strategy and implementation consulting
              </p>
            </div>
            <div className={`p-4 rounded ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <h3 className={`font-semibold mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                ✓ Research Collaborations
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Joint research in multimodal AI and agents
              </p>
            </div>
            <div className={`p-4 rounded ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <h3 className={`font-semibold mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                ✓ Speaking Engagements
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Talks and workshops on GenAI topics
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}