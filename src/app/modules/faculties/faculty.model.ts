import { Schema, model } from 'mongoose';
import { FacultyModel, TFaculty } from './faculty.interface';
import userNameSchema from '../../schema/userName';
import { BloodGroup, Gender } from './faculty.constant';

const facultySchema = new Schema<TFaculty>(
  {
    id: { type: String, required: [true, 'Id is required'], unique: true },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User object id is required'],
      unique: true,
      ref: 'User',
    },
    designation: {
      type: String,
      required: [true, 'Designation is required for faculty'],
      trim: true,
    },
    name: {
      type: userNameSchema,
      required: [true, 'Faculty name is required'],
      trim: true,
    },
    gender: {
      type: String,
      enum: {
        values: Gender,
        message:
          "'{VALUE}' is not supported. Gender can only be 'male', 'female' or 'other'",
      },
      required: [true, 'Faculty gender is required'],
    },
    dateOfBirth: { type: Date },
    email: {
      type: String,
      required: [true, 'Faculty email is required'],
      trim: true,
      unique: true,
    },
    contactNo: {
      type: String,
      required: [
        true,
        "Faculty contact number is required. if not then use fathers'/Mothers' number",
      ],
      trim: true,
    },
    emergencyContactNo: {
      type: String,
      required: [
        true,
        "Faculty contact number is required. It will be different from Faculty contact number. if not then use fathers'/Mothers' number other than Faculty contact number",
      ],
      trim: true,
    },
    bloodGroup: {
      type: String,
      enum: BloodGroup,
    },
    presentAddress: {
      type: String,
      required: [true, 'Faculty present address is required'],
      trim: true,
    },
    permanentAddress: {
      type: String,
      required: [true, 'Faculty permanent address is required'],
      trim: true,
    },
    profileImg: { type: String, default: '' },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      required: [true, 'Academic department is required'],
      ref: 'AcademicDepartment',
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      required: [true, 'Academic faculty is required'],
      ref: 'AcademicFaculty',
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

/****** Virtual field addition ******/
facultySchema.virtual('fullName').get(function () {
  return `${this?.name?.firstName} ${this?.name?.middleName} ${this?.name?.lastName}`;
});

/****** Middlewares ******/
// query middlewares to discard deleted data from response
facultySchema.pre('find', async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

facultySchema.pre('findOne', async function (next) {
  this.findOne({ isDeleted: { $ne: true } });
  next();
});

facultySchema.pre('aggregate', async function (next) {
  const pipelinesArray = this.pipeline();
  const additionalQuery = { $match: { isDeleted: { $ne: true } } };
  pipelinesArray.unshift(additionalQuery);
  next();
});

/****** Static Method ******/
facultySchema.static(
  'isFacultyExists',
  async function isFacultyExists(id: string) {
    return await Faculty.findById(id);
  },
);

/****** Faculty Model ******/
export const Faculty = model<TFaculty, FacultyModel>('Faculty', facultySchema);
