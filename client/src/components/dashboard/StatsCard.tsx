import styles from './StatsCard.module.scss';

interface StatsCardProps {
  label: string;
  value: number | string;
  color?: string;
}

export default function StatsCard({ label, value, color }: StatsCardProps) {
  return (
    <div className={styles.card}>
      <p className={styles.label}>{label}</p>
      <p className={styles.value} style={color ? { color } : undefined}>{value}</p>
    </div>
  );
}
