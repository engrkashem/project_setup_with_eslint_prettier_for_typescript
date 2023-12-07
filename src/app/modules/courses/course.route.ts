import { Router } from 'express';
import { courseValidations } from './course.validation';
import { CourseControllers } from './course.controller';
import validateRequest from '../../middlewares/validateRequest';

const router = Router();

router.post(
  '/create-course',
  validateRequest(courseValidations.createCourseValidationSchema),
  CourseControllers.createCourse,
);

router.get('/', CourseControllers.getAllCourse);

router.get('/:id', CourseControllers.getSingleCourse);

router.patch(
  '/:id',
  validateRequest(courseValidations.updateCourseValidationSchema),
  CourseControllers.updateSingleCourse,
);

router.delete('/:id', CourseControllers.deleteSingleCourse);

router.put(
  '/:courseId/assign-faculties',
  validateRequest(courseValidations.AssignFacultiesToCourseValidationSchema),
  CourseControllers.assignFacultiesToCourse,
);

router.delete(
  '/:courseId/remove-faculties',
  validateRequest(courseValidations.AssignFacultiesToCourseValidationSchema),
  CourseControllers.removeFacultiesFromCourse,
);

export const CourseRoutes = router;
