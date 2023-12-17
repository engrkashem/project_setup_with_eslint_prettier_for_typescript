import { NextFunction, Request, Response } from 'express';
import handleAsyncRequest from '../utils/handleAsyncRequest';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

const auth = (...requiredRoles: TUserRole[]) => {
  return handleAsyncRequest(
    async (req: Request, res: Response, next: NextFunction) => {
      const token = req.headers.authorization;

      // check if client has token
      if (!token) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          'You are not authorized. please login.',
        );
      }

      // check if the token is valid
      const decodedUser = jwt.verify(
        token,
        config.jwtAccessSecret as string,
      ) as JwtPayload;

      const { userId, role, iat } = decodedUser;

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
        User.isJWTIssuedBeforePasswordChange(
          user?.passwordChangedAt,
          iat as number,
        )
      ) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          'Login session time out. Please login again',
        );
      }

      // check if the user is authorized for this task/operation
      if (requiredRoles && !requiredRoles.includes(role)) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Authorization error.');
      }

      // add decoded data to global req.user
      req.user = decodedUser as JwtPayload;

      next();
    },
  );
};

export default auth;
