import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { User } from './user.model';

const getLastStudentId = async () => {
  const lastStudent = await User.findOne({ role: 'student' }, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();

  return lastStudent?.id ? lastStudent.id : undefined;
};

// to create needs: year, semester code, 4-digit number
export const generateStudentId = async (payload: TAcademicSemester) => {
  // first time 0000
  let currentId = (0).toString(); // by default

  const lastStudent = await getLastStudentId();

  const lastStudentSemesterYear = lastStudent?.substring(0, 4);
  const lastStudentSemesterCode = lastStudent?.substring(4, 6);

  const currentSemesterYear = payload.year;
  const currentSemesterCode = payload.code;

  if (
    lastStudent &&
    lastStudentSemesterCode === currentSemesterCode &&
    lastStudentSemesterYear === currentSemesterYear
  ) {
    currentId = lastStudent?.substring(6);
  }

  let incrementedId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementedId = `${payload.year}${payload.code}${incrementedId}`;

  return incrementedId;
};

const getLastFacultyId = async () => {
  const lastFaculty = await User.findOne({ role: 'faculty' }, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();

  return lastFaculty?.id ? lastFaculty.id : undefined;
};

export const generateFacultyId = async () => {
  let currentId = (0).toString();

  const lastFacultyId = await getLastFacultyId();

  if (lastFacultyId) currentId = lastFacultyId?.substring(3);

  const newFacultyId = (Number(currentId) + 1).toString().padStart(4, '0');

  return `F-${newFacultyId}`;
};
