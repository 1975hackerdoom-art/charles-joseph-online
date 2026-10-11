import Image from 'next/image';
import styles from './BrandHero.module.css';

export default function HeroCard() {
  return <figure className={styles.cardFrame}>
    <Image className={styles.card} src="/images/amc-2026-stony-plain-1.webp" width={1350} height={1800} sizes="(max-width: 760px) 85vw, 38vw" loading="eager" alt="Portrait at AMC 2026 in Stony Plain."/>
    <figcaption className={styles.caption}><span>THE WAY WE WORK</span><strong>Human insight. AI support.</strong></figcaption>
  </figure>;
}
