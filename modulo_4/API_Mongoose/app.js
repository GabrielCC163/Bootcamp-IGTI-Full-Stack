import express from 'express';
import mongoose from 'mongoose';

import { studentRouter } from './routes/studentRouter.js';

(async () => {
	try {
		await mongoose.connect(
			'mongodb+srv://grodrigues:rgSjAGktphkO74xp@api-mongoose.f1aum.mongodb.net/apimongoose?retryWrites=true&w=majority',
			{
				useNewUrlParser: true,
				useUnifiedTopology: true
			}
		);
	} catch (error) {
		console.log('Erro ao conectar no MongoDB');
	}
})();

const app = express();

app.use(express.json());
app.use(studentRouter);

app.listen(process.env.PORT || 3000, () => {
	console.log('API iniciada');
});
