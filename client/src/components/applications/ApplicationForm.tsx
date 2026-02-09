import { useState, FormEvent } from 'react';
import { CreateApplicationDTO, Application, ApplicationStatus } from '../../types/application';
import { STATUSES } from '../../utils/constants';
import { toInputDate } from '../../utils/formatDate';
import Button from '../ui/Button';
import styles from './ApplicationForm.module.scss';

interface ApplicationFormProps {
  initialData?: Application;
  onSubmit: (data: CreateApplicationDTO) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ApplicationForm({ initialData, onSubmit, onCancel, isLoading }: ApplicationFormProps) {
  const [formData, setFormData] = useState<CreateApplicationDTO>({
    company_name: initialData?.company_name || '',
    position: initialData?.position || '',
    url: initialData?.url || '',
    status: initialData?.status || 'Sent',
    salary_min: initialData?.salary_min ?? undefined,
    salary_max: initialData?.salary_max ?? undefined,
    notes: initialData?.notes || '',
    date_applied: initialData ? toInputDate(initialData.date_applied) : new Date().toISOString().split('T')[0]!,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.company_name.trim()) newErrors.company_name = 'Company name is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.date_applied) newErrors.date_applied = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(formData);
  };

  const handleChange = (field: string, value: string | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const next = { ...prev }; delete next[field]; return next; });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.row}>
        <div className={styles.field}>
          <label>Company Name *</label>
          <input type="text" value={formData.company_name} onChange={(e) => handleChange('company_name', e.target.value)} />
          {errors.company_name && <span className={styles.error}>{errors.company_name}</span>}
        </div>
        <div className={styles.field}>
          <label>Position *</label>
          <input type="text" value={formData.position} onChange={(e) => handleChange('position', e.target.value)} />
          {errors.position && <span className={styles.error}>{errors.position}</span>}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label>Status</label>
          <select value={formData.status} onChange={(e) => handleChange('status', e.target.value as ApplicationStatus)}>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className={styles.field}>
          <label>Date Applied *</label>
          <input type="date" value={formData.date_applied} onChange={(e) => handleChange('date_applied', e.target.value)} />
          {errors.date_applied && <span className={styles.error}>{errors.date_applied}</span>}
        </div>
      </div>

      <div className={styles.field}>
        <label>Job URL</label>
        <input type="url" value={formData.url || ''} onChange={(e) => handleChange('url', e.target.value)} placeholder="https://..." />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label>Min Salary</label>
          <input type="number" value={formData.salary_min ?? ''} onChange={(e) => handleChange('salary_min', e.target.value ? parseInt(e.target.value) : undefined)} />
        </div>
        <div className={styles.field}>
          <label>Max Salary</label>
          <input type="number" value={formData.salary_max ?? ''} onChange={(e) => handleChange('salary_max', e.target.value ? parseInt(e.target.value) : undefined)} />
        </div>
      </div>

      <div className={styles.field}>
        <label>Notes</label>
        <textarea value={formData.notes || ''} onChange={(e) => handleChange('notes', e.target.value)} rows={3} />
      </div>

      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>{initialData ? 'Update' : 'Create'} Application</Button>
      </div>
    </form>
  );
}
