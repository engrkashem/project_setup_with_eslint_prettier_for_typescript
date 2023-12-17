import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import handleAsyncRequest from '../utils/handleAsyncRequest';

const validateRequest = (schema: AnyZodObject) => {
  return handleAsyncRequest(
    async (req: Request, res: Response, next: NextFunction) => {
      await schema.parseAsync({
        body: req.body,
        cookies: req.cookies,
      });
      // if data is ok, forward to controller by calling next()
      next();
    },
  );
};

export default validateRequest;
