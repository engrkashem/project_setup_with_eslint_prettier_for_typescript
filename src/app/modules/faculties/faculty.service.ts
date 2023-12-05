/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import QueryBuilder from '../../queryBuilder/QueryBuilder';
import { facultySearchableFields } from './faculty.constant';
import { TFaculty } from './faculty.interface';
import { Faculty } from './faculty.model';
import mongoose from 'mongoose';
import { User } from '../user/user.model';

const getAllFacultiesFromDB = async (query: Record<string, unknown>) => {
  const facultyQuery = new QueryBuilder(
    Faculty.find().populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    }),
    query,
  )
    .search(facultySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fieldsLimit();

  const result = await facultyQuery.modelQuery;

  return result;
};

const getSingleFacultyFromDB = async (facultyId: string) => {
  if (!(await Faculty.isFacultyExists(facultyId))) {
    throw new AppError(httpStatus.NOT_FOUND, 'faculty is not found.');
  }
  const result = await Faculty.findOne({ id: facultyId }).populate({
    path: 'academicDepartment',
    populate: {
      path: 'academicFaculty',
    },
  });
  return result;
};

const updateSingleFacultyFromDB = async (
  facultyId: string,
  payload: Partial<TFaculty>,
) => {
  const { name, ...remaining } = payload;

  if (!(await Faculty.isFacultyExists(facultyId))) {
    throw new AppError(httpStatus.BAD_REQUEST, 'faculty is not found.');
  }

  const modifiedFaculty: Record<string, unknown> = {
    ...remaining,
  };

  if (name && Object.keys(name).length) {
    for (const [key, val] of Object.entries(name)) {
      modifiedFaculty[`name.${key}`] = val;
    }
  }

  const result = await Faculty.findOneAndUpdate(
    { id: facultyId },
    modifiedFaculty,
    {
      new: true,
      runValidators: true,
    },
  );

  return result;
};

const deleteFacultyFromDB = async (facultyId: string) => {
  if (!(await Faculty.isFacultyExists(facultyId))) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty is not found');
  }

  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    const deletedFaculty = await Faculty.findOneAndUpdate(
      { id: facultyId },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedFaculty) {
      throw new AppError(httpStatus.BAD_REQUEST, 'failed to delete faculty');
    }

    const deletedUser = await User.findOneAndUpdate(
      { id: facultyId },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
    }

    await session.commitTransaction();
    await session.endSession();
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, err?.message);
  }
};

export const facultyServices = {
  getAllFacultiesFromDB,
  getSingleFacultyFromDB,
  updateSingleFacultyFromDB,
  deleteFacultyFromDB,
};
