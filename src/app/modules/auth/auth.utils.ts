import jwt from 'jsonwebtoken';
import { TJwtPayload } from './auth.interface';

export const createToken = (
  jwtPayload: TJwtPayload,
  jwtSecret: string,
  expiresIn: string,
) =>
  jwt.sign(jwtPayload, jwtSecret, {
    expiresIn,
  });
