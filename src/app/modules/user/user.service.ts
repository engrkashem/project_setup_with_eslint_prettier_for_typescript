/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import config from '../../config';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../students/student.interface';
import { Student } from '../students/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utils';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { TFaculty } from '../faculties/faculty.interface';
import { Faculty } from '../faculties/faculty.model';
import { Admin } from '../admins/admin.model';
import { TAdmin } from '../admins/admin.interface';

import { USER_ROLE } from './user.constants';
import { JwtPayload } from 'jsonwebtoken';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';

const addStudentToDB = async (
  image: any,
  password: string,
  payload: TStudent,
) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // if password is not given, use default password
  userData.password = password || (config.defaultPass as string);

  // set student role
  userData.role = 'student';

  // set email to user
  userData.email = payload.email;

  // find academic semester information
  const admittedSemester = await AcademicSemester.findById(
    payload.admittedSemester,
  );

  if (!admittedSemester) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Academic Semester is not found',
    );
  }

  // find academic department information
  const admittedDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );

  if (!admittedDepartment) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Academic Department is not found',
    );
  }

  // if academic department found, then add academic faculty into payload from academic department information
  payload.academicFaculty = admittedDepartment.academicFaculty;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // set manually generated id
    userData.id = await generateStudentId(
      admittedSemester as TAcademicSemester,
    );

    // create a user (Transaction-1)
    const newUser = await User.create([userData], { session }); // for transaction array

    // create a student
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    // set id and _id as user
    payload.id = newUser[0].id; // embedded id
    payload.user = newUser[0]._id; // reference id

    if (image) {
      // send image to cloudinary
      const imageName = `${userData?.id}${payload?.name?.lastName}`;
      const path = image?.path;

      const { secure_url } = await sendImageToCloudinary(imageName, path);

      // update profile image in payload
      payload.profileImg = secure_url as string;
    }

    // create a student (Transaction-2)
    const newStudent = await Student.create([payload], { session });

    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student');
    }

    await session.commitTransaction();
    await session.endSession();

    return newStudent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student.');
  }
};

const addFacultyIntoDB = async (
  image: any,
  password: string,
  payload: TFaculty,
) => {
  const userData: Partial<TUser> = {};

  //set password to faculty user data
  userData.password = password || config.defaultPass;

  userData.role = 'faculty';

  userData.email = payload.email;

  // check if academic department is valid
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );

  if (!academicDepartment) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Academic Department is not found',
    );
  }

  // insert academic faculty info into payload
  payload.academicFaculty = academicDepartment.academicFaculty;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // generate faculty id manually
    userData.id = await generateFacultyId();

    // generate user Transaction-1
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create User');
    }

    if (image) {
      // send image to cloudinary
      const imageName = `${userData?.id}${payload?.name?.lastName}`;
      const path = image?.path;
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      payload.profileImg = secure_url as string;
    }

    //create faculty
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    const newFaculty = await Faculty.create([payload], { session });

    if (!newFaculty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Faculty');
    }

    // if success save user and faculty simultaneously; else abort both
    await session.commitTransaction();
    await session.endSession();
    return newFaculty;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, err?.message);
  }
};

const addAdminIntoDB = async (
  image: any,
  password: string,
  payload: TAdmin,
) => {
  const userData: Partial<TUser> = {};

  //set password to faculty user data
  userData.password = password || config.defaultPass;

  userData.role = 'admin';

  userData.email = payload.email;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // generate faculty id manually
    userData.id = await generateAdminId();

    // generate user Transaction-1
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create User');
    }

    if (image) {
      // send image to cloudinary
      const imageName = `${userData?.id}${payload?.name?.lastName}`;
      const path = image?.path;

      const { secure_url } = await sendImageToCloudinary(imageName, path);
      payload.profileImg = secure_url as string;
    }

    //create faculty
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Admin');
    }

    // if success save user and faculty simultaneously; else abort both
    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, err?.message);
  }
};

const getMeFromDB = async (user: JwtPayload) => {
  const { userId, role } = user;

  let result = null;

  if (role === USER_ROLE.student) {
    result = await Student.findOne({ id: userId });
  } else if (role === USER_ROLE.faculty) {
    result = await Faculty.findOne({ id: userId });
  } else if (role === USER_ROLE.admin) {
    result = await Admin.findOne({ id: userId });
  }

  return result;
};

const changeStatusIntoDB = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(
    id,
    { status: payload?.status },
    { new: true, runValidators: true },
  );

  return result;
};

export const UserServices = {
  addStudentToDB,
  addFacultyIntoDB,
  addAdminIntoDB,
  getMeFromDB,
  changeStatusIntoDB,
};

/*
    // built-in static method (mongoose) to create student to db
    const result = await Student.create(studentData);
    */

// custom static method to check if student already exists
// if (await Student.isStudentExists(studentData.id)) {
//   throw new Error('Student Already Exists. ');
// }

/*
    // instance method to create student in student DB
    const student = new Student(studentData); //create an instance
    if (await student.isStudentExists(studentData.id)) {
      throw new Error('User Already exists');
    }
    const result = await student.save(); //built-in instance method
    */
