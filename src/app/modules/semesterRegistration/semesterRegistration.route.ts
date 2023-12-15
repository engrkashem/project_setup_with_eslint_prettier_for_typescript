import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationValidations } from './semesterRegistration.validation';
import { SemesterRegistrationControllers } from './semesterRegistration.controller';

const router = Router();

router.post(
  '/create-semester-registration',
  validateRequest(
    SemesterRegistrationValidations.createSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationControllers.createSemesterRegistration,
);

router.get(
  '/:id',
  SemesterRegistrationControllers.getSingleSemesterRegistration,
);

router.patch(
  '/:id',
  validateRequest(
    SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationControllers.updateSemesterRegistration,
);

router.get('/', SemesterRegistrationControllers.getAllSemesterRegistration);

router.delete(
  '/:id',
  SemesterRegistrationControllers.deleteSingleSemesterRegistration,
);

export const SemesterRegistrationRoutes = router;
