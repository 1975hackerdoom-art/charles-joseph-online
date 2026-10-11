import type { Metadata } from 'next';
import CharlesSite from '@/components/CharlesSite';
import { metadataFor } from '../seo';

export const metadata: Metadata = metadataFor('mentorship');
export default function MentorshipPage() { return <CharlesSite page="mentorship"/>; }

