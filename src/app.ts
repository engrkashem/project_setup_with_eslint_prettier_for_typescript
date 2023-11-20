import express, { Application, Request, Response } from 'express';
import cors from 'cors';

const app: Application = express();

//parser(middlewares)
app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  //   const a = 5;
  res.send('hello');
});

// console.log(process.cwd());

export default app;
