import { Link } from 'react-router-dom';
import { RecentActivity } from '../../types/stats';
import StatusBadge from '../ui/StatusBadge';
import { ApplicationStatus } from '../../types/application';
import { formatRelative } from '../../utils/formatDate';
import styles from './RecentActivity.module.scss';

interface RecentActivityProps {
  data: RecentActivity[];
}

export default function RecentActivityList({ data }: RecentActivityProps) {
  if (data.length === 0) return <p className={styles.empty}>No recent activity</p>;

  return (
    <div className={styles.list}>
      {data.map((item) => (
        <Link to={`/applications/${item.application_id}`} key={item.id} className={styles.item}>
          <div className={styles.info}>
            <span className={styles.company}>{item.company_name}</span>
            <span className={styles.position}>{item.position}</span>
          </div>
          <div className={styles.status}>
            {item.old_status && (
              <>
                <StatusBadge status={item.old_status as ApplicationStatus} />
                <span className={styles.arrow}>&rarr;</span>
              </>
            )}
            <StatusBadge status={item.new_status as ApplicationStatus} />
          </div>
          <span className={styles.time}>{formatRelative(item.changed_at)}</span>
        </Link>
      ))}
    </div>
  );
}
