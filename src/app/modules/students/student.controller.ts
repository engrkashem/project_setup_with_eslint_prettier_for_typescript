import { NextFunction, Request, Response } from 'express';
import { studentServices } from './student.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

// import studentValidationSchema from './student.validation'; //joi validation

const getAllStudents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await studentServices.getAllStudentsFromDB();

    // sending response
    sendResponse(res, {
      success: true,
      message: 'Student retrieve request is success',
      data: result,
      statusCode: httpStatus.OK,
    });
  } catch (err) {
    next(err);
  }
};

const getStudentById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { studentId } = req.params;
    const result = await studentServices.getStudentByIdFromDB(studentId);

    sendResponse(res, {
      success: true,
      message: 'Student retrieve request is success',
      data: result,
      statusCode: httpStatus.OK,
    });
  } catch (err) {
    next(err);
  }
};

const deleteStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { studentId } = req.params;
    const result = await studentServices.deleteStudentFromDB(studentId);

    sendResponse(res, {
      success: true,
      message: 'Student is deleted successfully',
      data: result,
      statusCode: httpStatus.OK,
    });
  } catch (err) {
    next(err);
  }
};

export const studentControllers = {
  getAllStudents,
  getStudentById,
  deleteStudent,
};

/*
    if (err) {
      res.status(400).json({
        success: false,
        message: err.message || 'Student collection is not found',
        error: err,
      });
    }
    */
