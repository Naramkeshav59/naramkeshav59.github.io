'use client';

import { useEffect } from 'react';

// Standalone pages (blog posts) follow the theme chosen on the main site.
export default function ThemeSync() {
  useEffect(() => {
    try {
      document.documentElement.classList.toggle('dark', localStorage.getItem('theme') === 'dark');
    } catch {}
  }, []);
  return null;
}
