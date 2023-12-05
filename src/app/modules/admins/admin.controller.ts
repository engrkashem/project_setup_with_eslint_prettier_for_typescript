import httpStatus from 'http-status';
import handleAsyncRequest from '../../utils/handleAsyncRequest';
import sendResponse from '../../utils/sendResponse';
import { adminServices } from './admin.service';

const getAllAdmins = handleAsyncRequest(async (req, res) => {
  const result = await adminServices.getAllAdminsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admins retrieved successfully',
    data: result,
  });
});

const getSingleAdmin = handleAsyncRequest(async (req, res) => {
  const { adminId } = req.params;

  const result = await adminServices.getSingleAdminFromDB(adminId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Requested Admin retrieved successfully',
    data: result,
  });
});

const updateSingleAdmin = handleAsyncRequest(async (req, res) => {
  const { adminId } = req.params;
  const { faculty } = req.body;

  const result = await adminServices.updateSingleAdminFromDB(adminId, faculty);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Requested Admin updated successfully',
    data: result,
  });
});

const deleteAdmin = handleAsyncRequest(async (req, res) => {
  const { adminId } = req.params;

  const result = await adminServices.deleteAdminFromDB(adminId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Requested Admin updated successfully',
    data: result,
  });
});

export const adminControllers = {
  getAllAdmins,
  getSingleAdmin,
  updateSingleAdmin,
  deleteAdmin,
};
