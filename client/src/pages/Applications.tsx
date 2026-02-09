import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useApplications, useCreateApplication, useDeleteApplication } from '../hooks/useApplications';
import { useDebounce } from '../hooks/useDebounce';
import { ApplicationFilters, CreateApplicationDTO } from '../types/application';
import ApplicationTable from '../components/applications/ApplicationTable';
import ApplicationForm from '../components/applications/ApplicationForm';
import Filters from '../components/applications/Filters';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { LayoutContext } from '../components/layout/MainLayout';
import styles from './Applications.module.scss';

export default function Applications() {
  const { searchQuery } = useOutletContext<LayoutContext>();
  const debouncedSearch = useDebounce(searchQuery, 300);

  const [filters, setFilters] = useState<ApplicationFilters>({
    sort_by: 'created_at',
    sort_order: 'DESC',
    page: 1,
    limit: 10,
  });

  const activeFilters = { ...filters, search: debouncedSearch || undefined };
  const { data, isLoading } = useApplications(activeFilters);
  const createMutation = useCreateApplication();
  const deleteMutation = useDeleteApplication();

  const [showForm, setShowForm] = useState(false);

  const handleCreate = (dto: CreateApplicationDTO) => {
    createMutation.mutate(dto, { onSuccess: () => setShowForm(false) });
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this application?')) {
      deleteMutation.mutate(id);
    }
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2>Applications</h2>
        <Button onClick={() => setShowForm(true)}>+ New Application</Button>
      </div>

      <Filters filters={filters} onChange={setFilters} />

      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <ApplicationTable
            applications={data?.data ?? []}
            onDelete={handleDelete}
          />

          {data && data.pagination.totalPages > 1 && (
            <div className={styles.pagination}>
              <Button
                variant="secondary"
                size="sm"
                disabled={data.pagination.page <= 1}
                onClick={() => handlePageChange(data.pagination.page - 1)}
              >
                Previous
              </Button>
              <span className={styles.pageInfo}>
                Page {data.pagination.page} of {data.pagination.totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={data.pagination.page >= data.pagination.totalPages}
                onClick={() => handlePageChange(data.pagination.page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="New Application">
        <ApplicationForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
          isLoading={createMutation.isPending}
        />
      </Modal>
    </div>
  );
}
