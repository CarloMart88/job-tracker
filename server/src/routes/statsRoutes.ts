import { Router } from 'express';
import * as controller from '../controllers/statsController';

const router = Router();

router.get('/overview', controller.getOverview);
router.get('/trends', controller.getTrends);
router.get('/recent-activity', controller.getRecentActivity);

export default router;
