import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { AcademicSemesterNameCodeMapper } from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';
import QueryBuilder from '../../queryBuilder/QueryBuilder';

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  // check if academic semester name and code are okay

  if (AcademicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Semester code for ${payload.name} is invalid`,
    );
  }

  // insert to DB
  const result = await AcademicSemester.create(payload);
  return result;
};

const getAllAcademicSemesterFromDB = async (query: Record<string, unknown>) => {
  const academicSemesterQuery = new QueryBuilder<TAcademicSemester>(
    AcademicSemester.find(),
    query,
  )
    .search([])
    .filter()
    .sort()
    .paginate()
    .fieldsLimit();

  const result = await academicSemesterQuery.modelQuery;
  const meta = await academicSemesterQuery.countTotal();
  return {
    meta,
    result,
  };
};

const getSingleAcademicSemester = async (semesterId: string) => {
  const result = await AcademicSemester.findById({ _id: semesterId });
  return result;
};

const updateSingleAcademicSemester = async (
  semesterId: string,
  payload: Partial<TAcademicSemester>,
) => {
  if (
    payload.name &&
    payload.code &&
    AcademicSemesterNameCodeMapper[payload.name] !== payload.code
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invalid semester code for ${payload.name}`,
    );
  }

  const result = await AcademicSemester.findOneAndUpdate(
    { _id: semesterId },
    payload,
    { new: true },
  );
  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemesterFromDB,
  getSingleAcademicSemester,
  updateSingleAcademicSemester,
};
