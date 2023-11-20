import { Student } from './student.interface';
import { StudentModel } from './student.model';

const addStudentToDB = async (student: Student) => {
  const result = await StudentModel.create(student);
  return result;
};

const getAllStudentsFromDB = async () => {
  const result = await StudentModel.find({});
  return result;
};

const getStudentByIdFromDB = async (studentId: string) => {
  // const result = await StudentModel.findOne({ id: studentId });
  const result = await StudentModel.findById({ _id: Object(studentId) });
  return result;
};

export const studentServices = {
  addStudentToDB,
  getAllStudentsFromDB,
  getStudentByIdFromDB,
};
