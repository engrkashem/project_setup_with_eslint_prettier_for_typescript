import { studentServices } from './student.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import handleAsyncRequest from '../../utils/handleAsyncRequest';

const getAllStudents = handleAsyncRequest(async (req, res) => {
  const result = await studentServices.getAllStudentsFromDB();

  // sending response
  sendResponse(res, {
    success: true,
    message: 'Student retrieve request is success',
    data: result,
    statusCode: httpStatus.OK,
  });
});

const getSingleStudent = handleAsyncRequest(async (req, res) => {
  const { studentId } = req.params;
  const result = await studentServices.getStudentByIdFromDB(studentId);

  sendResponse(res, {
    success: true,
    message: 'Student retrieve request is success',
    data: result,
    statusCode: httpStatus.OK,
  });
});

const updateSingleStudent = handleAsyncRequest(async (req, res) => {
  const { studentId } = req.params;
  const { student } = req.body;

  const result = await studentServices.updateSingleStudentIntoDB(
    studentId,
    student,
  );

  sendResponse(res, {
    success: true,
    message: 'Student is updated successfully',
    data: result,
    statusCode: httpStatus.OK,
  });
});

const deleteStudent = handleAsyncRequest(async (req, res) => {
  const { studentId } = req.params;
  const result = await studentServices.deleteStudentFromDB(studentId);

  sendResponse(res, {
    success: true,
    message: 'Student is deleted successfully',
    data: result,
    statusCode: httpStatus.OK,
  });
});

export const studentControllers = {
  getAllStudents,
  getSingleStudent,
  updateSingleStudent,
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
