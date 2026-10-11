import { Icon } from './AIIcon';
import styles from './NewsletterButton.module.css';

export default function NewsletterButton() {
  return <>
    <a className={styles.button} href="http://eepurl.com/joOFTE" target="_blank" rel="noopener noreferrer">
      <span className={styles.art} aria-hidden="true">
        <Icon type="newsletter" size={64} className={styles.envelope}/>
      </span>
      <span className={styles.label}>Subscribe to our <strong>Newsletter</strong></span>
      <svg className={styles.arrow} width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" focusable="false"><path d="M5 19 19 5M5 5h14v14"/></svg>
    </a>
    <div className={styles.channels} aria-label="Catch the Beat channels">
      <a href="https://www.youtube.com/@DaphneThomson/featured" target="_blank" rel="noopener noreferrer" aria-label="Catch the Beat on YouTube">
        <Icon type="youtube" size={30}/><span>YouTube</span>
      </a>
      <a href="https://www.youtube.com/playlist?list=PLFU9FY-tJfRxEd7lo5uOTZeTx3juCcdqM" target="_blank" rel="noopener noreferrer" aria-label="Catch the Beat Podcast">
        <Icon type="podcast" size={30}/><span>Podcast</span>
      </a>
    </div>
  </>;
}
