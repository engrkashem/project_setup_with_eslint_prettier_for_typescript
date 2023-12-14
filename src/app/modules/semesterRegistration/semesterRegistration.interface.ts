import { Date, Types } from 'mongoose';

type TStatus = 'UPCOMING' | 'ONGOING' | 'ENDED';

export type TSemesterRegistration = {
  academicSemester: Types.ObjectId;
  status: TStatus;
  startDate: Date;
  endDate: Date;
  minCredit: number;
  maxCredit: number;
};
