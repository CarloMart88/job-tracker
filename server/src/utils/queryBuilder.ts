import { ApplicationQuery } from '../types/application';

const ALLOWED_SORT_COLUMNS = ['company_name', 'position', 'status', 'date_applied', 'created_at', 'salary_min'];

export function buildApplicationQuery(query: ApplicationQuery) {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (query.status) {
    conditions.push('status = ?');
    params.push(query.status);
  }

  if (query.search) {
    conditions.push('(company_name LIKE ? OR position LIKE ? OR notes LIKE ?)');
    const searchTerm = `%${query.search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const sortBy = ALLOWED_SORT_COLUMNS.includes(query.sort_by || '') ? query.sort_by : 'created_at';
  const sortOrder = query.sort_order === 'ASC' ? 'ASC' : 'DESC';
  const orderClause = `ORDER BY ${sortBy} ${sortOrder}`;

  return { whereClause, orderClause, params };
}
