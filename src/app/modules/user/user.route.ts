import express from 'express';
import { UserControllers } from './user.controller';
import { studentValidations } from '../students/student.validation';
import validateRequest from '../../middlewares/validateRequest';
import { facultyValidations } from '../faculties/faculty.validation';

const router = express.Router();

router.post(
  '/create-student',
  validateRequest(studentValidations.createStudentValidationSchema),
  UserControllers.createStudent,
);

router.post(
  '/create-faculty',
  validateRequest(facultyValidations.createFacultyValidationSchema),
  UserControllers.createFaculty,
);

export const UserRoutes = router;
