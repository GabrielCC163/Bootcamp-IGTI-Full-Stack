import express from 'express';
import { promises } from 'fs';
import accountsRouter from './routes/accounts.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './doc.js';
import cors from 'cors';

const app = express();
const readFile = promises.readFile;
const writeFile = promises.writeFile;

global.fileName = 'accounts.json';

app.use(express.json());
app.use(cors()); //to free a specific route, add cors() as a middleware to the route.
app.use('/account', accountsRouter);
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(3333, async () => {
	try {
		console.log("For testing, use 'runtimeArgs': ['--experimental-modules'] in launch.json");
		await readFile(global.fileName, 'utf8');
	} catch (err) {
		const initialJson = {
			nextId: 1,
			accounts: []
		};

		writeFile(global.fileName, JSON.stringify(initialJson)).catch((err) => {
			console.log(err);
		});
	}
});
