import mongoose from 'mongoose';
import { TErrorSources } from '../interface/errors';

const ValidationErrorHandler = (err: mongoose.Error.ValidationError) => {
  const statusCode = 400;

  const errorSources: TErrorSources = Object.values(err?.errors).map(
    (error: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: error?.path,
        message: error?.message,
      };
    },
  );

  return {
    statusCode,
    message: 'Data validation Error',
    errorSources,
  };
};

export default ValidationErrorHandler;
