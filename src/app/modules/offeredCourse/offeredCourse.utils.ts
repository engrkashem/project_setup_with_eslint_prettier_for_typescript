import { DATE_PREFIX } from './offeredCourse.constants';
import { TSchedule } from './offeredCourse.interface';

export const validateTime = (time: string) => {
  const regex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
  return regex.test(time);
};

export const validateStartAndEndTime = (startTime: string, endTime: string) => {
  // startTime: 10:30 --> 1970-01-01T10:30
  // endTime: 10:30 --> 1970-01-01T12:30

  const start = new Date(`${DATE_PREFIX}${startTime}:00`);
  const end = new Date(`${DATE_PREFIX}${endTime}:00`);

  return end > start;
};

export const hasTimeConflict = (
  assignedSchedules: TSchedule[],
  requestedSchedule: TSchedule,
) => {
  for (const schedule of assignedSchedules) {
    const existingStartTime = new Date(`${DATE_PREFIX}${schedule.startTime}`);
    const existingEndTime = new Date(`${DATE_PREFIX}${schedule.endTime}`);
    const newStartTime = new Date(
      `${DATE_PREFIX}${requestedSchedule.startTime}`,
    );
    const newEndTime = new Date(`${DATE_PREFIX}${requestedSchedule.endTime}`);

    if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
      return true;
    }
  }

  return false;
};
