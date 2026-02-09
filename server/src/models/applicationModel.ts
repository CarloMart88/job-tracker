import pool from '../config/database';
import { Application, CreateApplicationDTO, UpdateApplicationDTO, ApplicationQuery } from '../types/application';
import { buildApplicationQuery } from '../utils/queryBuilder';
import { getPaginationParams, PaginationResult } from '../utils/pagination';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function findAll(query: ApplicationQuery): Promise<PaginationResult<Application>> {
  const { whereClause, orderClause, params } = buildApplicationQuery(query);
  const { page, limit, offset } = getPaginationParams(query.page, query.limit);

  const [countRows] = await pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) as total FROM applications ${whereClause}`,
    params
  );
  const total = countRows[0]!.total as number;

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM applications ${whereClause} ${orderClause} LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return {
    data: rows as Application[],
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function findById(id: number): Promise<Application | null> {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM applications WHERE id = ?',
    [id]
  );
  return (rows[0] as Application) || null;
}

export async function create(data: CreateApplicationDTO): Promise<Application> {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO applications (company_name, position, url, status, salary_min, salary_max, notes, date_applied)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.company_name,
      data.position,
      data.url || null,
      data.status || 'Sent',
      data.salary_min || null,
      data.salary_max || null,
      data.notes || null,
      data.date_applied,
    ]
  );

  const created = await findById(result.insertId);
  return created!;
}

export async function update(id: number, data: UpdateApplicationDTO): Promise<Application | null> {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (data.company_name !== undefined) { fields.push('company_name = ?'); values.push(data.company_name); }
  if (data.position !== undefined) { fields.push('position = ?'); values.push(data.position); }
  if (data.url !== undefined) { fields.push('url = ?'); values.push(data.url); }
  if (data.status !== undefined) { fields.push('status = ?'); values.push(data.status); }
  if (data.salary_min !== undefined) { fields.push('salary_min = ?'); values.push(data.salary_min); }
  if (data.salary_max !== undefined) { fields.push('salary_max = ?'); values.push(data.salary_max); }
  if (data.notes !== undefined) { fields.push('notes = ?'); values.push(data.notes); }
  if (data.date_applied !== undefined) { fields.push('date_applied = ?'); values.push(data.date_applied); }

  if (fields.length === 0) return findById(id);

  values.push(id);
  await pool.query<ResultSetHeader>(
    `UPDATE applications SET ${fields.join(', ')} WHERE id = ?`,
    values
  );

  return findById(id);
}

export async function updateStatus(id: number, status: string): Promise<Application | null> {
  await pool.query<ResultSetHeader>(
    'UPDATE applications SET status = ? WHERE id = ?',
    [status, id]
  );
  return findById(id);
}

export async function remove(id: number): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM applications WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
}
