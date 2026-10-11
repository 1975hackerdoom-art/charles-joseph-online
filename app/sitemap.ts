import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const routes = ['', '/about', '/insights', '/resources', '/mentorship', '/property-guide', '/contact', '/privacy'];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `https://charlesjosephonline.com${route === '' ? '/' : `${route}/`}`,
    lastModified: new Date('2026-10-10'),
    changeFrequency: route === '/insights' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route === '/contact' ? .9 : .7,
  }));
}
