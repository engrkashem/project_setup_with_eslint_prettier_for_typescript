import express from 'express';
import { studentControllers } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidations } from './student.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constants';

//router
const router = express.Router();

// creating routes with controller function

router.get(
  '/',
  auth(USER_ROLE.faculty, USER_ROLE.admin, USER_ROLE.superAdmin),
  studentControllers.getAllStudents,
);

router.get(
  '/:id',
  auth(USER_ROLE.faculty, USER_ROLE.admin, USER_ROLE.superAdmin),
  studentControllers.getSingleStudent,
);

router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(studentValidations.updateStudentValidationSchema),
  studentControllers.updateSingleStudent,
);

router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  studentControllers.deleteStudent,
);

export const StudentRoutes = router;
