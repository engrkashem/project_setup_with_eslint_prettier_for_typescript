import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import QueryBuilder from '../../queryBuilder/QueryBuilder';
import { SemesterRegistrationStatusObj } from './semesterRegistration.constants';

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  const { academicSemester: semesterId } = payload;
  const { UPCOMING, ONGOING } = SemesterRegistrationStatusObj;

  // check if there is any registered semester that is 'UPCOMING or 'ONGOING
  const isThereAnyUpcomingOrOngoingRegisteredSemester =
    await SemesterRegistration.findOne({
      $or: [{ status: UPCOMING }, { status: ONGOING }],
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
  const currentRequestedRegisteredSemesterStatus =
    requestedRegisteredSemester?.status;
  const requestedSemesterStatus = payload?.status;

  const { UPCOMING, ONGOING, ENDED } = SemesterRegistrationStatusObj;

  // if semester not exists throw error
  if (!requestedRegisteredSemester) {
    throw new AppError(httpStatus.NOT_FOUND, `Requested semester is not found`);
  }

  // check if status === ENDED, throw error

  if (currentRequestedRegisteredSemesterStatus === ENDED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Requested semester already ${requestedRegisteredSemester?.status}`,
    );
  }

  // Status Change flow: UPCOMING ---> ONGOING ---> ENDED (never vice versa)
  // validate status change sequence UPCOMING -->ENDED
  if (
    currentRequestedRegisteredSemesterStatus === UPCOMING &&
    requestedSemesterStatus === ENDED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not update status directly from ${currentRequestedRegisteredSemesterStatus} to ${requestedSemesterStatus}. Status update sequence: UPCOMING --> ONGOING --> ENDED`,
    );
  }

  // validate status change sequence ONGOING --> UPCOMING -
  if (
    currentRequestedRegisteredSemesterStatus === ONGOING &&
    requestedSemesterStatus === UPCOMING
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not update status directly from ${currentRequestedRegisteredSemesterStatus} to ${requestedSemesterStatus}. Status update sequence: UPCOMING --> ONGOING --> ENDED`,
    );
  }

  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
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
