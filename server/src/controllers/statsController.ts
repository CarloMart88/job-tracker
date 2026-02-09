import { Request, Response, NextFunction } from 'express';
import pool from '../config/database';
import * as statusHistoryModel from '../models/statusHistoryModel';
import { RowDataPacket } from 'mysql2';

export async function getOverview(_req: Request, res: Response, next: NextFunction) {
  try {
    const [statusCounts] = await pool.query<RowDataPacket[]>(
      'SELECT status, COUNT(*) as count FROM applications GROUP BY status'
    );

    const [totalRow] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as total FROM applications'
    );

    const [thisWeekRow] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM applications WHERE date_applied >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)'
    );

    const [thisMonthRow] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM applications WHERE date_applied >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)'
    );

    res.json({
      total: totalRow[0]!.total,
      this_week: thisWeekRow[0]!.count,
      this_month: thisMonthRow[0]!.count,
      by_status: statusCounts,
    });
  } catch (err) {
    next(err);
  }
}

export async function getTrends(_req: Request, res: Response, next: NextFunction) {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT
        DATE_FORMAT(date_applied, '%Y-%m') as month,
        COUNT(*) as count
      FROM applications
      WHERE date_applied >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY month
      ORDER BY month ASC`
    );

    res.json(rows);
  } catch (err) {
    next(err);
  }
}

export async function getRecentActivity(_req: Request, res: Response, next: NextFunction) {
  try {
    const activity = await statusHistoryModel.getRecentActivity(10);
    res.json(activity);
  } catch (err) {
    next(err);
  }
}
