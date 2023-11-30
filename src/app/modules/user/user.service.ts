import config from '../../config';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../students/student.interface';
import { Student } from '../students/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';

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

  // set manually generated id
  userData.id = await generateStudentId(admittedSemester as TAcademicSemester);

  // create a user
  const newUser = await User.create(userData);

  // create a student
  if (Object.keys(newUser).length) {
    // set id and _id as user
    payload.id = newUser.id; // embedded id
    payload.user = newUser._id; // reference id

    const newStudent = await Student.create(payload);

    return newStudent;
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
