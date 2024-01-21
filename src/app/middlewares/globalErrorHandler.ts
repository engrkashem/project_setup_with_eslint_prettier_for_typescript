/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { TErrorSources } from '../interface/errors';
import config from '../config';
import zodErrorhandler from '../errors/zodErrorHandler';
import validationErrorHandler from '../errors/ValidationErrorHandler';
import castErrorHandler from '../errors/castErrorHandler';
import duplicateKeyErrorHandler from '../errors/duplicateKeyErrorHandler';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // setting default values
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message = 'Something Went Wrong';

  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'Something Went Wrong',
    },
  ];

  if (err instanceof ZodError) {
    const formattedError = zodErrorhandler(err);
    statusCode = formattedError?.statusCode;
    message = formattedError?.message;
    errorSources = formattedError?.errorSources;
  } else if (err?.name === 'ValidationError') {
    const formattedError = validationErrorHandler(err);
    statusCode = formattedError?.statusCode;
    message = formattedError?.message;
    errorSources = formattedError?.errorSources;
  } else if (err?.name === 'CastError') {
    const formattedError = castErrorHandler(err);
    statusCode = formattedError?.statusCode;
    message = formattedError?.message;
    errorSources = formattedError?.errorSources;
  } else if (err?.code === 11000) {
    const formattedError = duplicateKeyErrorHandler(err);
    statusCode = formattedError?.statusCode;
    message = formattedError?.message;
    errorSources = formattedError?.errorSources;
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err?.name;
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err?.name;
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
  }

  // final return
  return res.status(statusCode).json({
    success: false,
    message: message,
    errorSources,
    stack: config.NODE_ENV === 'development' ? err?.stack : null,
    // err,
  });
};

export default globalErrorHandler;

/*
#### Error pattern to follow this project (chosen by developer team)####

success:
message:
errorSources:{
  path:''
  message:''
}
stack: (if development environment. never send stack in production application)
*/
