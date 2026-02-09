import { Link } from 'react-router-dom';
import { Application } from '../../types/application';
import StatusBadge from '../ui/StatusBadge';
import { formatDate } from '../../utils/formatDate';
import styles from './ApplicationTable.module.scss';

interface ApplicationTableProps {
  applications: Application[];
  onDelete: (id: number) => void;
}

export default function ApplicationTable({ applications, onDelete }: ApplicationTableProps) {
  if (applications.length === 0) {
    return <p className={styles.empty}>No applications found. Create your first one!</p>;
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Company</th>
            <th>Position</th>
            <th>Status</th>
            <th>Date Applied</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id}>
              <td>
                <Link to={`/applications/${app.id}`} className={styles.link}>
                  {app.company_name}
                </Link>
              </td>
              <td>{app.position}</td>
              <td><StatusBadge status={app.status} /></td>
              <td>{formatDate(app.date_applied)}</td>
              <td>
                {app.salary_min || app.salary_max
                  ? `${app.salary_min ? `${app.salary_min.toLocaleString()}` : '?'} - ${app.salary_max ? `${app.salary_max.toLocaleString()}` : '?'}`
                  : '-'}
              </td>
              <td>
                <div className={styles.actions}>
                  <Link to={`/applications/${app.id}`} className={styles.actionBtn}>View</Link>
                  <button onClick={() => onDelete(app.id)} className={styles.deleteBtn}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
