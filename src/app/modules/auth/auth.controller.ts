import httpStatus from 'http-status';
import handleAsyncRequest from '../../utils/handleAsyncRequest';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import config from '../../config';

const loginUser = handleAsyncRequest(async (req, res) => {
  const result = await AuthServices.loginUserIntoDB(req.body);

  const { refreshToken, accessToken, needsPasswordChange } = result;
  // set refresh token to cookie
  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User login is successful',
    data: {
      accessToken,
      needsPasswordChange,
    },
  });
});

const changePassword = handleAsyncRequest(async (req, res) => {
  const result = await AuthServices.changePasswordIntoDB(req.user, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Password is changed successfully',
    data: result,
  });
});

const refreshToken = handleAsyncRequest(async (req, res) => {
  const { refreshToken: refreshToken } = req.cookies;
  const result =
    await AuthServices.createAccessTokenFromRefreshToken(refreshToken);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Access token is retrieved successful',
    data: result,
  });
});

const forgetPassword = handleAsyncRequest(async (req, res) => {
  const { id: userId } = req.body;

  const result = await AuthServices.forgetPasswordDB(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Password reset link is generated successfully',
    data: result,
  });
});

const resetPassword = handleAsyncRequest(async (req, res) => {
  const token = req.headers.authorization;

  const result = await AuthServices.resetPasswordDB(req.body, token as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Password reset is successful',
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
