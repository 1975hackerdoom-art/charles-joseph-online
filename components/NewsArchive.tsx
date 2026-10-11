'use client';

import { Icon } from '@/components/AIIcon';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import posts from '@/content/news-index.json';
import styles from './NewsArchive.module.css';

const PAGE_SIZE = 12;
const categories = [...new Set(posts.flatMap(post => post.categories))].sort();
const dateLabel = (date: string) => new Intl.DateTimeFormat('en-CA', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`));

export default function NewsArchive() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All topics');
  const [page, setPage] = useState(1);
  const container = useRef<HTMLDivElement>(null);
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const filtered = useMemo(() => posts.filter(post => (category === 'All topics' || post.categories.includes(category)) && `${post.title} ${post.excerpt}`.toLowerCase().includes(query.trim().toLowerCase())), [query, category]);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pagePosts = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const featured = page === 1 && !query.trim() && category === 'All topics' ? pagePosts[0] : undefined;
  const cards = featured ? pagePosts.slice(1) : pagePosts;

  useEffect(() => {
    if (!container.current || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).dataset.revealed = 'true';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    container.current.querySelectorAll('article').forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, [query, category, page]);

  function changePage(next: number) {
    setPage(next);
    resultsHeading.current?.focus({ preventScroll: true });
    resultsHeading.current?.scrollIntoView({ block: 'start' });
  }

  return <div ref={container}>
    <div className={styles.toolbar}>
      <div className={styles.search}>
        <label htmlFor="news-search">Search articles</label>
        <div className={styles.searchInput}>
          <Icon type="search" size={19}/>
          <input id="news-search" type="search" placeholder="Search by title or keyword" value={query} onChange={event => { setQuery(event.target.value); setPage(1); }}/>
        </div>
      </div>
      <div className={styles.filter}>
        <label htmlFor="news-category">Browse by topic</label>
        <select id="news-category" value={category} onChange={event => { setCategory(event.target.value); setPage(1); }}>
          <option>All topics</option>
          {categories.map(value => <option key={value}>{value}</option>)}
        </select>
      </div>
    </div>
    <div className={styles.resultsHeader}>
      <h2 ref={resultsHeading} tabIndex={-1}>The latest thinking</h2>
      <p role="status">{filtered.length ? `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length} articles` : 'No articles found'}</p>
    </div>
    {featured && <article className={styles.featured} key={`featured-${featured.slug}`}>
      <Link className={`${styles.featuredImage} ${!featured.image ? styles.logoThumbnail : ''}`} href={`/news/${featured.slug}`} tabIndex={-1} aria-hidden="true">
        {featured.image ? <img src={featured.image} alt=""/> : <img src="/images/ctb-logo.webp" alt="" width="145" height="145"/>}
      </Link>
      <div className={styles.featuredBody}>
        <p className={styles.kicker}>Latest article <span aria-hidden="true">/</span> {featured.categories[0]}</p>
        <time dateTime={featured.date}>{dateLabel(featured.date)}</time>
        <h3><Link href={`/news/${featured.slug}`}>{featured.title}</Link></h3>
        <p className={styles.excerpt}>{featured.excerpt}</p>
        <Link className={styles.readLink} href={`/news/${featured.slug}`} aria-label={`Read ${featured.title}`}>Read article <span aria-hidden="true">↗</span></Link>
      </div>
    </article>}
    <div className={styles.grid}>
      {cards.map(post => <article className={styles.card} key={post.slug}>
        <Link className={`${styles.cardImage} ${!post.image ? styles.logoThumbnail : ''}`} href={`/news/${post.slug}`} tabIndex={-1} aria-hidden="true">
          {post.image ? <img src={post.image} alt="" loading="lazy"/> : <img src="/images/ctb-logo.webp" alt="" width="145" height="145" loading="lazy"/>}
        </Link>
        <div className={styles.cardBody}>
          <p className={styles.kicker}>{post.categories[0] || 'News'}</p>
          <time dateTime={post.date}>{dateLabel(post.date)}</time>
          <h3><Link href={`/news/${post.slug}`}>{post.title}</Link></h3>
          <p className={styles.excerpt}>{post.excerpt}</p>
          <Link className={styles.readLink} href={`/news/${post.slug}`} aria-label={`Read ${post.title}`}>Read article <span aria-hidden="true">↗</span></Link>
        </div>
      </article>)}
    </div>
    {!filtered.length && <div className={styles.empty}><h3>No matching articles</h3><p>Try another keyword or browse all topics.</p><button className="button gold" onClick={() => { setQuery(''); setCategory('All topics'); setPage(1); }}>Clear filters</button></div>}
    {totalPages > 1 && <nav className={styles.pagination} aria-label="News pagination">
      <button disabled={page === 1} onClick={() => changePage(page - 1)} aria-label="Previous page">← <span>Previous</span></button>
      <div className={styles.pageNumbers}>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(number => {
          if (number !== 1 && number !== totalPages && Math.abs(number - page) > 1) return number === page - 2 || number === page + 2 ? <span className={styles.ellipsis} key={number}>…</span> : null;
          return <button key={number} aria-label={`Page ${number}`} aria-current={page === number ? 'page' : undefined} onClick={() => changePage(number)}>{number}</button>;
        })}
      </div>
      <button disabled={page === totalPages} onClick={() => changePage(page + 1)} aria-label="Next page"><span>Next</span> →</button>
    </nav>}
  </div>;
}
