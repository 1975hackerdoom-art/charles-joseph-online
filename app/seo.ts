import type { Metadata } from 'next';

export const pageSeo = {
  home: {
    title: 'Charles Joseph | Faith Leadership and Enterprise',
    description: 'Explore practical lessons from Charles Joseph on faith, leadership and business, alongside books, resources and mentorship enquiries.',
    path: '/',
  },
  about: {
    title: 'About Charles Joseph',
    description: 'Meet Charles Joseph, minister, entrepreneur and community development leader working across Canada and Nigeria.',
    path: '/about',
  },
  insights: {
    title: 'Insights | Charles Joseph',
    description: 'Explore teaching and reflections on faith, leadership, business, Nigerian property and digital trust.',
    path: '/insights',
  },
  resources: {
    title: 'Books and Resources | Charles Joseph',
    description: 'Explore books by Charles Joseph and request the free introductory diaspora guide to Nigerian property.',
    path: '/resources',
  },
  mentorship: {
    title: 'Mentorship | Charles Joseph',
    description: 'Enquire about mentorship with Charles Joseph on personal leadership, business direction, stewardship and property decisions.',
    path: '/mentorship',
  },
  contact: {
    title: 'Contact Charles Joseph',
    description: 'Contact Charles Joseph about speaking, mentorship, media, books and relevant collaborations.',
    path: '/contact',
  },
  propertyGuide: {
    title: 'A Diaspora Guide to Nigerian Property | Charles Joseph',
    description: 'Request A Diaspora Guide to Nigerian Property and prepare your questions before making a property commitment.',
    path: '/property-guide',
  },
} satisfies Record<string, { title: string; description: string; path: string }>;

export function metadataFor(page: keyof typeof pageSeo): Metadata {
  const entry = pageSeo[page];
  return {
    title: entry.title,
    description: entry.description,
    alternates: { canonical: entry.path },
    openGraph: { title: entry.title, description: entry.description, url: entry.path, type: 'website' },
    twitter: { card: 'summary_large_image', title: entry.title, description: entry.description },
  };
}
