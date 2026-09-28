import { Inter, Bangers } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const comic = Bangers({ subsets: ['latin'], weight: '400', variable: '--font-comic' });

export const metadata = {
  title: 'Keshav Naram | GenAI Portfolio',
  description: 'GenAI Engineer specializing in multimodal applications and AI agents',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${comic.variable}`}>{children}</body>
    </html>
  );
}
