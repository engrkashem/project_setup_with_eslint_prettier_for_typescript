import { z } from 'zod';

const createAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Department name is required',
      required_error: 'Department name is required',
    }),
    academicFaculty: z.string({
      invalid_type_error: 'Academic faculty id must be string',
      required_error: 'Academic faculty id is required',
    }),
  }),
});

const updateAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ invalid_type_error: 'Department name is required' })
      .optional(),
    academicFaculty: z
      .string({
        invalid_type_error: 'Academic faculty id is required',
      })
      .optional(),
  }),
});

export const AcademicDepartmentValidation = {
  createAcademicDepartmentValidationSchema,
  updateAcademicDepartmentValidationSchema,
};
