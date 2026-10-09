'use client';

export default function Footer({ darkMode }) {
  return (
    <footer className={`py-8 text-center text-sm border-t ${darkMode ? 'bg-gray-900 text-gray-400 border-gray-800' : 'bg-white text-gray-500 border-gray-200'}`}>
      <p>© {new Date().getFullYear()} Keshav Naram</p>
    </footer>
  );
}
