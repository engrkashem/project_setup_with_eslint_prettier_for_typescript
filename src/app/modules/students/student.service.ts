import { TStudent } from './student.interface';
import { Student } from './student.model';

const addStudentToDB = async (studentData: TStudent) => {
  /*
  // built-in static method (mongoose) to create student to db
  const result = await Student.create(studentData);
  */

  // custom static method to check if student already exists
  if (await Student.isStudentExists(studentData.id)) {
    throw new Error('Student Already Exists. ');
  }

  const result = await Student.create(studentData);

  /*
  // instance method to create student in student DB
  const student = new Student(studentData); //create an instance
  if (await student.isStudentExists(studentData.id)) {
    throw new Error('User Already exists');
  }
  const result = await student.save(); //built-in instance method
  */

  return result;
};

const getAllStudentsFromDB = async () => {
  const result = await Student.find({});
  return result;
};

const getStudentByIdFromDB = async (studentId: string) => {
  // const result = await Student.findOne({ id: studentId });
  const result = await Student.aggregate([{ $match: { id: studentId } }]);
  // const result = await Student.findById({ _id: Object(studentId) });
  /**
   * findOne({id:id}): may be mongodb index id or our assigned id
   * findById({_id: Object(studentId)}): accept only mongodb default indexed id
   */
  return result;
};

const deleteStudentFromDB = async (studentId: string) => {
  const result = await Student.updateOne(
    { id: studentId },
    { isDeleted: true },
  );

  return result;
};

export const studentServices = {
  addStudentToDB,
  getAllStudentsFromDB,
  getStudentByIdFromDB,
  deleteStudentFromDB,
};
