import express from 'express';
import { UserControllers } from './user.controller';
import { studentValidations } from '../students/student.validation';
import validateRequest from '../../middlewares/validateRequest';
import { facultyValidations } from '../faculties/faculty.validation';
import { adminValidations } from '../admins/admin.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constants';

const router = express.Router();

router.post(
  '/create-student',
  auth(USER_ROLE.admin),
  validateRequest(studentValidations.createStudentValidationSchema),
  UserControllers.createStudent,
);

router.post(
  '/create-faculty',
  auth(USER_ROLE.admin),
  validateRequest(facultyValidations.createFacultyValidationSchema),
  UserControllers.createFaculty,
);

router.post(
  '/create-admin',
  validateRequest(adminValidations.createAdminValidationSchema),
  UserControllers.createAdmin,
);

export const UserRoutes = router;
