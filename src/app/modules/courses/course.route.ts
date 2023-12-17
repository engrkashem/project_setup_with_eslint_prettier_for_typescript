import { Router } from 'express';
import { courseValidations } from './course.validation';
import { CourseControllers } from './course.controller';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';

const router = Router();

router.post(
  '/create-course',
  auth('admin'),
  validateRequest(courseValidations.createCourseValidationSchema),
  CourseControllers.createCourse,
);

router.get(
  '/',
  auth('student', 'faculty', 'admin'),
  CourseControllers.getAllCourse,
);

router.get(
  '/:id',
  auth('student', 'faculty', 'admin'),
  CourseControllers.getSingleCourse,
);

router.patch(
  '/:id',
  auth('admin'),
  validateRequest(courseValidations.updateCourseValidationSchema),
  CourseControllers.updateSingleCourse,
);

router.delete('/:id', auth('admin'), CourseControllers.deleteSingleCourse);

router.put(
  '/:courseId/assign-faculties',
  auth('admin'),
  validateRequest(courseValidations.AssignFacultiesToCourseValidationSchema),
  CourseControllers.assignFacultiesToCourse,
);

router.delete(
  '/:courseId/remove-faculties',
  auth('admin'),
  validateRequest(courseValidations.AssignFacultiesToCourseValidationSchema),
  CourseControllers.removeFacultiesFromCourse,
);

export const CourseRoutes = router;
