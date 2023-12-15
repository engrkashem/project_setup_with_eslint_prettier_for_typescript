import { Schema, model } from 'mongoose';
import { TOfferedCourse } from './offeredCourse.interface';
import { Days } from './offeredCourse.constants';

const offeredCourseSchema = new Schema<TOfferedCourse>(
  {
    semesterRegistration: {
      type: Schema.Types.ObjectId,
      required: [true, 'Semester registration ObjectId is required'],
      ref: 'SemesterRegistration',
    },
    academicSemester: {
      type: Schema.Types.ObjectId,
      required: [true, 'Academic Semester ObjectId is required'],
      ref: 'AcademicSemester',
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      required: [true, 'Academic faculty ObjectId is required'],
      ref: 'AcademicFaculty',
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      required: [true, 'Academic department ObjectId is required'],
      ref: 'AcademicDepartment',
    },
    course: {
      type: Schema.Types.ObjectId,
      required: [true, 'Course ObjectId is required'],
      ref: 'Course',
    },
    faculty: {
      type: Schema.Types.ObjectId,
      required: [true, 'Faculty ObjectId is required'],
      ref: 'Faculty',
    },
    maxCapacity: { type: Number, required: [true, 'Max capacity is required'] },
    section: { type: Number, required: [true, 'Section is required'] },
    days: [{ type: String, enum: Days, required: true }],
    startTime: { type: String, required: [true, 'Start time is required'] },
    endTime: { type: String, required: [true, 'End time is required'] },
  },
  {
    timestamps: true,
  },
);

export const OfferedCourse = model<TOfferedCourse>(
  'OfferedCourse',
  offeredCourseSchema,
);
