import { z } from 'zod';

// Sub-schemas for create
const createUserNameValidationSchema = z.object({
  firstName: z.string().min(1).max(20).trim(),
  middleName: z.string().trim().optional(),
  lastName: z.string().min(3).max(20).trim(),
});

const createGuardianValidationSchema = z.object({
  fatherName: z.string().min(1).trim(),
  fatherOccupation: z.string().min(1).trim(),
  fatherContactNo: z.string().min(1).trim(),
  motherName: z.string().min(1).trim(),
  motherContactNo: z.string().min(1).trim(),
  motherOccupation: z.string().min(1).trim(),
});

const createLocalGuardianValidationSchema = z.object({
  name: z.string().min(1).trim(),
  contactNo: z.string().min(1).trim(),
  occupation: z.string().min(1).trim(),
  relationShipWithStudent: z.string().trim().optional(),
  address: z.string().trim().optional(),
});

// Main schema for create
const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20).optional(),
    student: z.object({
      name: createUserNameValidationSchema,
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
      guardian: createGuardianValidationSchema,
      localGuardian: createLocalGuardianValidationSchema,
      admittedSemester: z.string(),
      academicDepartment: z.string(),
    }),
  }),
});

// sub schema for update
const updateUserNameValidationSchema = z.object({
  firstName: z.string().min(1).max(20).trim().optional(),
  middleName: z.string().trim().optional(),
  lastName: z.string().min(3).max(20).trim().optional(),
});

const updateGuardianValidationSchema = z.object({
  fatherName: z.string().min(1).trim().optional(),
  fatherOccupation: z.string().min(1).trim().optional(),
  fatherContactNo: z.string().min(1).trim().optional(),
  motherName: z.string().min(1).trim().optional(),
  motherContactNo: z.string().min(1).trim().optional(),
  motherOccupation: z.string().min(1).trim().optional(),
});

const updateLocalGuardianValidationSchema = z.object({
  name: z.string().min(1).trim().optional(),
  contactNo: z.string().min(1).trim().optional(),
  occupation: z.string().min(1).trim().optional(),
  relationShipWithStudent: z.string().trim().optional(),
  address: z.string().trim().optional(),
});

// sub schema for update
const updateStudentValidationSchema = z.object({
  body: z.object({
    student: z.object({
      name: updateUserNameValidationSchema.optional(),
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
      guardian: updateGuardianValidationSchema.optional(),
      localGuardian: updateLocalGuardianValidationSchema.optional(),
      admittedSemester: z.string().optional(),
      academicDepartment: z.string().optional(),
    }),
  }),
});

export const studentValidations = {
  createStudentValidationSchema,
  updateStudentValidationSchema,
};

/**
 
firstName: z.string().min(1).max(20).trim()
   .refine(
     (value) => value.charAt(0).toUpperCase() + value.slice(1) === value,
     {
       message: 'First name must be capitalized',
     },
  ),

 */
