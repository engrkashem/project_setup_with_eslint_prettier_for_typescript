import { Request, Response } from 'express';
import { studentServices } from './student.service';
import studentValidationSchema from './student.validation';

// import studentValidationSchema from './student.validation'; //joi validation

const createStudent = async (req: Request, res: Response) => {
  try {
    const { student: studentData } = req.body;

    //data validation with zod
    const zodParsedData = studentValidationSchema.parse(studentData);
    // console.log(zodParsedData);

    //validating data with joi
    /*
    const { error, value } = studentValidationSchema.validate(studentData);

    if (error) {
      res.status(500).json({
        success: false,
        message: 'Student creation is failed',
        error: error.details,
      });
    }
    // calling service func to send data to db
    const result = await studentServices.addStudentToDB(value);
    */

    // calling service function to send data to database

    const result = await studentServices.addStudentToDB(zodParsedData);
    // const result = await studentServices.addStudentToDB(studentData);

    // sending response
    res.status(201).json({
      success: true,
      message: 'Student is created successfully',
      data: result,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err) {
      res.status(500).json({
        success: false,
        message: err.message || 'Student creation is failed',
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err) {
      res.status(400).json({
        success: false,
        message: err.message || 'Student collection is not found',
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err) {
      res.status(404).json({
        success: false,
        message: err.message || 'student not found',
        error: err,
      });
    }
  }
};

const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const result = await studentServices.deleteStudentFromDB(studentId);

    res.status(200).json({
      success: true,
      message: 'Student is deleted successfully',
      data: result,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err) {
      res.status(400).json({
        success: false,
        message: err.message || 'Student deletion request is denied',
        error: err,
      });
    }
  }
};

export const studentControllers = {
  createStudent,
  getAllStudents,
  getStudentById,
  deleteStudent,
};
