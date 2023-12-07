import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { CourseServices } from './course.service';
import handleAsyncRequest from '../../utils/handleAsyncRequest';

const createCourse = handleAsyncRequest(async (req, res) => {
  const { course: courseData } = req.body;

  const result = await CourseServices.createCourseIntoDB(courseData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is created successfully',
    data: result,
  });
});
const getAllCourse = handleAsyncRequest(async (req, res) => {
  const result = await CourseServices.getAllCourseFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Course retrieved successfully',
    data: result,
  });
});

const getSingleCourse = handleAsyncRequest(async (req, res) => {
  const { id } = req.params;

  const result = await CourseServices.getSingleCourseFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course retrieved successfully',
    data: result,
  });
});

const updateSingleCourse = handleAsyncRequest(async (req, res) => {
  const { id } = req.params;

  // const { course } = req.body;

  const result = await CourseServices.updateSingleCourseIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is updated successfully',
    data: result,
  });
});

const deleteSingleCourse = handleAsyncRequest(async (req, res) => {
  const { id } = req.params;

  const result = await CourseServices.deleteSingleCourseFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is deleted successfully',
    data: result,
  });
});

export const CourseControllers = {
  createCourse,
  getAllCourse,
  getSingleCourse,
  updateSingleCourse,
  deleteSingleCourse,
};
