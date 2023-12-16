import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';

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

  return payload;
};

export const AuthServices = {
  loginUserIntoDB,
};
