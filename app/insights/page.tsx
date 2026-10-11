import type { Metadata } from 'next';
import CharlesSite from '@/components/CharlesSite';
import { metadataFor } from '../seo';

export const metadata: Metadata = metadataFor('insights');
export default function InsightsPage() { return <CharlesSite page="insights"/>; }

