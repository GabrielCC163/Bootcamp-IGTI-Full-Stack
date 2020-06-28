import express from 'express';
import gradesRouter from './routes/grades.js';
import reportsRouter from './routes/reports.js';
import cors from 'cors';

const app = express();

global.fileName = 'grades.json';

app.use(express.json());
app.use(cors());
app.use('/grade', gradesRouter);
app.use('/report', reportsRouter);

app.listen(3333);
