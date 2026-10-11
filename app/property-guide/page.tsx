import type { Metadata } from 'next';
import CharlesSite from '@/components/CharlesSite';
import { metadataFor } from '../seo';

export const metadata: Metadata = metadataFor('propertyGuide');
export default function PropertyGuidePage() { return <CharlesSite page="property-guide"/>; }

