import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { TOfferedCourse } from './offeredCourse.interface';
import { OfferedCourse } from './offeredCourse.model';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Course } from '../courses/course.model';
import { Faculty } from '../faculties/faculty.model';

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  // extract semester registration id from user requested data (payload)
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
  } = payload;

  // extract academic semester id from registered semester that fetched from db
  const registeredSemester =
    await SemesterRegistration.findById(semesterRegistration);

  // check the requested semesterRegistration is correct/exists
  if (!registeredSemester) {
    throw new AppError(httpStatus.NOT_FOUND, 'semesterRegistration not found');
  }

  // check the requested academicFaculty is correct/exists
  const isAcademicFacultyExists =
    await AcademicFaculty.findById(academicFaculty);
  if (!isAcademicFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'academicFaculty not found');
  }

  // check the requested course is correct/exists
  const isCourseExists = await Course.findById(course);
  if (!isCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'course not found');
  }

  // check the requested academicDepartment is correct/exists
  const isAcademicDepartmentExists =
    await AcademicDepartment.findById(academicDepartment);
  if (!isAcademicDepartmentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'academicDepartment not found');
  }

  // check the requested faculty is correct/exists
  const isFacultyExists = await Faculty.findById(faculty);
  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'faculty not found');
  }

  // update payload to insert academic semester
  const academicSemester = registeredSemester?.academicSemester;
  const finalOfferedSemesterData = {
    ...payload,
    academicSemester,
  };

  // request query to save offered semester into db
  const result = await OfferedCourse.create(finalOfferedSemesterData);

  return result;
};

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
};
