import express, { NextFunction, Request, Response } from 'express';
import { UserControllers } from './user.controller';
import { studentValidations } from '../students/student.validation';
import validateRequest from '../../middlewares/validateRequest';
import { facultyValidations } from '../faculties/faculty.validation';
import { adminValidations } from '../admins/admin.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constants';
import { UserValidations } from './user.validation';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

router.post(
  '/create-student',
  auth(USER_ROLE.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(studentValidations.createStudentValidationSchema),
  UserControllers.createStudent,
);

router.post(
  '/create-faculty',
  auth(USER_ROLE.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(facultyValidations.createFacultyValidationSchema),
  UserControllers.createFaculty,
);

router.post(
  '/create-admin',
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(adminValidations.createAdminValidationSchema),
  UserControllers.createAdmin,
);

router.get('/me', auth('student', 'faculty', 'admin'), UserControllers.getMe);

router.post(
  '/change-status/:id',
  auth('admin'),
  validateRequest(UserValidations.changeStatusValidationSchema),
  UserControllers.changeStatus,
);

export const UserRoutes = router;
