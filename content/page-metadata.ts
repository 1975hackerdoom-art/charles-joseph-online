import type { Metadata } from 'next';
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return { title: `${title} | Catch the Beat`, description, alternates: { canonical: path }, openGraph: { title: `${title} | Catch the Beat`, description, url: path, siteName: 'Catch the Beat', locale: 'en_CA', type: 'website', images: [{url: '/opengraph-image', width: 1200, height: 630}] }, twitter: { card: 'summary_large_image', title: `${title} | Catch the Beat`, description, images: ['/opengraph-image'] } };
}
