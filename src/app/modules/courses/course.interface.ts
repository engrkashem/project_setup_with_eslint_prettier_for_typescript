import { Model, Types } from 'mongoose';

export type TPreRequisiteCourses = {
  course: Types.ObjectId;
  isDeleted: boolean;
};

export type TCourse = {
  title: string;
  prefix: string;
  code: number;
  credits: number;
  preRequisiteCourses: TPreRequisiteCourses[];
  isDeleted?: boolean;
};

export interface CourseModel extends Model<TCourse> {
  // eslint-disable-next-line no-unused-vars
  isCourseExists(id: string): Promise<TCourse | null>;
}
