import QueryBuilder from '../../queryBuilder/QueryBuilder';
import { facultySearchableFields } from './faculty.constant';
import { TFaculty } from './faculty.interface';
import { Faculty } from './faculty.model';

const getAllFacultiesFromDB = async (query: Record<string, unknown>) => {
  const facultyQuery = new QueryBuilder(
    Faculty.find().populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    }),
    query,
  )
    .search(facultySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fieldsLimit();

  const result = await facultyQuery.modelQuery;

  return result;
};

const getSingleFacultyFromDB = async (facultyId: string) => {
  const result = await Faculty.findOne({ id: facultyId }).populate({
    path: 'academicDepartment',
    populate: {
      path: 'academicFaculty',
    },
  });
  return result;
};

const updateSingleFacultyFromDB = async (
  facultyId: string,
  payload: Partial<TFaculty>,
) => {
  const { name, ...remaining } = payload;

  const modifiedFaculty: Record<string, unknown> = {
    ...remaining,
  };

  if (name && Object.keys(name).length) {
    for (const [key, val] of Object.entries(name)) {
      modifiedFaculty[`name.${key}`] = val;
    }
  }

  const result = await Faculty.findOneAndUpdate(
    { id: facultyId },
    modifiedFaculty,
    {
      new: true,
      runValidators: true,
    },
  );

  return result;
};

export const facultyServices = {
  getAllFacultiesFromDB,
  getSingleFacultyFromDB,
  updateSingleFacultyFromDB,
};
