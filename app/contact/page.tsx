import type { Metadata } from 'next';
import CharlesSite from '@/components/CharlesSite';
import { metadataFor } from '../seo';

export const metadata: Metadata = metadataFor('contact');
export default function ContactPage() { return <CharlesSite page="contact"/>; }

