import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import accountsRouter from './routes/accounts.js';

(async () => {
	try {
		await mongoose.connect(
			'mongodb+srv://grodrigues:a1nDj3HdSqA4rFwy@my-bank-api.tipdv.mongodb.net/mybankapi?retryWrites=true&w=majority',
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
app.use(cors());
app.use('/account', accountsRouter);

app.listen(process.env.PORT || 3333, () => {
	console.log('API iniciada');
});
