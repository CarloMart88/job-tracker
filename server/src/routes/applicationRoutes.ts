import { Router } from 'express';
import * as controller from '../controllers/applicationController';
import { validateCreateApplication, validateUpdateStatus } from '../middleware/validateRequest';

const router = Router();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', validateCreateApplication, controller.create);
router.put('/:id', controller.update);
router.patch('/:id/status', validateUpdateStatus, controller.updateStatus);
router.delete('/:id', controller.remove);

export default router;
