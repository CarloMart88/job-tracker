import api from './api';
import { Application, ApplicationWithHistory, CreateApplicationDTO, UpdateApplicationDTO, ApplicationFilters } from '../types/application';
import { PaginatedResponse } from '../types/api';

export async function getApplications(filters: ApplicationFilters = {}): Promise<PaginatedResponse<Application>> {
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status);
  if (filters.search) params.set('search', filters.search);
  if (filters.sort_by) params.set('sort_by', filters.sort_by);
  if (filters.sort_order) params.set('sort_order', filters.sort_order);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));

  const { data } = await api.get<PaginatedResponse<Application>>(`/applications?${params}`);
  return data;
}

export async function getApplication(id: number): Promise<ApplicationWithHistory> {
  const { data } = await api.get<ApplicationWithHistory>(`/applications/${id}`);
  return data;
}

export async function createApplication(dto: CreateApplicationDTO): Promise<Application> {
  const { data } = await api.post<Application>('/applications', dto);
  return data;
}

export async function updateApplication(id: number, dto: UpdateApplicationDTO): Promise<Application> {
  const { data } = await api.put<Application>(`/applications/${id}`, dto);
  return data;
}

export async function updateApplicationStatus(id: number, status: string, note?: string): Promise<Application> {
  const { data } = await api.patch<Application>(`/applications/${id}/status`, { status, note });
  return data;
}

export async function deleteApplication(id: number): Promise<void> {
  await api.delete(`/applications/${id}`);
}
