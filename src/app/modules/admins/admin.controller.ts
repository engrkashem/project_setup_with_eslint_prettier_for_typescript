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
    meta: result.meta,
    data: result.result,
  });
});

const getSingleAdmin = handleAsyncRequest(async (req, res) => {
  const { id } = req.params;

  const result = await adminServices.getSingleAdminFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Requested Admin retrieved successfully',
    data: result,
  });
});

const updateSingleAdmin = handleAsyncRequest(async (req, res) => {
  const { id } = req.params;
  const { admin } = req.body;

  const result = await adminServices.updateSingleAdminFromDB(id, admin);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Requested Admin updated successfully',
    data: result,
  });
});

const deleteAdmin = handleAsyncRequest(async (req, res) => {
  const { id } = req.params;

  const result = await adminServices.deleteAdminFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Requested Admin deleted successfully',
    data: result,
  });
});

export const adminControllers = {
  getAllAdmins,
  getSingleAdmin,
  updateSingleAdmin,
  deleteAdmin,
};
