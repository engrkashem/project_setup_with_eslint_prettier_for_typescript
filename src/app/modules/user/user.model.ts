import { Schema, model } from 'mongoose';
import { TUser } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<TUser>(
  {
    id: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    needsPasswordChange: { type: Boolean, default: true },
    role: {
      type: String,
      enum: ['admin', 'faculty', 'student'],
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
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

/**
 * for document middleware: this -> current incoming/requested document
 * for query middleware: this -> current query
 * for aggregation middleware: this -> current aggregation pipeline
 */
/********************* Document Middleware end *******************************/

export const User = model<TUser>('User', userSchema);
