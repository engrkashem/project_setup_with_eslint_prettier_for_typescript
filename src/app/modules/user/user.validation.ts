import { z } from 'zod';
import { UserStatus } from './user.constants';

const userValidationSchema = z.object({
  password: z
    .string({ invalid_type_error: 'Password must be string' })
    .trim()
    .min(3, { message: 'Password can not be less than 3 characters' })
    .max(20, { message: 'Password can not be more than 20 characters' })
    .optional(),
});

const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...UserStatus] as [string, ...string[]]),
  }),
});

export const UserValidations = {
  userValidationSchema,
  changeStatusValidationSchema,
};
