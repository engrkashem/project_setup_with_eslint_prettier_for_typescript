import { z } from 'zod';
import { Days } from './offeredCourse.constants';
import { validateStartAndEndTime, validateTime } from './offeredCourse.utils';

const timeStringValidationSchema = z
  .string()
  .refine((time) => validateTime(time), {
    message: 'Invalid time format. Expected in HH:MM in 24 hours format.',
  });

const createOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      semesterRegistration: z.string(),
      academicFaculty: z.string(),
      academicDepartment: z.string(),
      course: z.string(),
      faculty: z.string(),
      maxCapacity: z.number(),
      section: z.number(),
      days: z.array(z.enum([...Days] as [string, ...string[]])),
      startTime: timeStringValidationSchema,
      endTime: timeStringValidationSchema,
    })
    .refine(
      ({ startTime, endTime }) => validateStartAndEndTime(startTime, endTime),
      { message: 'End time can not be less than start time.' },
    ),
});

const updateOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      faculty: z.string(),
      maxCapacity: z.number(),
      days: z.array(z.enum([...Days] as [string, ...string[]])),
      startTime: timeStringValidationSchema,
      endTime: timeStringValidationSchema,
    })
    .refine(
      ({ startTime, endTime }) => validateStartAndEndTime(startTime, endTime),
      { message: 'End time can not be less than start time.' },
    ),
});

export const OfferedCourseValidations = {
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};
