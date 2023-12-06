import express from 'express';
import { studentControllers } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidations } from './student.validation';

//router
const router = express.Router();

// creating routes with controller function

router.get('/', studentControllers.getAllStudents);

router.get('/:id', studentControllers.getSingleStudent);

router.patch(
  '/:id',
  validateRequest(studentValidations.updateStudentValidationSchema),
  studentControllers.updateSingleStudent,
);

router.delete('/:id', studentControllers.deleteStudent);

export const StudentRoutes = router;
