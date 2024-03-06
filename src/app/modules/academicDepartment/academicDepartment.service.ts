import QueryBuilder from '../../queryBuilder/QueryBuilder';
import { academicDepartmentSearchableFields } from './academicDepartment.constant';
import { TAcademicDepartment } from './academicDepartment.interface';
import { AcademicDepartment } from './academicDepartment.model';

const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
  const result = await AcademicDepartment.create(payload);
  return result;
};

const getAllAcademicDepartments = async (query: Record<string, unknown>) => {
  const academicDepartmentQuery = new QueryBuilder<TAcademicDepartment>(
    AcademicDepartment.find().populate('academicFaculty'),
    query,
  )
    .search(academicDepartmentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fieldsLimit();

  const result = await academicDepartmentQuery.modelQuery;
  const meta = await academicDepartmentQuery.countTotal();
  return {
    meta,
    result,
  };
};

const getSingleAcademicDepartmentFromDB = async (id: string) => {
  const result =
    await AcademicDepartment.findById(id).populate('academicFaculty');
  return result;
};

const updateSingleAcademicDepartmentIntoDB = async (
  id: string,
  payload: Partial<TAcademicDepartment>,
) => {
  const result = await AcademicDepartment.findOneAndUpdate(
    { _id: id },
    payload,
    {
      new: true,
    },
  );
  return result;
};

export const AcademicDepartmentServices = {
  createAcademicDepartmentIntoDB,
  getAllAcademicDepartments,
  getSingleAcademicDepartmentFromDB,
  updateSingleAcademicDepartmentIntoDB,
};
