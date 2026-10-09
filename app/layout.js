import { Inter } from 'next/font/google';
import './globals.css';
import { SITE } from '@/lib/site';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s | ${SITE.name}` },
  description: SITE.description,
  keywords: SITE.keywords,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'profile',
    url: '/',
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    images: [{ url: SITE.image, width: 800, height: 800, alt: SITE.name }],
  },
  twitter: {
    card: 'summary',
    title: SITE.title,
    description: SITE.description,
    images: [SITE.image],
  },
  robots: { index: true, follow: true },
};

// Person structured data: what Google uses for knowledge panels and to tie
// this site to the same person on GitHub and LinkedIn.
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: SITE.name,
  url: SITE.url,
  image: `${SITE.url}${SITE.image}`,
  jobTitle: 'Machine Learning Engineer',
  description: SITE.description,
  sameAs: [SITE.github, SITE.linkedin],
  alumniOf: [
    { '@type': 'CollegeOrUniversity', name: 'University of Maryland, College Park' },
    { '@type': 'CollegeOrUniversity', name: 'Indian Institute of Technology Dharwad' },
  ],
  knowsAbout: ['Machine Learning', 'LLM Agents', 'Retrieval-Augmented Generation', 'Computer Vision',
    'Speech Recognition', 'MLOps', 'AWS', 'Healthcare Data'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
        {children}
      </body>
    </html>
  );
}
