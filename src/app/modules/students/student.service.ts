import { Student } from './student.model';

const getAllStudentsFromDB = async () => {
  const result = await Student.find({})
    .populate('admittedSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};

const getStudentByIdFromDB = async (studentId: string) => {
  // const result = await Student.findOne({ id: studentId });
  // const result = await Student.aggregate([{ $match: { id: studentId } }])
  const result = await Student.findOne({ id: studentId })
    .populate('admittedSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
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
  getAllStudentsFromDB,
  getStudentByIdFromDB,
  deleteStudentFromDB,
};
