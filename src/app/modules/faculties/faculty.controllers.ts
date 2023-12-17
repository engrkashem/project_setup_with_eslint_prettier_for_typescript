import httpStatus from 'http-status';
import handleAsyncRequest from '../../utils/handleAsyncRequest';
import sendResponse from '../../utils/sendResponse';
import { facultyServices } from './faculty.service';

const getAllFaculties = handleAsyncRequest(async (req, res) => {
  console.log(req.cookies);
  const result = await facultyServices.getAllFacultiesFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculties retrieved successfully',
    data: result,
  });
});

const getSingleFaculty = handleAsyncRequest(async (req, res) => {
  const { id } = req.params;

  const result = await facultyServices.getSingleFacultyFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Requested Faculty retrieved successfully',
    data: result,
  });
});

const updateSingleFaculty = handleAsyncRequest(async (req, res) => {
  const { id } = req.params;
  const { faculty } = req.body;

  const result = await facultyServices.updateSingleFacultyFromDB(id, faculty);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Requested Faculty updated successfully',
    data: result,
  });
});

const deleteFaculty = handleAsyncRequest(async (req, res) => {
  const { id } = req.params;

  const result = await facultyServices.deleteFacultyFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Requested Faculty deleted successfully',
    data: result,
  });
});

export const facultyControllers = {
  getAllFaculties,
  getSingleFaculty,
  updateSingleFaculty,
  deleteFaculty,
};
