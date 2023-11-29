import { NextFunction, Request, Response } from 'express';
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { password, student: studentData } = req.body;

    // calling service function to send data to database
    const result = await UserServices.addStudentToDB(password, studentData);

    // sending response
    sendResponse(res, {
      success: true,
      message: 'Student is created successfully',
      data: result,
      statusCode: httpStatus.OK,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    next(err);
  }
};

export const UserControllers = {
  createStudent,
};

/*

//data validation with zod
    // const zodParsedData = studentValidationSchema.parse(studentData);
    // console.log(zodParsedData);

    //validating data with joi
    *
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
      *



*/

/*
    res.status(201).json({
      success: true,
      message: 'Student is created successfully',
      data: result,
    });
    */
