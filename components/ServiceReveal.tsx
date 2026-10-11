'use client';
import { useEffect, useRef, type ReactNode } from 'react';

export default function ServiceReveal({ children, className }: { children: ReactNode; className: string }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!root.current || !('IntersectionObserver' in window)) return;
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        if (preference.matches) return;
        const animation = entry.target.animate([
          { opacity: 0.35, transform: 'translateY(24px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ], { duration: 650, easing: 'cubic-bezier(.2,.7,.2,1)' });
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      });
    }, { threshold: 0, rootMargin: '0px 0px -35px 0px' });
    root.current.querySelectorAll('[data-service-reveal]').forEach(panel => observer.observe(panel));
    const stop = () => { if (preference.matches) animations.forEach(animation => animation.cancel()); };
    preference.addEventListener('change', stop);
    return () => { observer.disconnect(); animations.forEach(animation => animation.cancel()); preference.removeEventListener('change', stop); };
  }, []);
  return <div ref={root} className={className}>{children}</div>;
}
