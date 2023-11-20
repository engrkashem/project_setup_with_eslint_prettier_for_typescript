import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { studentRoutes } from './app/modules/students/student.route';

const app: Application = express();

//parser(middlewares)
app.use(express.json());
app.use(cors());

//application routes
// routes: api/v1/students/create-student
app.use('/api/v1/students', studentRoutes);

app.get('/', (req: Request, res: Response) => {
  //   const a = 5;
  res.send('hello');
});

// console.log(process.cwd());

export default app;
