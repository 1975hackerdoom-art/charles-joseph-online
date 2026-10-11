'use client';

import { Icon } from '@/components/AIIcon';
import { useEffect, useRef } from 'react';
import studies from '@/content/case-studies.json';
import styles from './CaseStudyGrid.module.css';

export default function CaseStudyGrid() {
  const grid = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!grid.current || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).dataset.revealed = 'true';
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.1 });
    grid.current.querySelectorAll('article').forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return <div className={styles.grid} ref={grid}>
    {studies.map((study, index) => <article className={styles.card} key={study.file}>
      <a className={styles.preview} href={`/pdfs/${study.file}`} target="_blank" rel="noopener noreferrer" aria-label={`View ${study.name} case study (PDF, opens in a new tab)`}>
        <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        <img src={`/images/case-studies/${study.preview}`} width="612" height="792" alt="" loading="lazy" />
        <span className={styles.previewLabel}>View PDF <span aria-hidden="true">↗</span></span>
      </a>
      <div className={styles.body}>
        <p className={styles.municipality}>{study.name}</p>
        <h2>{study.title}</h2>
        <p className={styles.description}>{study.description}</p>
        <div className={styles.footer}>
          <span className={styles.fileInfo}>PDF · {study.pages} {study.pages === 1 ? 'page' : 'pages'} · {study.size} KB</span>
          <a className={styles.download} href={`/pdfs/${study.file}`} download={study.file} aria-label={`Download ${study.name} case study PDF`}>
            Download PDF
            <Icon type="download" size={18}/>
          </a>
        </div>
      </div>
    </article>)}
  </div>;
}
