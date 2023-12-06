import { Router } from 'express';
import { facultyControllers } from './faculty.controllers';
import validateRequest from '../../middlewares/validateRequest';
import { facultyValidations } from './faculty.validation';

const router = Router();

router.get('/', facultyControllers.getAllFaculties);

router.get('/:id', facultyControllers.getSingleFaculty);

router.patch(
  '/:id',
  validateRequest(facultyValidations.updateFacultyValidationSchema),
  facultyControllers.updateSingleFaculty,
);

router.delete('/:id', facultyControllers.deleteFaculty);

export const FacultyRoutes = router;
