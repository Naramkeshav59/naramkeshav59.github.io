'use client';

import { useState } from 'react';
import { Link2, Check } from 'lucide-react';

export default function CopyLink() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <button onClick={copy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
      {copied ? <Check size={15} /> : <Link2 size={15} />}
      {copied ? 'Copied' : 'Copy link'}
    </button>
  );
}
