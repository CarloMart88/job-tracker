// ── Email types ──

export interface RawEmail {
  uid: number;
  source: Buffer;
}

export interface ParsedEmail {
  uid: number;
  from: string;
  fromAddress: string;
  subject: string;
  body: string;
  date: Date;
}

// ── Matcher types ──

export type ApplicationStatus = 'Sent' | 'Interview' | 'Offer' | 'Rejected';

export interface MatchedApplication {
  company: string;
  position: string;
  status: ApplicationStatus;
  emailSubject: string;
  emailFrom: string;
  emailDate: Date;
}

// ── Tracker API types ──

export interface TrackerApplication {
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

export interface TrackerSearchResponse {
  data: TrackerApplication[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateApplicationPayload {
  company_name: string;
  position: string;
  date_applied: string;
  status: ApplicationStatus;
  notes?: string;
}

export interface UpdateStatusPayload {
  status: ApplicationStatus;
  note?: string;
}

// ── Result types ──

export type SyncAction = 'created' | 'updated' | 'skipped';

export interface SyncResult {
  company: string;
  position: string;
  action: SyncAction;
  status: ApplicationStatus;
  emailSubject: string;
  emailFrom: string;
}
