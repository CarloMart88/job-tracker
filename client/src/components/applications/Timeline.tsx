import { StatusHistoryEntry } from '../../types/application';
import StatusBadge from '../ui/StatusBadge';
import { formatDateTime } from '../../utils/formatDate';
import styles from './Timeline.module.scss';

interface TimelineProps {
  history: StatusHistoryEntry[];
}

export default function Timeline({ history }: TimelineProps) {
  if (history.length === 0) return <p className={styles.empty}>No status changes recorded</p>;

  return (
    <div className={styles.timeline}>
      {history.map((entry) => (
        <div key={entry.id} className={styles.item}>
          <div className={styles.dot} />
          <div className={styles.content}>
            <div className={styles.status}>
              {entry.old_status && (
                <>
                  <StatusBadge status={entry.old_status} />
                  <span className={styles.arrow}>&rarr;</span>
                </>
              )}
              <StatusBadge status={entry.new_status} />
            </div>
            {entry.note && <p className={styles.note}>{entry.note}</p>}
            <time className={styles.time}>{formatDateTime(entry.changed_at)}</time>
          </div>
        </div>
      ))}
    </div>
  );
}
