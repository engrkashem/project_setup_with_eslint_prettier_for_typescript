import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import config from '../../config';
import { TChangePassword } from '../user/user.interface';
import bcrypt from 'bcrypt';
import { createToken } from './auth.utils';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { sendEmail } from '../../utils/sendEmail';

const loginUserIntoDB = async (payload: TLoginUser) => {
  const { id, password } = payload;

  // check if user exists in in User collection into db
  const user = await User.isUserExistsByCustomId(id);

  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'User not found. Please register first.',
    );
  }

  // check if user is already deleted?
  if (User.isUserDeleted(user)) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted.');
  }

  // check if user is blocked?
  if (User.isUserBlocked(user)) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'This user is blocked for this site.',
    );
  }

  // check if password matched with saved password in db
  if (!(await User.isPasswordMatched(password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'You have entered wrong password');
  }

  // user is authenticated: now send a accessToken and refreshToken

  // generate access Token
  const jwtPayload = {
    userId: user?.id,
    role: user?.role,
  };
  const accessSecret = config.jwtAccessSecret as string;
  const accessTokenExpiresIn = config.jwtAccessExpiresIn as string;
  const accessToken = createToken(
    jwtPayload,
    accessSecret,
    accessTokenExpiresIn,
  );

  const refreshSecret = config.jwtRefreshSecret as string;
  const refreshTokenExpiresIn = config.jwtRefreshExpiresIn as string;
  const refreshToken = createToken(
    jwtPayload,
    refreshSecret,
    refreshTokenExpiresIn,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

const changePasswordIntoDB = async (
  decodedUser: JwtPayload,
  payload: TChangePassword,
) => {
  // check if user exists and retrieve hashed password
  const user = await User.isUserExistsByCustomId(decodedUser?.userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found');
  }

  // check if user is already deleted?
  if (User.isUserDeleted(user)) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted.');
  }

  // check if user is blocked?
  if (User.isUserBlocked(user)) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'This user is blocked for this site.',
    );
  }

  // check if old password and hashed password matched
  if (!(await User.isPasswordMatched(payload?.oldPassword, user?.password))) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Incorrect password');
  }

  // first hash new password before changing password
  const hashedNewPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.saltRounds),
  );

  // send request to change password to db
  await User.findOneAndUpdate(
    { id: decodedUser?.userId, role: decodedUser?.role },
    {
      password: hashedNewPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
    { new: true, runValidators: true },
  );

  return null;
};

const createAccessTokenFromRefreshToken = async (token: string) => {
  // check if the token is valid
  const decodedUser = jwt.verify(
    token,
    config.jwtRefreshSecret as string,
  ) as JwtPayload;

  const { userId, iat } = decodedUser;

  const user = await User.isUserExistsByCustomId(userId);

  // check if user exists
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found');
  }

  // check if user is deleted
  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted');
  }

  // check if user is blocked
  if (user?.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked');
  }

  // check if jwt created after password changed
  if (
    user?.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChange(user?.passwordChangedAt, iat as number)
  ) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Login session time out. Please login again',
    );
  }

  // generate access Token
  const jwtPayload = {
    userId: user?.id,
    role: user?.role,
  };
  const accessSecret = config.jwtAccessSecret as string;
  const accessTokenExpiresIn = config.jwtAccessExpiresIn as string;
  const accessToken = createToken(
    jwtPayload,
    accessSecret,
    accessTokenExpiresIn,
  );

  return {
    accessToken,
  };
};

const forgetPasswordDB = async (userId: string) => {
  const user = await User.isUserExistsByCustomId(userId);

  // check if user exists
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found');
  }

  // check if user is deleted
  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted');
  }

  // check if user is blocked
  if (user?.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked');
  }

  // generate access Token
  const jwtPayload = {
    userId: user?.id,
    role: user?.role,
  };
  const accessSecret = config.jwtAccessSecret as string;
  const resetToken = createToken(jwtPayload, accessSecret, '10m');

  const resetUILink = `${config.rootUiURL}?id=${user?.id}&token=${resetToken}`;

  sendEmail(user?.email, resetUILink);

  return null;
};

const resetPasswordDB = async (
  payload: { id: string; newPassword: string },
  token: string,
) => {
  const user = await User.isUserExistsByCustomId(payload?.id);

  // check if user exists
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found');
  }

  // check if user is deleted
  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted');
  }

  // check if user is blocked
  if (user?.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked');
  }

  // check if the token is valid
  const decodedUser = jwt.verify(
    token,
    config.jwtAccessSecret as string,
  ) as JwtPayload;

  // check if user id and token for what student is valid
  if (decodedUser?.userId !== payload?.id) {
    // console.log(decodedUser?.userId, payload?.id);
    throw new AppError(httpStatus.FORBIDDEN, 'Forbidden user request');
  }

  // first hash new password before changing password
  const hashedNewPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.saltRounds),
  );

  // send request to change password to db
  await User.findOneAndUpdate(
    { id: decodedUser?.userId, role: decodedUser?.role },
    {
      password: hashedNewPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
    { new: true, runValidators: true },
  );

  return null;
};

export const AuthServices = {
  loginUserIntoDB,
  changePasswordIntoDB,
  createAccessTokenFromRefreshToken,
  forgetPasswordDB,
  resetPasswordDB,
};

/**
 * to generate random secret code in node terminal:
 * require('crypto').randomBytes(32).toString('hex')
 */
