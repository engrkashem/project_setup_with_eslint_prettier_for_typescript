import httpStatus from 'http-status';
import handleAsyncRequest from '../../utils/handleAsyncRequest';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';

const loginUser = handleAsyncRequest(async (req, res) => {
  const result = await AuthServices.loginUserIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User login is successful',
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
};
