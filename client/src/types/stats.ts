export interface StatsOverview {
  total: number;
  this_week: number;
  this_month: number;
  by_status: { status: string; count: number }[];
}

export interface TrendData {
  month: string;
  count: number;
}

export interface RecentActivity {
  id: number;
  application_id: number;
  old_status: string | null;
  new_status: string;
  changed_at: string;
  note: string | null;
  company_name: string;
  position: string;
}
