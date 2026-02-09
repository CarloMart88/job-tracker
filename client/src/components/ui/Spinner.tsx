import styles from './Spinner.module.scss';

export default function Spinner() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner} />
    </div>
  );
}
