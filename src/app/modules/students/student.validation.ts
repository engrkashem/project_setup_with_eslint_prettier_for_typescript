import { z } from 'zod';

// Sub-schemas
const userNameValidationSchema = z.object({
  firstName: z.string().min(1).max(20).trim(),
  // .refine(
  //   (value) => value.charAt(0).toUpperCase() + value.slice(1) === value,
  //   {
  //     message: 'First name must be capitalized',
  //   },
  // ),
  middleName: z.string().trim().optional(),
  lastName: z.string().min(3).max(20).trim(),
});

const guardianValidationSchema = z.object({
  fatherName: z.string().min(1).trim(),
  fatherOccupation: z.string().min(1).trim(),
  fatherContactNo: z.string().min(1).trim(),
  motherName: z.string().min(1).trim(),
  motherContactNo: z.string().min(1).trim(),
  motherOccupation: z.string().min(1).trim(),
});

const localGuardianValidationSchema = z.object({
  name: z.string().min(1).trim(),
  contactNo: z.string().min(1).trim(),
  occupation: z.string().min(1).trim(),
  relationShipWithStudent: z.string().trim().optional(),
  address: z.string().trim().optional(),
});

// Main schema
const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20),
    student: z.object({
      name: userNameValidationSchema,
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
      guardian: guardianValidationSchema,
      localGuardian: localGuardianValidationSchema,
      admittedSemester: z.string(),
      profileImg: z.string().optional(),
    }),
  }),
});

export const studentValidations = {
  createStudentValidationSchema,
};
