import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const routes = ['', '/about', '/insights', '/resources', '/mentorship', '/property-guide', '/contact', '/privacy'];
const articleRoutes = ['/insights/great-faith-begins-with-recognising-authority', '/insights/alignment-must-show-up-in-your-decisions', '/insights/accountability-is-part-of-leadership', '/insights/a-good-idea-still-needs-customers', '/insights/before-you-pay-for-property-in-nigeria', '/insights/knowing-someones-identity-is-only-the-beginning'];

export default function sitemap(): MetadataRoute.Sitemap {
  return [...routes, ...articleRoutes].map((route) => ({
    url: `https://charlesjosephonline.com${route === '' ? '/' : `${route}/`}`,
    lastModified: new Date('2026-10-10'),
    changeFrequency: route === '/insights' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route === '/contact' ? .9 : .7,
  }));
}
