import { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useApplications, useUpdateStatus } from '../hooks/useApplications';
import { Application, ApplicationStatus } from '../types/application';
import { STATUSES } from '../utils/constants';
import KanbanColumn from '../components/kanban/KanbanColumn';
import KanbanCard from '../components/kanban/KanbanCard';
import Spinner from '../components/ui/Spinner';
import styles from './Kanban.module.scss';

export default function Kanban() {
  const { data, isLoading } = useApplications({ limit: 100 });
  const updateStatus = useUpdateStatus();
  const [activeCard, setActiveCard] = useState<Application | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const applications = data?.data ?? [];

  const columns: Record<ApplicationStatus, Application[]> = {
    Sent: [],
    Interview: [],
    Offer: [],
    Rejected: [],
  };

  for (const app of applications) {
    columns[app.status].push(app);
  }

  const handleDragStart = (event: DragStartEvent) => {
    const app = applications.find(a => a.id === event.active.id);
    setActiveCard(app ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveCard(null);
    const { active, over } = event;

    if (!over) return;

    const appId = active.id as number;
    const newStatus = over.id as ApplicationStatus;

    const app = applications.find(a => a.id === appId);
    if (!app || app.status === newStatus) return;

    updateStatus.mutate({ id: appId, status: newStatus });
  };

  if (isLoading) return <Spinner />;

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Kanban Board</h2>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className={styles.board}>
          {STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              applications={columns[status]}
            />
          ))}
        </div>

        <DragOverlay>
          {activeCard ? <KanbanCard application={activeCard} isDragging /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
