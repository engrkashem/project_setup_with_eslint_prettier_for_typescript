import mongoose from 'mongoose';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { TStudent } from './student.interface';

const getAllStudentsFromDB = async () => {
  const result = await Student.find({})
    .populate('admittedSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};

// const result = await Student.findOne({ id: studentId });
// const result = await Student.aggregate([{ $match: { id: studentId } }])
// const result = await Student.findById({ _id: Object(studentId) });
/**
 * findOne({id:id}): may be mongodb index id or our assigned id
 * findById({_id: Object(studentId)}): accept only mongodb default indexed id
 */
const getStudentByIdFromDB = async (studentId: string) => {
  const result = await Student.findOne({ id: studentId })
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
  studentId: string,
  payload: Partial<TStudent>,
) => {
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

  const result = await Student.findOneAndUpdate(
    { id: studentId },
    modifiedStudentData,
    {
      new: true,
      runValidators: true,
    },
  );

  return result;
};

const deleteStudentFromDB = async (studentId: string) => {
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    if (!(await Student.isStudentExists(studentId))) {
      throw new AppError(httpStatus.NOT_FOUND, 'Student is not found');
    }

    const deletedStudent = await Student.findOneAndUpdate(
      { id: studentId },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete  student');
    }

    const deletedUser = await User.findOneAndUpdate(
      { id: studentId },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete  User');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
  }
};

export const studentServices = {
  getAllStudentsFromDB,
  getStudentByIdFromDB,
  deleteStudentFromDB,
  updateSingleStudentIntoDB,
};
