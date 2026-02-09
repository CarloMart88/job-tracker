import { useDroppable } from '@dnd-kit/core';
import { Application, ApplicationStatus } from '../../types/application';
import { STATUS_COLORS } from '../../utils/statusColors';
import KanbanCard from './KanbanCard';
import styles from './KanbanColumn.module.scss';

interface KanbanColumnProps {
  status: ApplicationStatus;
  applications: Application[];
}

export default function KanbanColumn({ status, applications }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={`${styles.column} ${isOver ? styles.over : ''}`}
    >
      <div className={styles.header}>
        <span className={styles.dot} style={{ background: STATUS_COLORS[status] }} />
        <h4 className={styles.title}>{status}</h4>
        <span className={styles.count}>{applications.length}</span>
      </div>
      <div className={styles.cards}>
        {applications.map((app) => (
          <KanbanCard key={app.id} application={app} />
        ))}
        {applications.length === 0 && (
          <p className={styles.empty}>Drop here</p>
        )}
      </div>
    </div>
  );
}
