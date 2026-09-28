'use client';

export default function Footer({ darkMode }) {
  return (
    <footer className={`py-8 text-center border-t ${darkMode ? 'bg-gray-800 text-gray-400 border-gray-700' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
      <p>© {new Date().getFullYear()} Keshav Naram. Built with Next.js & Tailwind CSS.</p>
      <p className="mt-2 text-sm">Deployed on GitHub Pages</p>
      <p className="mt-2 text-xs opacity-70">
        Spider-Man 3D model by{' '}
        <a href="https://sketchfab.com/VisiionLovesYou" target="_blank" rel="noopener noreferrer" className="underline">
          Visiion
        </a>{' '}
        (
        <a href="https://sketchfab.com/3d-models/spider-man-no-way-home-rigged-9f0f2ab778194c52911a549110e597e0" target="_blank" rel="noopener noreferrer" className="underline">
          source
        </a>
        ), licensed{' '}
        <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="underline">
          CC BY 4.0
        </a>
        . Spider-Man is © Marvel. Fan project, not affiliated.
      </p>
    </footer>
  );
}