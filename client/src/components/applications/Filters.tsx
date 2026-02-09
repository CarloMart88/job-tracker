import { ApplicationStatus, ApplicationFilters } from '../../types/application';
import { STATUSES } from '../../utils/constants';
import styles from './Filters.module.scss';

interface FiltersProps {
  filters: ApplicationFilters;
  onChange: (filters: ApplicationFilters) => void;
}

export default function Filters({ filters, onChange }: FiltersProps) {
  return (
    <div className={styles.filters}>
      <select
        value={filters.status || ''}
        onChange={(e) => onChange({ ...filters, status: (e.target.value || undefined) as ApplicationStatus | undefined, page: 1 })}
        className={styles.select}
      >
        <option value="">All Statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <select
        value={filters.sort_by || 'created_at'}
        onChange={(e) => onChange({ ...filters, sort_by: e.target.value, page: 1 })}
        className={styles.select}
      >
        <option value="created_at">Date Created</option>
        <option value="date_applied">Date Applied</option>
        <option value="company_name">Company</option>
        <option value="position">Position</option>
        <option value="status">Status</option>
      </select>

      <select
        value={filters.sort_order || 'DESC'}
        onChange={(e) => onChange({ ...filters, sort_order: e.target.value as 'ASC' | 'DESC', page: 1 })}
        className={styles.select}
      >
        <option value="DESC">Newest first</option>
        <option value="ASC">Oldest first</option>
      </select>
    </div>
  );
}
