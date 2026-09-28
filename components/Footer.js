'use client';

export default function Footer({ darkMode }) {
  return (
    <footer className={`py-8 text-center text-sm border-t ${darkMode ? 'bg-gray-800 text-gray-400 border-gray-700' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
      <p>© {new Date().getFullYear()} Keshav Naram</p>
      <p className="mt-1 text-xs opacity-60">
        3D model by{' '}
        <a href="https://sketchfab.com/3d-models/spider-man-no-way-home-rigged-9f0f2ab778194c52911a549110e597e0" target="_blank" rel="noopener noreferrer" className="underline">
          Visiion
        </a>{' '}
        (CC BY 4.0)
      </p>
    </footer>
  );
}
