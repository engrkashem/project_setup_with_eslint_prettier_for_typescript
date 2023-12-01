import httpStatus from 'http-status';
import handleAsyncRequest from '../../utils/handleAsyncRequest';
import sendResponse from '../../utils/sendResponse';
import { AcademicFacultyServices } from './academicFaculty.service';

const createAcademicFaculty = handleAsyncRequest(async (req, res) => {
  const result = await AcademicFacultyServices.createAcademicFacultyIntoDB(
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Academic faculty is created successfully.',
    data: result,
  });
});

const getAllAcademicFaculties = handleAsyncRequest(async (req, res) => {
  const result = await AcademicFacultyServices.getAllAcademicFacultiesFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Faculties data retrieved successfully',
    data: result,
  });
});

const getSingleAcademicFaculty = handleAsyncRequest(async (req, res) => {
  const result = await AcademicFacultyServices.getSingleAcademicFacultyFromDB(
    req.params.facultyId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculty data is retrieved successfully',
    data: result,
  });
});

const updateSingleAcademicFaculty = handleAsyncRequest(async (req, res) => {
  const result =
    await AcademicFacultyServices.updateSingleAcademicFacultyIntoDB(
      req.params.facultyId,
      req.body,
    );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculty data updated successfully',
    data: result,
  });
});

export const AcademicFacultyControllers = {
  createAcademicFaculty,
  getAllAcademicFaculties,
  getSingleAcademicFaculty,
  updateSingleAcademicFaculty,
};
