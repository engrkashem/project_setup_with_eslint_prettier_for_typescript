/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import QueryBuilder from '../../queryBuilder/QueryBuilder';
import mongoose from 'mongoose';
import { User } from '../user/user.model';
import { Admin } from './admin.model';
import { AdminSearchableFields } from './admin.constant';
import { TAdmin } from './admin.interface';

const getAllAdminsFromDB = async (query: Record<string, unknown>) => {
  const adminQuery = new QueryBuilder(Admin.find(), query)
    .search(AdminSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fieldsLimit();

  const result = await adminQuery.modelQuery;

  return result;
};

const getSingleAdminFromDB = async (adminId: string) => {
  if (!(await Admin.isAdminExists(adminId))) {
    throw new AppError(httpStatus.NOT_FOUND, 'faculty is not found.');
  }
  const result = await Admin.findOne({ id: adminId });

  return result;
};

const updateSingleAdminFromDB = async (
  adminId: string,
  payload: Partial<TAdmin>,
) => {
  const { name, ...remaining } = payload;

  if (!(await Admin.isAdminExists(adminId))) {
    throw new AppError(httpStatus.BAD_REQUEST, 'faculty is not found.');
  }

  const modifiedAdmin: Record<string, unknown> = {
    ...remaining,
  };

  if (name && Object.keys(name).length) {
    for (const [key, val] of Object.entries(name)) {
      modifiedAdmin[`name.${key}`] = val;
    }
  }

  const result = await Admin.findOneAndUpdate({ id: adminId }, modifiedAdmin, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteAdminFromDB = async (adminId: string) => {
  if (!(await Admin.isAdminExists(adminId))) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty is not found');
  }

  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    const deletedAdmin = await Admin.findOneAndUpdate(
      { id: adminId },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedAdmin) {
      throw new AppError(httpStatus.BAD_REQUEST, 'failed to delete faculty');
    }

    const deletedUser = await User.findOneAndUpdate(
      { id: adminId },
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

export const adminServices = {
  getAllAdminsFromDB,
  getSingleAdminFromDB,
  updateSingleAdminFromDB,
  deleteAdminFromDB,
};
