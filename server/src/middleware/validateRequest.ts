import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import { ApplicationStatus } from '../types/application';

const VALID_STATUSES: ApplicationStatus[] = ['Sent', 'Interview', 'Offer', 'Rejected'];

export function validateCreateApplication(req: Request, _res: Response, next: NextFunction) {
  const { company_name, position, date_applied, status } = req.body;

  if (!company_name || typeof company_name !== 'string' || company_name.trim().length === 0) {
    return next(new AppError(400, 'company_name is required'));
  }
  if (!position || typeof position !== 'string' || position.trim().length === 0) {
    return next(new AppError(400, 'position is required'));
  }
  if (!date_applied) {
    return next(new AppError(400, 'date_applied is required'));
  }
  if (status && !VALID_STATUSES.includes(status)) {
    return next(new AppError(400, `status must be one of: ${VALID_STATUSES.join(', ')}`));
  }

  next();
}

export function validateUpdateStatus(req: Request, _res: Response, next: NextFunction) {
  const { status } = req.body;

  if (!status || !VALID_STATUSES.includes(status)) {
    return next(new AppError(400, `status must be one of: ${VALID_STATUSES.join(', ')}`));
  }

  next();
}
