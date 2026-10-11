import { business } from '@/content/site';
import styles from './BrandHero.module.css';
import HeroCard from './HeroCard';

export default function BrandHero() {
  return <section className={styles.hero} aria-labelledby="brand-hero-title">
    <div className={`container ${styles.grid}`}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>GOVERNANCE &middot; TRAINING &middot; AUTOMATION</p>
        <h1 id="brand-hero-title">Practical AI.<br/><em>Human in<br/>charge.</em></h1>
        <p className={styles.description}>I help local governments move from &ldquo;we should probably do something with AI&rdquo; to useful, responsible work your team can actually run.</p>
        <div className={`button-row ${styles.actions}`}>
          <a className="button gold" href={business.booking} target="_blank" rel="noopener noreferrer">Book a conversation <span aria-hidden="true">&#8599;</span></a>
          <a className="button outline" href="/services">Explore the work</a>
        </div>
        <div className={styles.signature}><strong>Who's the Human?</strong><span>The question behind every good AI decision.</span></div>
      </div>
      <HeroCard/>
    </div>
  </section>;
}
