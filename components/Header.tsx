'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { business, navigation } from '@/content/site';

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [submenu, setSubmenu] = useState<string | null>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  const submenuButtons = useRef<Record<string, HTMLButtonElement | null>>({});
  const closeMenus = () => { setOpen(false); setSubmenu(null); };

  useEffect(() => {
    const observer = new ResizeObserver(() => document.documentElement.style.setProperty('--header-height', `${header.current?.getBoundingClientRect().height ?? 98}px`));
    if (header.current) observer.observe(header.current);
    const outside = (event: PointerEvent) => { if (!header.current?.contains(event.target as Node)) { setOpen(false); setSubmenu(null); } };
    let lastWidth = window.innerWidth;
    const resize = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      if (window.innerWidth > 1100) setOpen(false);
      setSubmenu(null);
    };
    document.addEventListener('pointerdown', outside);
    window.addEventListener('resize', resize);
    return () => { observer.disconnect(); document.removeEventListener('pointerdown', outside); window.removeEventListener('resize', resize); };
  }, []);

  return <header ref={header} className="header" data-menu-open={open} onKeyDown={event => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    if (submenu) { submenuButtons.current[submenu]?.focus(); setSubmenu(null); }
    else if (open) { setOpen(false); toggle.current?.focus(); }
  }}><div className="container nav-shell">
    <Link href="/" className="brand" aria-label="Catch the Beat home" onClick={closeMenus}><img src="/images/ctb-logo.webp" width="49" height="49" alt=""/><span>CATCH THE BEAT</span></Link>
    <button ref={toggle} type="button" className="menu-toggle" aria-expanded={open} aria-controls="navigation" aria-label={open ? 'Close navigation' : 'Open navigation'} onClick={() => { setOpen(!open); setSubmenu(null); }}><span>{open ? 'Close' : 'Menu'}</span><svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden="true">{open ? <path d="m4 4 12 12M16 4 4 16"/> : <path d="M2 6h16M2 13h16"/>}</svg></button>
    <nav id="navigation" className={`navigation ${open ? 'open' : ''}`} aria-label="Main navigation" onBlur={event => {
      if (!event.currentTarget.contains(event.relatedTarget) && event.relatedTarget !== toggle.current) closeMenus();
    }}>
      {navigation.map(item => <div className={`nav-item ${item.children?.some(child => child.href === pathname) ? 'has-active-child' : ''}`} key={item.href} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget) && submenu === item.label) setSubmenu(null); }}>
        <div className="nav-item-row"><Link href={item.href} aria-current={pathname === item.href ? 'page' : undefined} onClick={closeMenus}>{item.label}</Link>
          {item.children && <button type="button" ref={node => { submenuButtons.current[item.label] = node; }} className="submenu-toggle" aria-label={`Show ${item.label.toLowerCase()} submenu`} aria-haspopup="true" aria-expanded={submenu === item.label} aria-controls={`submenu-${item.label.toLowerCase()}`} onClick={() => setSubmenu(submenu === item.label ? null : item.label)}><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" aria-hidden="true"><path d="m2 4 4 4 4-4"/></svg></button>}
        </div>
        {item.children && <ul id={`submenu-${item.label.toLowerCase()}`} className="submenu" hidden={submenu !== item.label}>{item.children.map(child => <li key={child.href}><Link href={child.href} aria-current={pathname === child.href ? 'page' : undefined} onClick={closeMenus}>{child.label}</Link></li>)}</ul>}
      </div>)}
      <a href={business.booking} target="_blank" rel="noopener noreferrer" className="button gold nav-cta" onClick={closeMenus}>Book a Consultation <span aria-hidden="true">↗</span></a>
    </nav>
  </div></header>;
}
