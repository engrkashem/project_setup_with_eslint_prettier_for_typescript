/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { studentRoutes } from './app/modules/students/student.route';
import { userRoutes } from './app/modules/user/user.route';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';

const app: Application = express();

//parser(middlewares)
app.use(express.json());
app.use(cors());

//application routes
// routes: api/v1/students/create-student
app.use('/api/v1', router);

const test = (req: Request, res: Response) => {
  res.send('PH University Server is running..');
};

app.get('/', test);

app.use(globalErrorHandler);

// not found middleware
app.use(notFound);

export default app;
