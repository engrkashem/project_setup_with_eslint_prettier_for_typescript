import { Router } from 'express';
import { facultyControllers } from './faculty.controllers';
import validateRequest from '../../middlewares/validateRequest';
import { facultyValidations } from './faculty.validation';

const router = Router();

router.get('/', facultyControllers.getAllFaculties);

router.get('/:facultyId', facultyControllers.getSingleFaculty);

router.patch(
  '/:facultyId',
  validateRequest(facultyValidations.updateFacultyValidationSchema),
  facultyControllers.updateSingleFaculty,
);

router.delete('/:facultyId', facultyControllers.deleteFaculty);

export const FacultyRoutes = router;
