import { Router } from 'express';
import { facultyControllers } from './faculty.controllers';
import validateRequest from '../../middlewares/validateRequest';
import { facultyValidations } from './faculty.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constants';

const router = Router();

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.superAdmin),
  facultyControllers.getAllFaculties,
);

router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.superAdmin),
  facultyControllers.getSingleFaculty,
);

router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(facultyValidations.updateFacultyValidationSchema),
  facultyControllers.updateSingleFaculty,
);

router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  facultyControllers.deleteFaculty,
);

export const FacultyRoutes = router;
