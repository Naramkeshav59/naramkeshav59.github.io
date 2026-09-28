'use client';

import { useState } from 'react';
import { Github, ExternalLink } from 'lucide-react';
import { portfolioData } from '../data/portfolio-data';
import ProjectDetail from './ProjectDetail';

export default function ProjectsPage({ darkMode }) {
  const [selectedProject, setSelectedProject] = useState(null);

  if (selectedProject) {
    return (
      <ProjectDetail 
        project={selectedProject} 
        darkMode={darkMode}
        onBack={() => setSelectedProject(null)}
      />
    );
  }

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className={`text-4xl font-bold mb-4 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Featured Projects
        </h1>
        <p className={`text-xl mb-12 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Showcasing my work in GenAI, multimodal applications, and AI agents
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {portfolioData.projects.map(project => (
            <div key={project.id} 
              className={`p-6 rounded-lg shadow-lg transition-all cursor-pointer ${darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:shadow-xl'}`}
              onClick={() => setSelectedProject(project)}>
              
              <h3 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {project.title}
              </h3>
              
              <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {project.description}
              </p>

              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {project.techStack.slice(0, 3).map((tech, idx) => (
                    <span key={idx} 
                      className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 3 && (
                    <span className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                      +{project.techStack.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4 mt-4">
                <button className={`text-sm flex items-center ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                  View Details →
                </button>
                <a 
                  href={project.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className={`text-sm flex items-center ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  <Github size={16} className="mr-1" />
                  GitHub
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}