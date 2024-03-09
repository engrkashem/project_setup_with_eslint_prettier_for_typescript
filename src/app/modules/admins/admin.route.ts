import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { adminControllers } from './admin.controller';
import { adminValidations } from './admin.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constants';

const router = Router();

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  adminControllers.getAllAdmins,
);

router.get(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  adminControllers.getSingleAdmin,
);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(adminValidations.updateAdminValidationSchema),
  adminControllers.updateSingleAdmin,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  adminControllers.deleteAdmin,
);

export const AdminRoutes = router;
