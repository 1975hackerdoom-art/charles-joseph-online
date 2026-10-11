import Link from 'next/link';
import FloatingSilhouettes from './FloatingSilhouettes';
export default function PageIntro({ title, eyebrow, description, parent }: { title: string; eyebrow: string; description: string; parent?: {label: string; href: string} }) {
  return <section className="page-intro"><FloatingSilhouettes/><div className="container page-intro-content"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span>{parent && <><Link href={parent.href}>{parent.label}</Link><span aria-hidden="true">/</span></>}<span aria-current="page">{title}</span></nav><p className="eyebrow">{eyebrow}</p><h1>{title}<span className="gold-dot">.</span></h1><p className="page-intro-description">{description}</p></div></section>;
}
