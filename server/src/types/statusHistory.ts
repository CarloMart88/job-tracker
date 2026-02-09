import { ApplicationStatus } from './application';

export interface StatusHistory {
  id: number;
  application_id: number;
  old_status: ApplicationStatus | null;
  new_status: ApplicationStatus;
  changed_at: string;
  note: string | null;
}
