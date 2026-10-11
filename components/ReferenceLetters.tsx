import Link from 'next/link';
import referrals from '@/content/referrals.json';
import styles from './ReferenceLetters.module.css';

const featured = referrals.filter(referral => ['Town of Comox', 'District of Logan Lake', 'City of Yellowknife'].includes(referral.title));

export default function ReferenceLetters() {
  return <section id="reference-letters" className={`section ${styles.section}`} aria-labelledby="reference-letters-title">
    <div className="container">
      <div className="section-heading">
        <div><p className="eyebrow">WHAT CLIENTS SAY</p><h2 id="reference-letters-title">Reference letters</h2></div>
        <p>Hear directly from the municipal teams who have worked with Catch the Beat.</p>
      </div>
      <div className={styles.grid}>
        {featured.map(referral => {
          const image = referral.files.find(file => file.preview)!;
          const original = referral.files.find(file => file.format === 'PDF') ?? image;
          return <article className={styles.card} key={referral.title}>
            <a className={styles.preview} href={original.href} target="_blank" rel="noopener noreferrer" aria-label={`Read the reference letter from ${referral.title}`}>
              <img src={image.preview} alt={`Reference letter from ${referral.title}`} width={image.width} height={image.height} loading="lazy" />
            </a>
            <div className={styles.body}><h3>{referral.title}</h3><a className="text-link" href={original.href} target="_blank" rel="noopener noreferrer">Read reference letter <span aria-hidden="true">↗</span></a></div>
          </article>;
        })}
      </div>
      <div className={styles.action}><Link href="/what-clients-say" className="button gold">View All Reference Letters <span aria-hidden="true">→</span></Link></div>
    </div>
  </section>;
}
