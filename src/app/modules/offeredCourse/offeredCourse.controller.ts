import httpStatus from 'http-status';
import handleAsyncRequest from '../../utils/handleAsyncRequest';
import sendResponse from '../../utils/sendResponse';
import { OfferedCourseServices } from './offeredCourse.service';

const createOfferedCourse = handleAsyncRequest(async (req, res) => {
  const result = await OfferedCourseServices.createOfferedCourseIntoDB(
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Offered course is created successfully',
    data: result,
  });
});

const updateSingleOfferedCourse = handleAsyncRequest(async (req, res) => {
  const { id } = req.params;

  const result = await OfferedCourseServices.updateSingleOfferedCourseIntoDB(
    id,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Offered course updated successfully.',
    data: result,
  });
});

const getSingleOfferedCourse = handleAsyncRequest(async (req, res) => {
  const { id } = req.params;

  const result = await OfferedCourseServices.getSingleOfferedCourseFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Offered course is retrieved successfully.',
    data: result,
  });
});

const getAllOfferedCourse = handleAsyncRequest(async (req, res) => {
  const result = await OfferedCourseServices.getAllOfferedCoursesFromDB(
    req.query,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Offered courses are retrieved successfully.',
    data: result,
  });
});

const deleteSingleOfferedCourse = handleAsyncRequest(async (req, res) => {
  const { id } = req.params;

  const result =
    await OfferedCourseServices.deleteSingleOfferedCourseFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Offered course is deleted successfully.',
    data: result,
  });
});

export const OfferedCourseControllers = {
  createOfferedCourse,
  updateSingleOfferedCourse,
  getSingleOfferedCourse,
  getAllOfferedCourse,
  deleteSingleOfferedCourse,
};
