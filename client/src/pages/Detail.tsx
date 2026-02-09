import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApplication, useUpdateApplication, useDeleteApplication } from '../hooks/useApplications';
import { CreateApplicationDTO } from '../types/application';
import ApplicationForm from '../components/applications/ApplicationForm';
import Timeline from '../components/applications/Timeline';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Spinner from '../components/ui/Spinner';
import { formatDate } from '../utils/formatDate';
import styles from './Detail.module.scss';

export default function Detail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: application, isLoading } = useApplication(parseInt(id || '0'));
  const updateMutation = useUpdateApplication();
  const deleteMutation = useDeleteApplication();
  const [editing, setEditing] = useState(false);

  if (isLoading) return <Spinner />;
  if (!application) return <p>Application not found</p>;

  const handleUpdate = (dto: CreateApplicationDTO) => {
    updateMutation.mutate(
      { id: application.id, dto },
      { onSuccess: () => setEditing(false) }
    );
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this application?')) {
      deleteMutation.mutate(application.id, { onSuccess: () => navigate('/applications') });
    }
  };

  return (
    <div className={styles.page}>
      <Link to="/applications" className={styles.back}>&larr; Back to Applications</Link>

      <div className={styles.header}>
        <div>
          <h2>{application.company_name}</h2>
          <p className={styles.position}>{application.position}</p>
        </div>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => setEditing(true)}>Edit</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>Details</h3>
          <div className={styles.details}>
            <div className={styles.detailRow}>
              <span className={styles.label}>Status</span>
              <StatusBadge status={application.status} />
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Date Applied</span>
              <span>{formatDate(application.date_applied)}</span>
            </div>
            {(application.salary_min || application.salary_max) && (
              <div className={styles.detailRow}>
                <span className={styles.label}>Salary Range</span>
                <span>
                  {application.salary_min?.toLocaleString() ?? '?'} - {application.salary_max?.toLocaleString() ?? '?'}
                </span>
              </div>
            )}
            {application.url && (
              <div className={styles.detailRow}>
                <span className={styles.label}>Job URL</span>
                <a href={application.url} target="_blank" rel="noopener noreferrer">{application.url}</a>
              </div>
            )}
            {application.notes && (
              <div className={styles.detailRow}>
                <span className={styles.label}>Notes</span>
                <p className={styles.notes}>{application.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div className={styles.card}>
          <h3>Status History</h3>
          <Timeline history={application.status_history} />
        </div>
      </div>

      <Modal isOpen={editing} onClose={() => setEditing(false)} title="Edit Application">
        <ApplicationForm
          initialData={application}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
          isLoading={updateMutation.isPending}
        />
      </Modal>
    </div>
  );
}
