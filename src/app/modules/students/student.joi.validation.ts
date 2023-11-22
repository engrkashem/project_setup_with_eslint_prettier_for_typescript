import Joi from 'joi';

const userNameValidationSchema = Joi.object({
  firstName: Joi.string()
    .required()
    .trim()
    .max(20)
    .regex(/^[A-Z][a-z]*$/)
    .messages({
      'string.base': 'First name must be a string',
      'string.empty': 'First name is required',
      'string.max': 'First name length must be less than or equal to 20',
      'string.pattern.base': 'First name must be capitalized',
    }),
  middleName: Joi.string().trim(),
  lastName: Joi.string()
    .required()
    .trim()
    .min(3)
    .regex(/^[A-Za-z]+$/)
    .messages({
      'string.base': 'Last name must be a string',
      'string.empty': 'Last name is required',
      'string.min': 'Last name must contain at least 3 characters',
      'string.pattern.base':
        'Last name must contain only alphabetic characters',
    }),
});

const guardianValidationSchema = Joi.object({
  fatherName: Joi.string().required().trim().messages({
    'string.base': "Father's name must be a string",
    'string.empty': "Father's name is required",
  }),
  fatherOccupation: Joi.string().required().trim().messages({
    'string.base': "Father's occupation must be a string",
    'string.empty': "Father's occupation is required",
  }),
  fatherContactNo: Joi.string().required().trim().messages({
    'string.base': "Father's contact number must be a string",
    'string.empty': "Father's contact number is required",
  }),
  motherName: Joi.string().required().trim().messages({
    'string.base': "Mother's name must be a string",
    'string.empty': "Mother's name is required",
  }),
  motherContactNo: Joi.string().required().trim().messages({
    'string.base': "Mother's contact number must be a string",
    'string.empty': "Mother's contact number is required",
  }),
  motherOccupation: Joi.string().required().trim().messages({
    'string.base': "Mother's occupation must be a string",
    'string.empty': "Mother's occupation is required",
  }),
});

const localGuardianValidationSchema = Joi.object({
  name: Joi.string().required().trim().messages({
    'string.base': "Local guardian's name must be a string",
    'string.empty': "Local guardian's name is required",
  }),
  contactNo: Joi.string().required().trim().messages({
    'string.base': "Local guardian's contact number must be a string",
    'string.empty': "Local guardian's contact number is required",
  }),
  occupation: Joi.string().required().trim().messages({
    'string.base': "Local guardian's occupation must be a string",
    'string.empty': "Local guardian's occupation is required",
  }),
  relationShipWithStudent: Joi.string(),
});

const studentValidationSchema = Joi.object({
  id: Joi.string().required(),
  name: userNameValidationSchema.required(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  dateOfBirth: Joi.string(),
  email: Joi.string().email().required(),
  contactNo: Joi.string().required(),
  emergencyContactNo: Joi.string().required(),
  bloodGroup: Joi.string().valid(
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-',
    'O+',
    'O-',
  ),
  presentAddress: Joi.string().required(),
  permanentAddress: Joi.string().required(),
  guardian: guardianValidationSchema.required(),
  localGuardian: localGuardianValidationSchema.required(),
  profileImg: Joi.string(),
  isActive: Joi.string().valid('active', 'blocked').default('active'),
});

export default studentValidationSchema;
