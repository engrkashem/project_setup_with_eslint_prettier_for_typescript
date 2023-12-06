import { Schema, model } from 'mongoose';
import { TCourse, TPreRequisiteCourses } from './course.interface';

const preRequisiteCoursesSchema = new Schema<TPreRequisiteCourses>({
  course: { type: Schema.Types.ObjectId, ref: 'Course' },
  isDeleted: { type: Boolean, default: false },
});

const courseSchema = new Schema<TCourse>(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      unique: true,
      trim: true,
    },
    prefix: {
      type: String,
      required: [true, 'Course prefix is required'],
      trim: true,
    },
    code: { type: Number, required: [true, 'Course code is required'] },
    credits: { type: Number, required: [true, 'Course credits is required'] },
    preRequisiteCourses: [preRequisiteCoursesSchema],
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

/******* Course Model Static method *******/
courseSchema.statics.isCourseExists = async (id: string) => {
  return await Course.findById(id);
};

/******* Course Model *******/
export const Course = model<TCourse>('Course', courseSchema);
