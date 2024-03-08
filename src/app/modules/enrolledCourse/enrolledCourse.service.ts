import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import { EnrolledCourse } from './enrolledCourse.model';
import { Student } from '../students/student.model';
import mongoose from 'mongoose';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { Course } from '../courses/course.model';
import { Faculty } from '../faculties/faculty.model';
import { calculateGradeAndPoints } from './enrolledCourse.utils';
import QueryBuilder from '../../queryBuilder/QueryBuilder';

const createEnrolledCourseIntoDB = async (
  userId: string,
  payload: Partial<TEnrolledCourse>,
) => {
  // check if the offered course exists
  const { offeredCourse } = payload;
  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);

  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered course is not found');
  }

  if (isOfferedCourseExists?.maxCapacity <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Offered course capacity is full for this semester',
    );
  }

  // check if the student already enrolled
  const student = await Student.findOne({ id: userId }, { _id: 1 });
  const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
    semesterRegistration: isOfferedCourseExists?.semesterRegistration,
    offeredCourse,
    student: student?._id,
    isEnrolled: true,
  });

  if (isStudentAlreadyEnrolled) {
    throw new AppError(
      httpStatus.CONFLICT,
      ' student already enrolled to this course',
    );
  }

  // check total credit if it exceeds max credit
  const semesterRegistration = await SemesterRegistration.findById(
    isOfferedCourseExists?.semesterRegistration,
  ).select('maxCredit');

  // check if the max credit limit exceed by a student on a semester
  const enrolledCourses = await EnrolledCourse.aggregate([
    {
      $match: {
        semesterRegistration: isOfferedCourseExists?.semesterRegistration,
        student: student?._id,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'enrolledCoursesData',
      },
    },
    {
      $unwind: '$enrolledCoursesData',
    },
    {
      $group: {
        _id: null,
        totalEnrolledCredits: { $sum: '$enrolledCoursesData.credits' },
      },
    },
    {
      $project: { _id: 0, totalEnrolledCredits: 1 },
    },
  ]);

  const totalEnrolledCredits = enrolledCourses.length
    ? enrolledCourses[0].totalEnrolledCredits
    : 0;

  const newCredit = await Course.findById(isOfferedCourseExists?.course).select(
    'credits',
  );

  // check if  total enrolled credit + new enrolled course credit > maxCredit
  if (
    semesterRegistration &&
    totalEnrolledCredits + newCredit?.credits > semesterRegistration?.maxCredit
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You have taken max credit already for this semester',
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // create an enrolled course
    const result = await EnrolledCourse.create(
      [
        {
          semesterRegistration: isOfferedCourseExists?.semesterRegistration,
          academicSemester: isOfferedCourseExists?.academicSemester,
          academicDepartment: isOfferedCourseExists?.academicDepartment,
          academicFaculty: isOfferedCourseExists?.academicFaculty,
          offeredCourse,
          course: isOfferedCourseExists?.course,
          student: student?._id,
          faculty: isOfferedCourseExists?.faculty,
          isEnrolled: true,
        },
      ],
      { session },
    );

    // updating max capacity of offered course
    const maxCapacity = isOfferedCourseExists?.maxCapacity;
    await OfferedCourse.findByIdAndUpdate(
      offeredCourse,
      {
        maxCapacity: maxCapacity - 1,
      },
      { session },
    );

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();

    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to enroll the course');
  }
};

const updateEnrolledCourseMarksIntoDB = async (
  facultyId: string,
  payload: Partial<TEnrolledCourse>,
) => {
  const { semesterRegistration, offeredCourse, student, courseMarks } = payload;

  // check if offered course is exists
  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);

  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course is not found');
  }

  // check if student is exists
  const isStudentExists = await Student.findById(student);

  if (!isStudentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student is not found');
  }

  // check if semester registration is exists
  const isSemesterRegistrationExists =
    await SemesterRegistration.findById(semesterRegistration);

  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Semester registration is not found',
    );
  }

  // check if the faculty is valid
  const faculty = await Faculty.findOne({ id: facultyId }, { _id: 1 });

  if (!faculty) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty is not found');
  }

  // check if the course is conducted by this faculty
  const isCourseBelongToFaculty = await EnrolledCourse.findOne({
    semesterRegistration,
    offeredCourse,
    student,
    faculty: faculty?._id,
  });

  if (!isCourseBelongToFaculty) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'This faculty is not authorized to update marks',
    );
  }

  const modifiedData: Record<string, unknown> = {};

  if (courseMarks?.finalTerm) {
    const { classTest1, midTerm, classTest2 } =
      isCourseBelongToFaculty.courseMarks;
    const totalMarks =
      classTest1 + midTerm + classTest2 + courseMarks.finalTerm;
    const { grade, points } = calculateGradeAndPoints(totalMarks);
    modifiedData['grade'] = grade;
    modifiedData['gradePoints'] = points;
    modifiedData['isCompleted'] = true;
  }

  // dynamically update marks
  if (courseMarks && Object.keys(courseMarks).length) {
    for (const [key, val] of Object.entries(courseMarks)) {
      modifiedData[`courseMarks.${key}`] = val;
    }
  }

  const result = await EnrolledCourse.findByIdAndUpdate(
    isCourseBelongToFaculty._id,
    modifiedData,
    { new: true, runValidators: true },
  );

  return result;
};

const getMyEnrolledCoursesFromDB = async (
  studentId: string,
  query: Record<string, unknown>,
) => {
  const student = await Student.findOne({ id: studentId });

  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student is not found');
  }

  const myEnrolledCoursesQuery = new QueryBuilder<TEnrolledCourse>(
    EnrolledCourse.find({ student: student._id }).populate(
      'semesterRegistration academicSemester academicDepartment academicFaculty offeredCourse course student faculty',
    ),
    query,
  );

  const result = await myEnrolledCoursesQuery.modelQuery;
  const meta = await myEnrolledCoursesQuery.countTotal();

  return {
    meta,
    result,
  };
};

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
  updateEnrolledCourseMarksIntoDB,
  getMyEnrolledCoursesFromDB,
};
