import { Types } from 'mongoose';
import TUserName from '../../interface/userName';
import { Model } from 'mongoose';
import { TGender } from '../../interface/gender';
import { TBloodGroup } from '../../interface/bloodGroup';

export type TAdmin = {
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
  isDeleted: boolean;
};

export interface AdminModel extends Model<TAdmin> {
  // eslint-disable-next-line no-unused-vars
  isAdminExists(id: string): Promise<TAdmin | null>;
}
