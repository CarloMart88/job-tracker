import { ApplicationStatus } from '../types/application';

export const STATUSES: ApplicationStatus[] = ['Sent', 'Interview', 'Offer', 'Rejected'];

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  Sent: 'Sent',
  Interview: 'Interview',
  Offer: 'Offer',
  Rejected: 'Rejected',
};
