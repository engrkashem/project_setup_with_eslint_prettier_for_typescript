/* eslint-disable no-unused-vars */
import { Types } from 'mongoose';
import TUserName from '../../interface/userName';
import { Model } from 'mongoose';
import { TGender } from '../../interface/gender';
import { TBloodGroup } from '../../interface/bloodGroup';

export type TFaculty = {
  id: string;
  user: Types.ObjectId;
  designation: string;
  name: TUserName;
  gender: TGender;
  dateOfBirth?: Date;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: TBloodGroup;
  presentAddress: string;
  permanentAddress: string;
  profileImg?: string;
  academicDepartment: Types.ObjectId;
  academicFaculty: Types.ObjectId;
  isDeleted: boolean;
};

export interface FacultyModel extends Model<TFaculty> {
  isFacultyExists(id: string): Promise<TFaculty | null>;
}
