import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { TOfferedCourse } from './offeredCourse.interface';
import { OfferedCourse } from './offeredCourse.model';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Course } from '../courses/course.model';
import { Faculty } from '../faculties/faculty.model';
import { hasTimeConflict } from './offeredCourse.utils';
import QueryBuilder from '../../queryBuilder/QueryBuilder';
import { Student } from '../students/student.model';

const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
  const offeredCourseQuery = new QueryBuilder(OfferedCourse.find(), query)
    .filter()
    .sort()
    .paginate()
    .fieldsLimit();

  const result = await offeredCourseQuery.modelQuery;
  const meta = await offeredCourseQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getMyOfferedCoursesFromDB = async (userId: string) => {
  // check if user exists
  const student = await Student.findOne({ id: userId });

  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student is not found.');
  }

  // find current ongoing semester that available now
  const currentOngoingRegistrationSemester = await SemesterRegistration.findOne(
    {
      status: 'ONGOING',
    },
  );

  if (!currentOngoingRegistrationSemester) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Any ONGOING/Running Semester to register is not Found',
    );
  }

  const result = await OfferedCourse.aggregate([
    {
      $match: {
        semesterRegistration: currentOngoingRegistrationSemester?._id,
        academicDepartment: student.academicDepartment,
        academicFaculty: student.academicFaculty,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'course',
      },
    },
    {
      $unwind: '$course',
    },
    {
      $lookup: {
        from: 'enrolledcourses',
        let: {
          currentOngoingRegistrationSemester:
            currentOngoingRegistrationSemester._id,
          currentStudent: student._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      '$semesterRegistration',
                      '$$currentOngoingRegistrationSemester',
                    ],
                  },
                  {
                    $eq: ['$student', '$$currentStudent'],
                  },
                  {
                    $eq: ['$isEnrolled', true],
                  },
                ],
              },
            },
          },
        ],
        as: 'enrolledCourses',
      },
    },
    {
      $addFields: {
        isAlreadyEnrolled: {
          $in: [
            '$course._id',
            {
              $map: {
                input: '$enrolledCourses',
                as: 'enrolledCourse',
                in: '$$enrolledCourse.course',
              },
            },
          ],
        },
      },
    },
    {
      $match: { isAlreadyEnrolled: false },
    },
  ]);

  return result;
};

const getSingleOfferedCourseFromDB = async (id: string) => {
  const result = await OfferedCourse.findById(id).populate([
    'semesterRegistration',
    'academicSemester',
    'academicFaculty',
    'academicDepartment',
    'course',
    'faculty',
  ]);

  return result;
};

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  // extract semester registration id from user requested data (payload)
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    section,
    days,
    startTime,
    endTime,
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

  // check the requested faculty is correct/exists
  const isFacultyExists = await Faculty.findById(faculty);
  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'faculty not found');
  }

  // check the requested academicDepartment is correct/exists
  const isAcademicDepartmentExists =
    await AcademicDepartment.findById(academicDepartment);
  if (!isAcademicDepartmentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'academicDepartment not found');
  }

  // check if  department belongs to requested faculty
  const isDepartmentBelongsFaculty = await AcademicDepartment.findOne({
    _id: academicDepartment,
    academicFaculty,
  });

  if (!isDepartmentBelongsFaculty) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This ${isAcademicDepartmentExists?.name} does belongs to this ${isAcademicFacultyExists.name}`,
    );
  }

  // check if same offered course same section in same registered semester exists
  const isSameOfferedCourseExistsWithSameSectionWithSameRegisteredSemester =
    await OfferedCourse.findOne({
      semesterRegistration,
      course,
      section,
    });

  if (isSameOfferedCourseExistsWithSameSectionWithSameRegisteredSemester) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Offered course with same section is already exists.`,
    );
  }

  // check if same faculty taking different class at the same time
  // get schedules of the faculty
  const assignedSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  const requestedSchedule = { days, startTime, endTime };

  if (hasTimeConflict(assignedSchedules, requestedSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `This faculty is not available between ${requestedSchedule.startTime} and ${requestedSchedule.endTime}. Choose other time or day`,
    );
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

const updateSingleOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {
  const { faculty, days, startTime, endTime } = payload;

  // check if requested offered course exists in db
  const isOfferedCourseExists = await OfferedCourse.findById(id);

  if (!isOfferedCourseExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Requested Offered Course is not found',
    );
  }

  // check if faculty exists in db
  const isFacultyExists = await Faculty.findById(faculty);

  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Requested faculty is not found');
  }

  // validate offered semester status (if it is UPCOMING)
  const { semesterRegistration } = isOfferedCourseExists;
  const semesterRegistrationStatus =
    await SemesterRegistration.findById(semesterRegistration);

  if (semesterRegistrationStatus?.status !== 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can  not update as Offered semester status is ${semesterRegistrationStatus?.status}. Expected UPCOMING`,
    );
  }

  // check time conflict of faculty (if faculty available)
  // find the current schedule of faculty in requested date

  const assignedSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  });

  // prepare new schedule
  const requestedSchedule = { days, startTime, endTime };

  if (hasTimeConflict(assignedSchedules, requestedSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `This faculty is not available between ${startTime} and ${endTime}. Try other time or date.`,
    );
  }

  // send update  request to db
  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteSingleOfferedCourseFromDB = async (id: string) => {
  // check if offered course exists
  const isOfferedCourseExists = await OfferedCourse.findById(id);
  if (!isOfferedCourseExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Requested Offered Course is not found',
    );
  }

  const { semesterRegistration } = isOfferedCourseExists;

  // check semester registration status if UPCOMING
  const semesterRegistrationStatus =
    await SemesterRegistration.findById(semesterRegistration);

  if (semesterRegistrationStatus?.status !== 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can  not delete as Offered semester status is ${semesterRegistrationStatus?.status}. Expected UPCOMING`,
    );
  }

  const result = await OfferedCourse.findByIdAndDelete(id);

  return result;
};

export const OfferedCourseServices = {
  getAllOfferedCoursesFromDB,
  getMyOfferedCoursesFromDB,
  getSingleOfferedCourseFromDB,
  createOfferedCourseIntoDB,
  updateSingleOfferedCourseIntoDB,
  deleteSingleOfferedCourseFromDB,
};
