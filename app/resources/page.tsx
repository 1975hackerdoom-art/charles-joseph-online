import type { Metadata } from 'next';
import CharlesSite from '@/components/CharlesSite';
import { metadataFor } from '../seo';

export const metadata: Metadata = metadataFor('resources');
export default function ResourcesPage() { return <CharlesSite page="resources"/>; }

