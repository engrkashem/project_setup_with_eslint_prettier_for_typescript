import { Schema } from 'mongoose';
import TUserName from '../interface/userName';

const userNameSchema = new Schema<TUserName>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [20, 'First name length must be less than or equal to 20'],
    },
    middleName: { type: String, trim: true },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [3, 'Last name must contains at least 3 characters'],
    },
  },
  {
    _id: false,
  },
);

export default userNameSchema;

// validate: {
//   validator: function (value: string) {
//     const idealFirstNameFormat =
//       value.charAt(0).toUpperCase() + value.slice(1);
//     return idealFirstNameFormat === value;
//   },
//   message: 'Fist name must be capitalize',
// },

// validate: {
//   validator: (value: string) => validator.isAlpha(value),
//   message: '{VALUE} is invalid. Remove numeric character.',
// },
