import { Schema, model } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';
import { UserStatus } from './user.constants';

const userSchema = new Schema<TUser, UserModel>(
  {
    id: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      unique: true,
    },
    password: { type: String, required: true, select: false },
    needsPasswordChange: { type: Boolean, default: true },
    passwordChangedAt: { type: Date },
    role: {
      type: String,
      enum: ['admin', 'faculty', 'student'],
    },
    status: {
      type: String,
      enum: UserStatus,
      default: 'in-progress',
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
      },
    },
  },
);

/*********************** Document Middleware start **************************/
// pre save middleware/hooks
userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; // this refers to current requested document of user

  // hashing password and saving into DB
  user.password = await bcrypt.hash(user.password, Number(config.saltRounds));

  next();
});

// post save middleware/hooks to set empty string after saving to db and before sending response
userSchema.post('save', function (userData, next) {
  userData.password = '';

  next();
});

/******* Custom static methods *********/
userSchema.statics.isUserExistsByCustomId = async function (id: string) {
  return await User.findOne({ id: id }).select('+password');
};

userSchema.statics.isPasswordMatched = async function (
  password: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(password, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChange = function (
  passwordChangeTimestamp: Date,
  jwtIssueTimestamp: number,
) {
  const passwordChangedTimeInSecond =
    new Date(passwordChangeTimestamp).getTime() / 1000;

  return passwordChangedTimeInSecond > jwtIssueTimestamp;
};

userSchema.statics.isUserDeleted = function (user: TUser) {
  return user?.isDeleted;
};

userSchema.statics.isUserBlocked = function (user: TUser) {
  return user?.status === 'blocked';
};
/**
 * for document middleware: this -> current incoming/requested document
 * for query middleware: this -> current query
 * for aggregation middleware: this -> current aggregation pipeline
 */
/******* Model *********/

export const User = model<TUser, UserModel>('User', userSchema);
