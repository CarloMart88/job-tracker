export type ApplicationStatus = 'Sent' | 'Interview' | 'Offer' | 'Rejected';

export interface Application {
  id: number;
  company_name: string;
  position: string;
  url: string | null;
  status: ApplicationStatus;
  salary_min: number | null;
  salary_max: number | null;
  notes: string | null;
  date_applied: string;
  created_at: string;
  updated_at: string;
}

export interface ApplicationWithHistory extends Application {
  status_history: StatusHistoryEntry[];
}

export interface StatusHistoryEntry {
  id: number;
  application_id: number;
  old_status: ApplicationStatus | null;
  new_status: ApplicationStatus;
  changed_at: string;
  note: string | null;
}

export interface CreateApplicationDTO {
  company_name: string;
  position: string;
  url?: string;
  status?: ApplicationStatus;
  salary_min?: number | null;
  salary_max?: number | null;
  notes?: string;
  date_applied: string;
}

export interface UpdateApplicationDTO extends Partial<CreateApplicationDTO> {}

export interface ApplicationFilters {
  status?: ApplicationStatus;
  search?: string;
  sort_by?: string;
  sort_order?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}
