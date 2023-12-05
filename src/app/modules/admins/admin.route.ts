import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { adminControllers } from './admin.controller';
import { adminValidations } from './admin.validation';

const router = Router();

router.get('/', adminControllers.getAllAdmins);

router.get('/:adminId', adminControllers.getSingleAdmin);

router.patch(
  '/:adminId',
  validateRequest(adminValidations.updateAdminValidationSchema),
  adminControllers.updateSingleAdmin,
);

router.delete('/:adminId', adminControllers.deleteAdmin);

export const AdminRoutes = router;
