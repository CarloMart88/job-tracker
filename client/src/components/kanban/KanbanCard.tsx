import { useDraggable } from '@dnd-kit/core';
import { Link } from 'react-router-dom';
import { Application } from '../../types/application';
import { formatDate } from '../../utils/formatDate';
import styles from './KanbanCard.module.scss';

interface KanbanCardProps {
  application: Application;
  isDragging?: boolean;
}

export default function KanbanCard({ application, isDragging }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: application.id,
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      className={`${styles.card} ${isDragging ? styles.dragging : ''}`}
      style={style}
      {...listeners}
      {...attributes}
    >
      <Link to={`/applications/${application.id}`} className={styles.company}>
        {application.company_name}
      </Link>
      <p className={styles.position}>{application.position}</p>
      <p className={styles.date}>{formatDate(application.date_applied)}</p>
    </div>
  );
}
