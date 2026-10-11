import Link from 'next/link';
import { servicePages } from '@/content/service-pages';
import PageIntro from './PageIntro';
import { ContactSection } from './HomeSections';
import originals from '@/content/service-originals.json';
import ServiceReveal from './ServiceReveal';
import styles from './ServicePage.module.css';

export default function ServicePage({ service, showContact = true }: { service: typeof servicePages[number]; showContact?: boolean }) {
  const original = originals[service.slug as keyof typeof originals];
  const sections: typeof original.sections = [];
  for (const section of original.sections) {
    const previous = sections.at(-1);
    if (section.every(widget => widget.image) && previous?.every(widget => widget.image)) previous.push(...section);
    else sections.push([...section]);
  }
  const outline = sections.flatMap((section, index) => {
    const heading = section.map(widget => widget.html.match(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/i)?.[1]).find(Boolean);
    return heading ? [{ id: `service-section-${index + 1}`, title: heading.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"') }] : [];
  });
  const serviceLinks = servicePages.map(item => <Link key={item.slug} href={`/${item.slug}`} aria-current={service.slug === item.slug ? 'page' : undefined}>{item.title}<span aria-hidden="true">&#8599;</span></Link>);
  return <>
    <PageIntro title={service.title} eyebrow={service.eyebrow} description={service.description} parent={{ label: 'Services', href: '/services' }} />
    <section className={`section ${styles.detail}`}>
      <div className={`container ${styles.tools}`}>
        {outline.length > 1 && <details className={styles.contents}><summary>On this page <span>{outline.length} sections</span></summary><nav aria-label="On this page">{outline.map(item => <a key={item.id} href={`#${item.id}`}>{item.title}<span aria-hidden="true">↓</span></a>)}</nav></details>}
        <details className={styles.mobileServices}><summary>Explore other services</summary><nav aria-label="Other services on mobile">{serviceLinks}</nav></details>
        <Link href="/contact" className={styles.enquiry}>Talk about your project <span aria-hidden="true">↗</span></Link>
      </div>
      <div className={`container ${styles.layout}`}>
        <aside className={`service-sidebar ${styles.sidebar}`}>
          <p className="eyebrow">EXPLORE OUR SERVICES</p>
          <nav aria-label="Other services">{serviceLinks}</nav>
        </aside>
        <ServiceReveal className={styles.content}>
          {sections.map((section, index) => {
            const copy = section.filter(widget => !widget.image);
            const images = section.filter(widget => widget.image);
            return <div id={`service-section-${index + 1}`} key={index} data-service-reveal className={`${styles.panel} ${images.length && copy.length ? styles.split : ''} ${!copy.length ? styles.gallery : ''}`}>
              {copy.length > 0 && <div className={styles.copy}>{copy.map((widget, i) => <div className={styles.widget} key={i} dangerouslySetInnerHTML={{ __html: widget.html }} />)}</div>}
              {images.length > 0 && <div className={styles.images}>{images.map((widget, i) => <div className={styles.image} key={i} dangerouslySetInnerHTML={{ __html: widget.html }} />)}</div>}
            </div>;
          })}
        </ServiceReveal>
      </div>
    </section>
    {showContact && <ContactSection />}
  </>;
}
