import { Model } from 'mongoose';

export interface TUserName {
  firstName: string;
  middleName?: string;
  lastName: string;
}

export type TGuardian = {
  fatherName: string;
  fatherOccupation: string;
  fatherContactNo: string;
  motherName: string;
  motherOccupation: string;
  motherContactNo: string;
};

export type TLocalGuardian = {
  name: string;
  occupation: string;
  contactNo: string;
  relationShipWithStudent?: string;
  address?: string;
};

export type TStudent = {
  id: string;
  password: string;
  name: TUserName;
  gender: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  presentAddress: string;
  permanentAddress: string;
  guardian: TGuardian;
  localGuardian: TLocalGuardian;
  profileImg?: string;
  isActive: 'active' | 'blocked';
};

// create a custom static method
export interface StudentModel extends Model<TStudent> {
  // eslint-disable-next-line no-unused-vars
  isStudentExists(id: string): Promise<TStudent | null>;
}

/*
// custom made instance method
export type StudentMethods = {
  isStudentExists(id: string): Promise<TStudent | null>;

  export type StudentModel = Model<
  TStudent,
  Record<string, never>,
  StudentMethods
>;
};
*/
