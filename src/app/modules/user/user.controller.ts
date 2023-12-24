import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import handleAsyncRequest from '../../utils/handleAsyncRequest';

const createStudent = handleAsyncRequest(async (req, res) => {
  const { password, student: studentData } = req.body;

  // calling service function to send data to database
  const result = await UserServices.addStudentToDB(
    req.file,
    password,
    studentData,
  );

  // sending response
  sendResponse(res, {
    success: true,
    message: 'Student is created successfully',
    data: result,
    statusCode: httpStatus.OK,
  });
});

const createFaculty = handleAsyncRequest(async (req, res) => {
  const { password, faculty: facultyData } = req.body;

  const result = await UserServices.addFacultyIntoDB(
    req.file,
    password,
    facultyData,
  );

  // sending response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty is created successfully',
    data: result,
  });
});
const createAdmin = handleAsyncRequest(async (req, res) => {
  const { password, admin: adminData } = req.body;

  const result = await UserServices.addAdminIntoDB(
    req.file,
    password,
    adminData,
  );

  // sending response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin is created successfully',
    data: result,
  });
});

const getMe = handleAsyncRequest(async (req, res) => {
  const result = await UserServices.getMeFromDB(req.user);

  // sending response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'your info is retrieved successfully',
    data: result,
  });
});

const changeStatus = handleAsyncRequest(async (req, res) => {
  const { id } = req.params;

  const result = await UserServices.changeStatusIntoDB(id, req.body);

  // sending response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User status is updated successfully',
    data: result,
  });
});

export const UserControllers = {
  createStudent,
  createFaculty,
  createAdmin,
  getMe,
  changeStatus,
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
