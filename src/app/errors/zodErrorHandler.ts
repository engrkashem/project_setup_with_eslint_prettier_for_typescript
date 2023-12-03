import { ZodError, ZodIssue } from 'zod';
import { TErrorSource } from '../interface/errors';
const zodErrorhandler = (err: ZodError) => {
  const statusCode = 400;

  const errorSources: TErrorSource = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue?.message,
    };
  });

  return {
    statusCode,
    message: 'Data validation Error',
    errorSources,
  };
};

export default zodErrorhandler;
