import { Schema, model } from 'mongoose';
import { TAcademicSemester } from './academicSemester.interface';
import {
  AcademicSemesterCode,
  AcademicSemesterName,
  Months,
} from './academicSemester.constant';

const AcademicSemesterSchema = new Schema<TAcademicSemester>(
  {
    name: { type: String, enum: AcademicSemesterName, required: true },
    year: { type: String, required: true },
    code: { type: String, enum: AcademicSemesterCode, required: true },
    startMonth: { type: String, enum: Months, required: true },
    endMonth: { type: String, enum: Months, required: true },
  },
  {
    timestamps: true,
  },
);

/******Document Middleware*******/
AcademicSemesterSchema.pre('save', async function (next) {
  const isSemesterExists = await AcademicSemester.findOne({
    year: this.year,
    name: this.name,
  });

  if (isSemesterExists) {
    throw new Error(`${this.name} Semester of ${this.year} already taken.`);
  }

  next();
});

/******Model*******/
export const AcademicSemester = model<TAcademicSemester>(
  'AcademicSemester',
  AcademicSemesterSchema,
);
