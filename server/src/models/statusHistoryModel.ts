import pool from '../config/database';
import { StatusHistory } from '../types/statusHistory';
import { ApplicationStatus } from '../types/application';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function findByApplicationId(applicationId: number): Promise<StatusHistory[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM status_history WHERE application_id = ? ORDER BY changed_at DESC',
    [applicationId]
  );
  return rows as StatusHistory[];
}

export async function create(
  applicationId: number,
  oldStatus: ApplicationStatus | null,
  newStatus: ApplicationStatus,
  note?: string
): Promise<StatusHistory> {
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO status_history (application_id, old_status, new_status, note) VALUES (?, ?, ?, ?)',
    [applicationId, oldStatus, newStatus, note || null]
  );

  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM status_history WHERE id = ?',
    [result.insertId]
  );
  return rows[0] as StatusHistory;
}

export async function getRecentActivity(limit: number = 10): Promise<(StatusHistory & { company_name: string; position: string })[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT sh.*, a.company_name, a.position
     FROM status_history sh
     JOIN applications a ON sh.application_id = a.id
     ORDER BY sh.changed_at DESC
     LIMIT ?`,
    [limit]
  );
  return rows as (StatusHistory & { company_name: string; position: string })[];
}
