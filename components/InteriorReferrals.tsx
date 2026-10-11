'use client';

import { usePathname } from 'next/navigation';

export default function InteriorReferrals({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()?.replace(/\/$/, '') || '/';
  return pathname === '/' || pathname === '/what-clients-say' ? null : children;
}
