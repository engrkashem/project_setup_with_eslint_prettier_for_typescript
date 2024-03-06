import { Schema, model } from 'mongoose';
import {
  TEnrolledCourseMarks,
  TEnrolledCourse,
} from './enrolledCourse.interface';
import { Grade } from './enrolledCourse.constants';

const courseMarksSchema = new Schema<TEnrolledCourseMarks>(
  {
    classTest1: { type: Number, min: 0, max: 10, default: 0 },
    midTerm: { type: Number, min: 0, max: 30, default: 0 },
    classTest2: { type: Number, min: 0, max: 10, default: 0 },
    finalTerm: { type: Number, min: 0, max: 50, default: 0 },
  },
  {
    _id: false,
  },
);

const enrolledCourseSchema = new Schema<TEnrolledCourse>({
  semesterRegistration: {
    type: Schema.Types.ObjectId,
    ref: 'SemesterRegistration',
    required: [true, 'semesterRegistration is required'],
  },
  academicSemester: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicSemester',
    required: [true, 'Academic Semester is required'],
  },
  academicDepartment: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicDepartment',
    required: [true, 'Academic Department is required'],
  },
  academicFaculty: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicFaculty',
    required: [true, 'Academic Faculty is required'],
  },
  offeredCourse: {
    type: Schema.Types.ObjectId,
    ref: 'OfferedCourse',
    required: [true, 'Offered Course is required'],
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required'],
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student is required'],
  },
  faculty: {
    type: Schema.Types.ObjectId,
    ref: 'Faculty',
    required: [true, 'Faculty is required'],
  },
  isEnrolled: { type: Boolean, default: false },
  courseMarks: { type: courseMarksSchema, default: {} },
  grade: { type: String, enum: Grade, default: 'NA' },
  gradePoints: { type: Number, min: 0, max: 4, default: 0 },
  isCompleted: { type: Boolean, default: false },
});

export const EnrolledCourse = model<TEnrolledCourse>(
  'EnrolledCourse',
  enrolledCourseSchema,
);
