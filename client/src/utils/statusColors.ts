import { ApplicationStatus } from '../types/application';

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  Sent: '#3b82f6',
  Interview: '#f59e0b',
  Offer: '#10b981',
  Rejected: '#ef4444',
};

export const STATUS_BG_COLORS: Record<ApplicationStatus, string> = {
  Sent: '#eff6ff',
  Interview: '#fffbeb',
  Offer: '#ecfdf5',
  Rejected: '#fef2f2',
};
