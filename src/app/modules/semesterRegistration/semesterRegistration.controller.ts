import httpStatus from 'http-status';
import handleAsyncRequest from '../../utils/handleAsyncRequest';
import sendResponse from '../../utils/sendResponse';
import { SemesterRegistrationServices } from './semesterRegistration.service';

const createSemesterRegistration = handleAsyncRequest(async (req, res) => {
  const result =
    await SemesterRegistrationServices.createSemesterRegistrationIntoDB(
      req.body,
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Semester registration is created successfully',
    data: result,
  });
});

const getSingleSemesterRegistration = handleAsyncRequest(async (req, res) => {
  const { id } = req.params;

  const result =
    await SemesterRegistrationServices.getSingleSemesterRegistrationFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Semester registration is retrieved successfully',
    data: result,
  });
});

const updateSemesterRegistration = handleAsyncRequest(async (req, res) => {
  const { id } = req.params;

  const result =
    await SemesterRegistrationServices.updateSemesterRegistrationFromDB(
      id,
      req.body,
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Semester registration is updated successfully',
    data: result,
  });
});

const getAllSemesterRegistration = handleAsyncRequest(async (req, res) => {
  const result =
    await SemesterRegistrationServices.getAllSemesterRegistrationFromDB(
      req.query,
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Semester registration data are retrieved successfully',
    data: result,
  });
});

const deleteSingleSemesterRegistration = handleAsyncRequest(
  async (req, res) => {
    const { id } = req.params;

    const result =
      await SemesterRegistrationServices.deleteSingleSemesterRegistrationFromDB(
        id,
      );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Semester registration is deleted successfully',
      data: result,
    });
  },
);

export const SemesterRegistrationControllers = {
  createSemesterRegistration,
  getSingleSemesterRegistration,
  updateSemesterRegistration,
  getAllSemesterRegistration,
  deleteSingleSemesterRegistration,
};
