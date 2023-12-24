import jwt, { JwtPayload } from 'jsonwebtoken';
import { TJwtPayload } from './auth.interface';

export const createToken = (
  jwtPayload: TJwtPayload,
  jwtSecret: string,
  expiresIn: string,
) =>
  jwt.sign(jwtPayload, jwtSecret, {
    expiresIn,
  });

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
