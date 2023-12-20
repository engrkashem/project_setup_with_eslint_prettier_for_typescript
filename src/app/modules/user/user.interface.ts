/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE } from './user.constants';

export type TUser = {
  id: string;
  email: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  role: 'admin' | 'faculty' | 'student';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
};

export interface UserModel extends Model<TUser> {
  isUserExistsByCustomId(id: string): Promise<TUser | null>;
  isPasswordMatched(password: string, hashedPassword: string): Promise<boolean>;
  isUserDeleted(user: TUser): boolean;
  isUserBlocked(user: TUser): boolean;
  isJWTIssuedBeforePasswordChange(
    passwordChangeTimestamp: Date,
    jwtIssueTimestamp: number,
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;

export type TChangePassword = { oldPassword: string; newPassword: string };
