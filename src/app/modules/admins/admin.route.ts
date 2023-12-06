import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { adminControllers } from './admin.controller';
import { adminValidations } from './admin.validation';

const router = Router();

router.get('/', adminControllers.getAllAdmins);

router.get('/:id', adminControllers.getSingleAdmin);

router.patch(
  '/:id',
  validateRequest(adminValidations.updateAdminValidationSchema),
  adminControllers.updateSingleAdmin,
);

router.delete('/:id', adminControllers.deleteAdmin);

export const AdminRoutes = router;
