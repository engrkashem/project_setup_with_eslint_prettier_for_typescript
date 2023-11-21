import { Request, Response } from 'express';
import { studentServices } from './student.service';
import { joiSchemas } from './student.validation';

const createStudent = async (req: Request, res: Response) => {
  try {
    const { student: studentData } = req.body;

    const { error } = joiSchemas.studentValidationSchema.validate(studentData);

    if (error) {
      res.status(500).json({
        success: false,
        message: 'Student creation is failed',
        error: error.details,
      });
    }

    // calling service function to send data to database
    const result = await studentServices.addStudentToDB(studentData);

    // sending response
    res.status(201).json({
      success: true,
      message: 'Student is created successfully',
      data: result,
    });
  } catch (err) {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Student creation is failed',
        error: err,
      });
    }
  }
};

const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await studentServices.getAllStudentsFromDB();

    // sending response
    res.status(200).json({
      success: true,
      message: 'Student information extracted successfully',
      data: result,
    });
  } catch (err) {
    if (err) {
      res.status(400).json({
        success: false,
        message: 'Student collection is not found',
        error: err,
      });
    }
  }
};

const getStudentById = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const result = await studentServices.getStudentByIdFromDB(studentId);

    res.status(200).json({
      success: true,
      message: `student of id:${studentId} is found`,
      data: result,
    });
  } catch (err) {
    if (err) {
      res.status(404).json({
        success: false,
        message: 'student not found',
        error: err,
      });
    }
  }
};

export const studentControllers = {
  createStudent,
  getAllStudents,
  getStudentById,
};
