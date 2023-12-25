/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import mongoose from 'mongoose';
import QueryBuilder from '../../queryBuilder/QueryBuilder';
import { courseSearchableField } from './course.constant';
import { TCourse, TAssignFacultiesToCourse } from './course.interface';
import { Course, CourseFaculties } from './course.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createCourseIntoDB = async (payload: TCourse) => {
  const result = await Course.create(payload);

  return result;
};

const getAllCourseFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder<TCourse>(
    Course.find().populate('preRequisiteCourses.course'),
    query,
  )
    .search(courseSearchableField)
    .filter()
    .sort()
    .paginate()
    .fieldsLimit();

  const result = await courseQuery.modelQuery;
  const meta = await courseQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getSingleCourseFromDB = async (id: string) => {
  const result = await Course.findById(id).populate(
    'preRequisiteCourses.course',
  );

  return result;
};

const updateSingleCourseIntoDB = async (
  id: string,
  payload: Partial<TCourse>,
) => {
  const { preRequisiteCourses, ...courseRemainingData } = payload;
  let result;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // check if there is any prerequisite courses to update
    if (preRequisiteCourses && preRequisiteCourses.length) {
      //filter out the deleted fields
      const deletedPreRequisiteCoursesId = preRequisiteCourses
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course);

      if (deletedPreRequisiteCoursesId.length) {
        const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(
          id,
          {
            $pull: {
              preRequisiteCourses: {
                course: { $in: deletedPreRequisiteCoursesId },
              },
            },
          },
          {
            new: true,
            runValidators: true,
            session,
          },
        );

        if (!deletedPreRequisiteCourses) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            'Failed to delete pre requisite',
          );
        }
        result = deletedPreRequisiteCourses;
      }

      // filter out the additional pre requisite course
      const additionalPreRequisiteCourses = preRequisiteCourses.filter(
        (el) => el.course && !el.isDeleted,
      );

      if (additionalPreRequisiteCourses.length) {
        const newPreRequisiteCourses = await Course.findByIdAndUpdate(
          id,
          {
            $addToSet: {
              preRequisiteCourses: {
                $each: additionalPreRequisiteCourses,
              },
            },
          },
          {
            new: true,
            runValidators: true,
            session,
          },
        );

        if (!newPreRequisiteCourses) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            'Failed to add pre requisite',
          );
        }

        result = newPreRequisiteCourses;
      }
    }

    // step: update basic course info (primitive)
    if (Object.keys(courseRemainingData).length) {
      const updatedBasicCourseInfoData = await Course.findByIdAndUpdate(
        id,
        courseRemainingData,
        { new: true, runValidators: true, session },
      );

      if (!updatedBasicCourseInfoData) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Failed to update course data',
        );
      }

      result = updatedBasicCourseInfoData;
    }

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, err.message);
  }
};

const deleteSingleCourseFromDB = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  return result;
};

const assignFacultiesToCourseIntoDB = async (
  id: string,
  payload: Partial<TAssignFacultiesToCourse>,
) => {
  const result = await CourseFaculties.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: { faculties: { $each: payload } },
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
    },
  );

  return result;
};

const removeFacultiesFromCourseFromDB = async (
  id: string,
  payload: Partial<TAssignFacultiesToCourse>,
) => {
  const result = await CourseFaculties.findByIdAndUpdate(
    id,
    {
      $pull: { faculties: { $in: payload } },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return result;
};

export const CourseServices = {
  createCourseIntoDB,
  getAllCourseFromDB,
  getSingleCourseFromDB,
  updateSingleCourseIntoDB,
  deleteSingleCourseFromDB,
  assignFacultiesToCourseIntoDB,
  removeFacultiesFromCourseFromDB,
};
