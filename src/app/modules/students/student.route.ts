import express from 'express';
import { studentControllers } from './student.controller';

//router
const router = express.Router();

// creating routes with controller function

router.get('/', studentControllers.getAllStudents);

router.get('/:studentId', studentControllers.getStudentById);

router.delete('/:studentId', studentControllers.deleteStudent);

export const studentRoutes = router;
