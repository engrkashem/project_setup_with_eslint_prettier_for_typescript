import { z } from 'zod';

const createUserNameValidationSchema = z.object({
  firstName: z.string().min(1).max(20).trim(),
  middleName: z.string().trim().optional(),
  lastName: z.string().min(3).max(20).trim(),
});

const createFacultyValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20),
    faculty: z.object({
      name: createUserNameValidationSchema,
      designation: z.string(),
      gender: z.enum(['male', 'female', 'other']),
      dateOfBirth: z.string().optional(),
      email: z.string().email().trim(),
      contactNo: z.string().trim(),
      emergencyContactNo: z.string().trim(),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      presentAddress: z.string().min(1).trim(),
      permanentAddress: z.string().min(1).trim(),
      academicDepartment: z.string(),
    }),
  }),
});

const updateUserNameValidationSchema = z.object({
  firstName: z.string().min(1).max(20).trim().optional(),
  middleName: z.string().trim().optional(),
  lastName: z.string().min(3).max(20).trim().optional(),
});

const updateFacultyValidationSchema = z.object({
  body: z.object({
    faculty: z.object({
      name: updateUserNameValidationSchema.optional(),
      designation: z.string().optional(),
      gender: z.enum(['male', 'female', 'other']).optional(),
      dateOfBirth: z.string().optional(),
      email: z.string().email().trim().optional(),
      contactNo: z.string().trim().optional(),
      emergencyContactNo: z.string().trim().optional(),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      presentAddress: z.string().min(1).trim().optional(),
      permanentAddress: z.string().min(1).trim().optional(),
      academicDepartment: z.string().optional(),
    }),
  }),
});

export const facultyValidations = {
  createFacultyValidationSchema,
  updateFacultyValidationSchema,
};
