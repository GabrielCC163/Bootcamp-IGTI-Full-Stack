import express from 'express';
import { promises } from 'fs';
import logger from '../logger.js';

const router = express.Router();
const readFile = promises.readFile;
const writeFile = promises.writeFile;

router.post('/', async (req, res) => {
	let account = req.body;

	try {
		let data = await readFile(global.fileName, 'utf8');
		let json = JSON.parse(data);

		account = { id: json.nextId++, ...account };
		json.accounts.push(account);

		await writeFile(global.fileName, JSON.stringify(json));
		logger.info(`POST /account - ${JSON.stringify(account)}`);

		return res.json(account);
	} catch (err) {
		logger.error(`POST /account - ${err.message}`);
		return res.status(400).send({ error: err.message });
	}
});

router.get('/', async (_, res) => {
	try {
		let data = await readFile(global.fileName, 'utf8');

		let json = JSON.parse(data);
		delete json.nextId;

		logger.info('GET /account - all');
		return res.send(json);
	} catch (err) {
		logger.error(`GET /account - all - ${err.message}`);
		return res.status(400).send({ error: err.message });
	}
});

router.get('/:id', async (req, res) => {
	try {
		let data = await readFile(global.fileName, 'utf8');

		let json = JSON.parse(data);
		const account = json.accounts.find((item) => item.id === parseInt(req.params.id));
		if (account) {
			return res.send(account);
		}

		logger.info(`GET /account/:id - ${JSON.stringify(account)}`);
		return res.send({ message: 'Account not found' });
	} catch (err) {
		logger.info(`GET /account/:id - ${err.message}`);
		return res.status(400).send({ error: err.message });
	}
});

router.delete('/:id', async (req, res) => {
	try {
		let data = await readFile(global.fileName, 'utf8');
		let json = JSON.parse(data);
		let accounts = json.accounts.filter((account) => account.id !== parseInt(req.params.id));

		json.accounts = accounts;

		await writeFile(global.fileName, JSON.stringify(json));

		logger.info(`DELETE /account/:id - ${req.params.id}`);
		return res.send({ message: `Account ${req.params.id} successfully deleted!` });
	} catch (err) {
		logger.info(`DELETE /account/:id - ${err.message}`);
		return res.status(400).send({ error: err.message });
	}
});

router.put('/', async (req, res) => {
	try {
		let newAccount = req.body;
		let data = await readFile(global.fileName, 'utf8');
		let json = JSON.parse(data);
		let index = json.accounts.findIndex((account) => account.id === newAccount.id);

		if (index === -1) {
			return res.send({ message: 'Account not found.' });
		}

		json.accounts[index].name = newAccount.name;
		json.accounts[index].balance = newAccount.balance;

		await writeFile(global.fileName, JSON.stringify(json));

		logger.info(`PUT /account - ${JSON.stringify(newAccount)}`);
		return res.send(newAccount);
	} catch (err) {
		logger.info(`PUT /account - ${err.message}`);
		return res.status(400).send({ error: err.message });
	}
});

router.post('/transaction', async (req, res) => {
	try {
		let params = req.body;
		let data = await readFile(global.fileName, 'utf8');

		let json = JSON.parse(data);
		let index = json.accounts.findIndex((account) => account.id === params.id);

		if (index === -1) {
			return res.send({ message: 'Account not found.' });
		}

		//prettier-ignore
		if ((params.value < 0) && (json.accounts[index].balance + params.value) < 0) {
			throw new Error('Não há saldo suficiente.');
		}

		json.accounts[index].balance += params.value;

		await writeFile(global.fileName, JSON.stringify(json));

		if (params.value >= 0) {
			return res.send({ message: `${params.value} successfully added to the account!` });
		}

		logger.info(`POST /account/transaction - ${JSON.stringify(params)}`);

		return res.send({ message: `${params.value} successfully subtracted from the account!` });
	} catch (err) {
		logger.info(`POST /account/transaction - ${err.message}`);
		return res.status(400).send({ error: err.message });
	}
});

//module.exports = router;
export default router;
