import Link from 'next/link';
import referrals from '@/content/referrals.json';
import styles from './ReferralsList.module.css';

export default function ReferralsList() {
  return <section id="referrals" className={`section ${styles.section}`} aria-labelledby="referrals-title">
    <div className="container">
      <div className="section-heading">
        <div><p className="eyebrow">WHAT CLIENTS SAY</p><h2 id="referrals-title">Referrals</h2></div>
        <p>Read letters of recommendation from the communities and teams who have worked with Catch the Beat.</p>
      </div>
      <ul className={styles.list}>
        {referrals.filter(referral => referral.category === 'recommendation').map(referral => <li key={referral.title}>
          <Link href={`/what-clients-say#${referral.files[0].id}`}><span>{referral.title}</span><span aria-hidden="true">→</span></Link>
        </li>)}
      </ul>
      <div className={styles.action}><Link href="/what-clients-say" className="button gold">View all client referrals <span aria-hidden="true">→</span></Link></div>
    </div>
  </section>;
}
