import FlowArt from './FlowArt';
import styles from './FloatingSilhouettes.module.css';

/** Decorative light ribbons inspired by the printed Catch the Beat identity. */
export default function FloatingSilhouettes() {
  return <div className={styles.scene} aria-hidden="true">
    <div className={`${styles.shape} ${styles.ribbon}`}><FlowArt/></div>
    <div className={`${styles.shape} ${styles.echo}`}><FlowArt/></div>
    <span className={styles.corner}/><span className={styles.hairline}/>
    <span className={`${styles.spark} ${styles.sparkOne}`}/><span className={`${styles.spark} ${styles.sparkTwo}`}/><span className={`${styles.spark} ${styles.sparkThree}`}/>
  </div>;
}
