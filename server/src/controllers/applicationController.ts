import { Request, Response, NextFunction } from 'express';
import * as applicationModel from '../models/applicationModel';
import * as statusHistoryModel from '../models/statusHistoryModel';
import { AppError } from '../middleware/errorHandler';
import { ApplicationStatus } from '../types/application';

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await applicationModel.findAll({
      status: req.query.status as ApplicationStatus | undefined,
      search: req.query.search as string | undefined,
      sort_by: req.query.sort_by as string | undefined,
      sort_order: req.query.sort_order as 'ASC' | 'DESC' | undefined,
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id);
    const application = await applicationModel.findById(id);

    if (!application) {
      throw new AppError(404, 'Application not found');
    }

    const statusHistory = await statusHistoryModel.findByApplicationId(id);
    res.json({ ...application, status_history: statusHistory });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const application = await applicationModel.create(req.body);

    await statusHistoryModel.create(
      application.id,
      null,
      application.status,
      'Application created'
    );

    res.status(201).json(application);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id);
    const existing = await applicationModel.findById(id);

    if (!existing) {
      throw new AppError(404, 'Application not found');
    }

    if (req.body.status && req.body.status !== existing.status) {
      await statusHistoryModel.create(id, existing.status, req.body.status);
    }

    const updated = await applicationModel.update(id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function updateStatus(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id);
    const existing = await applicationModel.findById(id);

    if (!existing) {
      throw new AppError(404, 'Application not found');
    }

    const { status, note } = req.body;

    if (status === existing.status) {
      res.json(existing);
      return;
    }

    await statusHistoryModel.create(id, existing.status, status, note);
    const updated = await applicationModel.updateStatus(id, status);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id);
    const deleted = await applicationModel.remove(id);

    if (!deleted) {
      throw new AppError(404, 'Application not found');
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
