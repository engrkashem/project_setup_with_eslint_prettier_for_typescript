import { Schema, model } from 'mongoose';
import userNameSchema from '../../schema/userName';
import { AdminModel, TAdmin } from '../admins/admin.interface';
import { BloodGroup, Gender } from './admin.constant';

const adminSchema = new Schema<TAdmin>(
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
      required: [true, 'Designation is required for Admin'],
      trim: true,
    },
    name: {
      type: userNameSchema,
      required: [true, 'Admin name is required'],
      trim: true,
    },
    gender: {
      type: String,
      enum: {
        values: Gender,
        message:
          "'{VALUE}' is not supported. Gender can only be 'male', 'female' or 'other'",
      },
      required: [true, 'Admin gender is required'],
    },
    dateOfBirth: { type: Date },
    email: {
      type: String,
      required: [true, 'Admin email is required'],
      trim: true,
      unique: true,
    },
    contactNo: {
      type: String,
      required: [
        true,
        "Admin contact number is required. if not then use fathers'/Mothers' number",
      ],
      trim: true,
    },
    emergencyContactNo: {
      type: String,
      required: [
        true,
        "Admin contact number is required. It will be different from Admin contact number. if not then use fathers'/Mothers' number other than Admin contact number",
      ],
      trim: true,
    },
    bloodGroup: {
      type: String,
      enum: BloodGroup,
    },
    presentAddress: {
      type: String,
      required: [true, 'Admin present address is required'],
      trim: true,
    },
    permanentAddress: {
      type: String,
      required: [true, 'Admin permanent address is required'],
      trim: true,
    },
    profileImg: { type: String },
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
adminSchema.virtual('fullName').get(function () {
  return `${this?.name?.firstName} ${this?.name?.middleName} ${this?.name?.lastName}`;
});

/****** Middlewares ******/
// query middlewares to discard deleted data from response
adminSchema.pre('find', async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

adminSchema.pre('findOne', async function (next) {
  this.findOne({ isDeleted: { $ne: true } });
  next();
});

adminSchema.pre('aggregate', async function (next) {
  const pipelinesArray = this.pipeline();
  const additionalQuery = { $match: { isDeleted: { $ne: true } } };
  pipelinesArray.unshift(additionalQuery);
  next();
});

/****** Static Method ******/
adminSchema.static('isAdminExists', async function isAdminExists(id: string) {
  return await Admin.findOne({ id });
});

/****** Admin Model ******/
export const Admin = model<TAdmin, AdminModel>('Admin', adminSchema);
