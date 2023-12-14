import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import QueryBuilder from '../../queryBuilder/QueryBuilder';

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  const { academicSemester: semesterId } = payload;

  // check if there is any registered semester that is 'UPCOMING or 'ONGOING
  const isThereAnyUpcomingOrOngoingRegisteredSemester =
    await SemesterRegistration.findOne({
      $or: [{ status: 'UPCOMING' }, { status: 'ONGOING' }],
    });

  if (isThereAnyUpcomingOrOngoingRegisteredSemester) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `There is already an ${isThereAnyUpcomingOrOngoingRegisteredSemester.status} registered semester`,
    );
  }

  // check if the semester exists
  const isSemesterExists = await AcademicSemester.findById(semesterId);

  if (!isSemesterExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic semester is not found');
  }

  // check if this semester already registered
  const isSemesterAlreadyRegistered = await SemesterRegistration.findOne({
    academicSemester: semesterId,
  });

  if (isSemesterAlreadyRegistered) {
    throw new AppError(
      httpStatus.CONFLICT,
      'This semester is already registered',
    );
  }

  // create semester registration into db
  const result = await SemesterRegistration.create(payload);

  return result;
};

const getSingleSemesterRegistrationFromDB = async (id: string) => {
  const result = await SemesterRegistration.findById(id);

  return result;
};

const updateSemesterRegistrationFromDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  // if the requested registered semester status is ended, then we will not let it update. check it first
  const requestedRegisteredSemester = await SemesterRegistration.findById(id);

  if (!requestedRegisteredSemester) {
    // if semester not exists throw error
    throw new AppError(httpStatus.NOT_FOUND, `Requested semester is not found`);
  } else if (requestedRegisteredSemester?.status === 'ENDED') {
    // if status ENDED
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Requested semester already ${requestedRegisteredSemester?.status}`,
    );
  }

  return { id, payload };
};

const getAllSemesterRegistrationFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fieldsLimit();

  const result = await semesterRegistrationQuery.modelQuery;

  return result;
};

export const SemesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
  getSingleSemesterRegistrationFromDB,
  updateSemesterRegistrationFromDB,
  getAllSemesterRegistrationFromDB,
};
