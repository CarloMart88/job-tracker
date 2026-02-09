import { ApplicationStatus } from '../../types/application';
import { STATUS_COLORS, STATUS_BG_COLORS } from '../../utils/statusColors';
import styles from './StatusBadge.module.scss';

interface StatusBadgeProps {
  status: ApplicationStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={styles.badge}
      style={{ color: STATUS_COLORS[status], backgroundColor: STATUS_BG_COLORS[status] }}
    >
      {status}
    </span>
  );
}
