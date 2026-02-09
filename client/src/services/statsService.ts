import api from './api';
import { StatsOverview, TrendData, RecentActivity } from '../types/stats';

export async function getOverview(): Promise<StatsOverview> {
  const { data } = await api.get<StatsOverview>('/stats/overview');
  return data;
}

export async function getTrends(): Promise<TrendData[]> {
  const { data } = await api.get<TrendData[]>('/stats/trends');
  return data;
}

export async function getRecentActivity(): Promise<RecentActivity[]> {
  const { data } = await api.get<RecentActivity[]>('/stats/recent-activity');
  return data;
}
