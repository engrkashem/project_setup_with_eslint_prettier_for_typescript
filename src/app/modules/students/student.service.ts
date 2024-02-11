/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { TStudent } from './student.interface';
import QueryBuilder from '../../queryBuilder/QueryBuilder';
import { studentSearchableFields } from './student.constant';

/*
{email:{$regex:query.searchTerm, $options:i}} to search in email
{'name.firstName':{$regex:query.searchTerm, $options:i}}
{presentAddress.firstName:{$regex:query.searchTerm, $options:i}}
*/

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  const studentQuery = new QueryBuilder<TStudent>(
    Student.find()
      .populate('user')
      .populate('admittedSemester')
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      }),
    query,
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fieldsLimit();

  const result = await studentQuery.modelQuery;
  const meta = await studentQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getStudentByIdFromDB = async (id: string) => {
  if (!(await Student.isStudentExists(id))) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student is not found');
  }

  const result = await Student.findById(id)
    .populate('admittedSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });

  return result;
};

const updateSingleStudentIntoDB = async (
  id: string,
  payload: Partial<TStudent>,
) => {
  if (!(await Student.isStudentExists(id))) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student is not found');
  }

  const { name, guardian, localGuardian, ...remainingStudentData } = payload;

  const modifiedStudentData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, val] of Object.entries(name)) {
      modifiedStudentData[`name.${key}`] = val;
    }
  }
  if (guardian && Object.keys(guardian).length) {
    for (const [key, val] of Object.entries(guardian)) {
      modifiedStudentData[`guardian.${key}`] = val;
    }
  }
  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, val] of Object.entries(localGuardian)) {
      modifiedStudentData[`localGuardian.${key}`] = val;
    }
  }

  // console.log(modifiedStudentData);

  const result = await Student.findByIdAndUpdate(id, modifiedStudentData, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    if (!(await Student.isStudentExists(id))) {
      throw new AppError(httpStatus.NOT_FOUND, 'Student is not found');
    }

    const deletedStudent = await Student.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete  student');
    }

    const userId = deletedStudent.user;

    const deletedUser = await User.findOneAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete  User');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, err?.message);
  }
};

export const studentServices = {
  getAllStudentsFromDB,
  getStudentByIdFromDB,
  deleteStudentFromDB,
  updateSingleStudentIntoDB,
};

/************/
/*
const queryObj = { ...query };

let searchTerm = '';

  if (query?.searchTerm) {
    searchTerm = query?.searchTerm as string;
  }

  // searching
  const searchQuery = Student.find({
    $or: studentSearchableFields.map((field) => ({
      [field]: { $regex: searchTerm, $options: 'i' },
    })),
  });

  // filtering
  const excludeFieldsFromQuery = [
    'searchTerm',
    'sort',
    'limit',
    'page',
    'fields',
  ];

  excludeFieldsFromQuery.forEach((element) => delete queryObj[element]);
  // console.log({ query }, { queryObj });

  const filterQuery = searchQuery
    .find(queryObj)
    .populate('admittedSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });

    // sorting
  let sort = '-createdAt';

  if (query.sort) {
    sort = query.sort as string;
  }

  const sortQuery = filterQuery.sort(sort);


  // pagination:
  let limit = 10;
  if (query.limit) {
    limit = Number(query.limit);
  }
  let page = 1;
  let skip = 0;
  if (query.page) {
    page = Number(query.page);
    skip = (page - 1) * limit;
  }

  //skipping
  const paginateQuery = sortQuery.skip(skip);

  // limiting
  const limitQuery = paginateQuery.limit(limit);


  // field limit query
  let fields = '- __v';
  if (query.fields) {
    fields = (query.fields as string).split(',').join(' ');
    // fields.replace(',', ' ');
    console.log(fields);
  }

  const fieldLimitQuery = await limitQuery.select(fields);

*/

/*
const result = await Student.findOne({ id: studentId });
const result = await Student.aggregate([{ $match: { id: studentId } }])
const result = await Student.findById({ _id: Object(studentId) });
*/

/**
 * findOne({id:id}): may be mongodb index id or our assigned id
 * findById({_id: Object(studentId)}): accept only mongodb default indexed id
 */
