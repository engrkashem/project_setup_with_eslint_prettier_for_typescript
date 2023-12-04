import { Schema, model } from 'mongoose';

import {
  TGuardian,
  TLocalGuardian,
  TStudent,
  // StudentMethods,
  TUserName,
  StudentModel,
} from './student.interface';
// import validator from 'validator';

// regex for email
// const emailRegEx =
//   // eslint-disable-next-line no-useless-escape
//   /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

//sub schemas
const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [20, 'First name length must be less than or equal to 20'],
    // validate: {
    //   validator: function (value: string) {
    //     const idealFirstNameFormat =
    //       value.charAt(0).toUpperCase() + value.slice(1);
    //     return idealFirstNameFormat === value;
    //   },
    //   message: 'Fist name must be capitalize',
    // },
  },
  middleName: { type: String, trim: true },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [3, 'Last name must contains at least 3 characters'],
    // validate: {
    //   validator: (value: string) => validator.isAlpha(value),
    //   message: '{VALUE} is invalid. Remove numeric character.',
    // },
  },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: [true, "Fathers' name is required"],
    trim: true,
  },
  fatherOccupation: {
    type: String,
    required: [true, "Fathers' Occupation is required"],
    trim: true,
  },
  fatherContactNo: {
    type: String,
    required: [true, "Fathers' contact number is required"],
    trim: true,
  },
  motherName: { type: String, required: [true, "Mother's name is required"] },
  motherContactNo: {
    type: String,
    required: [true, "Mother's contact number is required"],
    trim: true,
  },
  motherOccupation: {
    type: String,
    required: [true, "Mother's occupation is required"],
    trim: true,
  },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: { type: String, required: [true, "Local guardians' name is required"] },
  contactNo: {
    type: String,
    required: [true, "Local guardians' contact number is required"],
    trim: true,
  },
  occupation: {
    type: String,
    required: [true, "Local guardians' occupation is required"],
    trim: true,
  },
  relationShipWithStudent: { type: String },
  address: { type: String },
});

//main schema
/*
  // for creating instance method
  const studentSchema = new Schema<TStudent, StudentModel, StudentMethods>({
*/
const studentSchema = new Schema<TStudent, StudentModel>(
  {
    id: { type: String, required: [true, 'Id is required'], unique: true },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User object id is required'],
      unique: true,
      ref: 'User',
    },
    name: {
      type: userNameSchema,
      required: [true, "Students' name is required"],
      trim: true,
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'],
        message:
          "'{VALUE}' is not supported. Gender can only be 'male', 'female' or 'other'",
      },
      required: [true, "Students' gender is required"],
    },
    dateOfBirth: { type: Date },
    email: {
      type: String,
      required: [true, "Students' email is required"],
      trim: true,
      unique: true,

      //using built-in validator
      // match: [emailRegEx, '{VALUE}. Invalid email format'],

      //third party: validator
      // validate: {
      //   validator: (email: string) => validator.isEmail(email),
      //   message: '{VALUE} is not valid email address',
      // },
    },
    contactNo: {
      type: String,
      required: [
        true,
        "Students' contact number is required. if not then use fathers'/Mothers' number",
      ],
      trim: true,
    },
    emergencyContactNo: {
      type: String,
      required: [
        true,
        "Students' contact number is required. It will be different from Students' contact number. if not then use fathers'/Mothers' number other than Students' contact number",
      ],
      trim: true,
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    presentAddress: {
      type: String,
      required: [true, "Students' present address is required"],
      trim: true,
    },
    permanentAddress: {
      type: String,
      required: [true, "Students' permanent address is required"],
      trim: true,
    },
    guardian: {
      type: guardianSchema,
      required: [true, "Guardians' information is required"],
    },
    localGuardian: {
      type: localGuardianSchema,
      required: [true, "Local guardians' information is required"],
    },
    profileImg: { type: String },
    admittedSemester: { type: Schema.Types.ObjectId, ref: 'AcademicSemester' },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicDepartment',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

/* ********************* Virtual Field addition ***************************/
studentSchema.virtual('fullName').get(function () {
  return `${this?.name?.firstName} ${this?.name?.middleName} ${this?.name?.lastName}`;
});

/*************************** Query Middleware start ************************/

// pre find middleware/hooks
studentSchema.pre('find', function (next) {
  // this.find({ isDeleted: false });
  this.find({ isDeleted: { $ne: true } }); // this means current user requested query(find in this case)

  next();
});
studentSchema.pre('findOne', function (next) {
  // this.find({ isDeleted: false });
  this.findOne({ isDeleted: { $ne: true } }); // this means current user requested query(find in this case)

  next();
});
/******************************* Query Middleware ends  *******************/
//[ { '$match': { id: 'student125' } } ]
/* Aggregate Middleware start  */
studentSchema.pre('aggregate', function (next) {
  const pipelinesArr = this.pipeline();
  const additionalQuery = { $match: { isDeleted: { $ne: true } } };
  pipelinesArr.unshift(additionalQuery);
  next();
});

/*
// custom made instance method
studentSchema.methods.isStudentExists = async function (id: string) {
  const existingStudent = await Student.findOne({ id: id });

  return existingStudent;
};
*/

// creating static method
/*
studentSchema.static('isStudentExists', async function isStudentExists(id) {
  const existingStudent = await Student.findOne({ id: id });

  return existingStudent;
});
*/
//alternate way
studentSchema.statics.isStudentExists = async function (id: string) {
  const existingStudent = await Student.findOne({ id: id });

  return existingStudent;
};

// model creation
export const Student = model<TStudent, StudentModel>('Student', studentSchema); // it will create a collection named Student
