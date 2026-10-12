import type { Metadata } from 'next';
import './globals.css';
import './charles.css';
import './article.css';

export const metadata: Metadata = {
  title: 'Charles Joseph | Faith, Leadership and Enterprise',
  description: 'Explore practical wisdom from Charles Joseph on faith, leadership and business, alongside books, resources and mentorship enquiries.',
  metadataBase: new URL('https://charlesjosephonline.com'),
  alternates: { canonical: '/' },
  openGraph: { title: 'Charles Joseph', description: 'Faith. Leadership. Enterprise. Practical wisdom for life, leadership and business.', url: '/', siteName: 'Charles Joseph Online', type: 'website' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = { '@context': 'https://schema.org', '@type': 'Person', name: 'Charles Joseph', url: 'https://charlesjosephonline.com', jobTitle: 'Minister, entrepreneur and community development leader' };
  return <html lang="en-CA"><body><a className="skip-link" href="#main">Skip to content</a>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /></body></html>;
}
