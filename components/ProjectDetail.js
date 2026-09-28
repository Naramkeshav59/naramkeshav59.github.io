'use client';

import { Github, ExternalLink } from 'lucide-react';

export default function ProjectDetail({ project, darkMode, onBack }) {
  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className={`mb-6 flex items-center ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
        >
          ← Back to Projects
        </button>

        <h1 className={`text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {project.title}
        </h1>

        <div className="flex flex-wrap gap-3 mb-6">
          <a href={project.github} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
            <Github size={20} className="mr-2" />
            View on GitHub
          </a>
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <ExternalLink size={20} className="mr-2" />
              Live Demo
            </a>
          )}
        </div>

        {project.video && (
          <div className="mb-8">
            <video controls className="w-full rounded-lg shadow-lg">
              <source src={project.video} type="video/mp4" />
            </video>
          </div>
        )}

        <div className={`p-6 rounded-lg mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Overview</h2>
          <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {project.fullDescription}
          </p>
        </div>

        <div className={`p-6 rounded-lg mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Technologies Used</h2>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech, idx) => (
              <span key={idx} 
                className={`px-4 py-2 rounded-full ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Key Highlights</h2>
          <ul className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {project.highlights.map((highlight, idx) => (
              <li key={idx} className="flex items-start">
                <span className={`mr-3 mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>✓</span>
                <span className="text-lg">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}