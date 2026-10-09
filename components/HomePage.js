'use client';

import Image from 'next/image';
import { Github, Linkedin, Mail, Download, ArrowRight } from 'lucide-react';
import { portfolioData } from '../data/portfolio-data';

export default function HomePage({ darkMode, goTo }) {
  const { personal, results } = portfolioData;
  const card = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const muted = darkMode ? 'text-gray-400' : 'text-gray-600';
  const strong = darkMode ? 'text-white' : 'text-gray-900';
  const iconBtn = `p-3 rounded-full border transition-colors ${darkMode
    ? 'border-gray-700 text-gray-200 hover:bg-gray-800'
    : 'border-gray-200 text-gray-700 hover:bg-gray-100'}`;

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center">
          <Image
            src="/photo.jpg"
            alt={personal.name}
            width={144}
            height={144}
            className={`rounded-full mx-auto mb-6 grayscale ring-4 ${darkMode ? 'ring-gray-800' : 'ring-white'} shadow-md`}
            priority
          />
          <h1 className={`text-5xl sm:text-6xl font-bold tracking-tight mb-3 ${strong}`}>
            {personal.name}
          </h1>
          <h2 className={`text-xl sm:text-2xl font-medium mb-5 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
            {personal.title}
          </h2>
          <p className={`text-lg max-w-2xl mx-auto mb-8 ${muted}`}>
            {personal.tagline}
          </p>

          <div className="flex justify-center items-center gap-3 mb-14">
            <a href={personal.github} target="_blank" rel="noopener noreferrer" className={iconBtn} aria-label="GitHub">
              <Github size={22} />
            </a>
            <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" className={iconBtn} aria-label="LinkedIn">
              <Linkedin size={22} />
            </a>
            <a href={`mailto:${personal.email}`} className={iconBtn} aria-label="Email">
              <Mail size={22} />
            </a>
            <a href={personal.resume} download
              className="ml-2 inline-flex items-center px-5 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-full text-sm font-medium transition-colors">
              <Download size={18} className="mr-2" />
              Resume
            </a>
          </div>
        </div>

        <div className={`max-w-3xl mx-auto p-8 rounded-2xl border ${card}`}>
          <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>About</h3>
          <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {personal.bio}
          </p>
        </div>

        <div className="mt-14">
          <h3 className={`text-sm font-semibold uppercase tracking-wider text-center mb-6 ${muted}`}>Selected results</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {results.map((r) => (
              <button key={r.metric} onClick={() => goTo('projects')}
                className={`text-left p-6 rounded-2xl border transition-shadow hover:shadow-lg ${card}`}>
                <div className={`text-3xl font-bold mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>{r.metric}</div>
                <div className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{r.label}</div>
                <div className={`text-sm flex items-center ${muted}`}>
                  {r.project} <ArrowRight size={14} className="ml-1" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
