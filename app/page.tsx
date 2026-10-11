import type { Metadata } from 'next';
import CharlesSite from '@/components/CharlesSite';
import { metadataFor } from './seo';

export const metadata: Metadata = metadataFor('home');
export default function Home() {
  return <CharlesSite page="home" />;
}

