import mongoose from 'mongoose';
import config from '../../config';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../students/student.interface';
import { Student } from '../students/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const addStudentToDB = async (password: string, payload: TStudent) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // if password is not given, use default password
  userData.password = password || (config.defaultPass as string);

  // set student role
  userData.role = 'student';

  // find academic semester information
  const admittedSemester = await AcademicSemester.findById(
    payload.admittedSemester,
  );

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

export const UserServices = {
  addStudentToDB,
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
