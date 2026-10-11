import type { Metadata } from 'next';
import CharlesSite from '@/components/CharlesSite';
import { metadataFor } from '../seo';

export const metadata: Metadata = metadataFor('about');
export default function AboutPage() { return <CharlesSite page="about" />; }
