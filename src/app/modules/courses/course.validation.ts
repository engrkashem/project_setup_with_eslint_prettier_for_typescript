import { z } from 'zod';

// Sub-schemas for create

const createPreRequisiteCoursesValidationSchema = z.object({
  course: z.string(),
});

// Main schema for create
const createCourseValidationSchema = z.object({
  body: z.object({
    course: z.object({
      title: z.string(),
      prefix: z.string(),
      code: z.number(),
      credits: z.number(),
      preRequisiteCourses: z
        .array(createPreRequisiteCoursesValidationSchema)
        .optional(),
    }),
  }),
});

// const updatePreRequisiteCoursesValidationSchema = z.object({
//   course: z.string().optional(),
// });

// Main schema for create
const updateCourseValidationSchema = createCourseValidationSchema.partial();

// sub schema for update

export const courseValidations = {
  createCourseValidationSchema,
  updateCourseValidationSchema,
};
