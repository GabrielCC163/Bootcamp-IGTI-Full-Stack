import express from 'express';
import accountModel from '../models/account.js';
import { promises } from 'fs';

const router = express.Router();
const readFile = promises.readFile;

/**
 * 1 - Importa os registros de accounts.json, permitindo resetar o banco
 * @param Boolean reset (false => apenas insere os registros de accounts.json)
 * @returns message
 */
router.post('/insertdefault', async (req, res) => {
	try {
		if (req.body.reset) {
			await accountModel.deleteMany({});
		}

		let data = await readFile('accounts.json', 'utf8');
		let accounts = JSON.parse(data);

		for (let i in accounts) {
			const account = new accountModel(accounts[i]);
			await account.save();
		}

		return res.status(200).send({ success: 'API resetada com sucesso.' });
	} catch (err) {
		return res.status(400).send({ error: err.message });
	}
});

/**
 * Busca conta pelo nome do cliente.
 * @param String nome
 * @returns Object account
 */
router.get('/client', async (req, res) => {
	const { nome } = req.query;

	if (!nome || typeof nome !== 'string') {
		return res.status(500).send({ error: 'Informe corretamente o nome do cliente.' });
	}

	try {
		const account = await accountModel.findOne(
			{
				name: nome
			},
			{ _id: 0, __v: 0 }
		);

		if (!account) {
			return res.status(400).send({ message: 'Conta não encontrada.' });
		}

		return res.send(account);
	} catch (err) {
		return res.status(500).send({ error: err.message });
	}
});

/**
 * 4 - Faz um depósito em uma conta.
 * @param Int agencia, Int conta, Float valor
 * @returns Object {previousBalance, currentBalance} (saldo anterior e atual)
 */
router.put('/deposit', async (req, res) => {
	const { agencia, conta, valor } = req.body;

	if (!agencia || !conta) {
		return res.status(500).send({ error: 'Obrigatório agência e conta.' });
	}

	if (!valor || typeof valor !== 'number' || valor < 0) {
		return res.status(500).send({ error: 'Informe corretamente o valor a ser depositado.' });
	}

	try {
		const account = await accountModel.findOneAndUpdate(
			{
				agencia,
				conta
			},
			{
				$inc: { balance: valor }
			},
			{ useFindAndModify: false }
		);

		if (!account) {
			return res.status(500).send({ error: 'Conta não encontrada.' });
		}

		return res.status(200).send({
			previousBalance: account.balance,
			currentBalance: account.balance + valor
		});
	} catch (err) {
		return res.status(400).send({ error: err.message });
	}
});

/**
 * 5 - Faz um saque em uma conta. Diminui 1 
 * @param Int agencia, Int conta, Float valor
 * @returns Object {previousBalance, currentBalance} (saldo anterior e atual)
 */
router.put('/withdraw', async (req, res) => {
	const { agencia, conta, valor } = req.body;

	if (!agencia || !conta) {
		return res.status(500).send({ error: 'Obrigatório agência e conta.' });
	}

	if (!valor || valor < 0 || typeof valor !== 'number') {
		return res.status(500).send({ error: 'Informe corretamente o valor para o saque.' });
	}

	try {
		const account = await accountModel.findOne({
			agencia,
			conta
		});

		if (!account) {
			return res.status(500).send({ error: 'Conta não encontrada.' });
		}

		const withdraw = valor + 1;

		if (account.balance - withdraw < 0) {
			return res.status(500).send({ message: 'Saldo insuficiente.', saldo: account.balance });
		}

		await accountModel.updateOne(
			{
				agencia,
				conta
			},
			{
				$inc: { balance: -withdraw }
			}
		);

		return res.status(200).send({
			previousBalance: account.balance,
			currentBalance: account.balance - withdraw
		});
	} catch (err) {
		return res.status(400).send({ error: err.message });
	}
});

/**
 * 6 - Consulta o saldo de uma conta.
 * @param Int agencia, Int conta
 * @returns Object {Saldo: account.balance}
 */
router.get('/balance', async (req, res) => {
	const { agencia, conta } = req.query;

	if (!agencia || !conta) {
		return res.status(500).send({ error: 'Obrigatório agência e conta.' });
	}

	try {
		const account = await accountModel.findOne({
			agencia,
			conta
		});

		if (!account) {
			return res.status(500).send({ error: 'Conta não encontrada.' });
		}

		return res.status(200).send({ Saldo: account.balance });
	} catch (err) {
		return res.status(400).send({ error: err.message });
	}
});

/**
 * 7 - Exclui uma conta.
 * @param Int agencia, Int conta
 * @returns Object {agência, contas: qtde de contas da agência}
 */
router.delete('/delete', async (req, res) => {
	const { agencia, conta } = req.query;

	if (!agencia || !conta) {
		return res.status(500).send({ error: 'Obrigatório agência e conta.' });
	}

	try {
		const deletedAccount = await accountModel.findOneAndDelete({
			agencia,
			conta
		});

		if (!deletedAccount) {
			return res.status(500).send({ error: 'Conta não encontrada.' });
		}

		const accounts = await accountModel.find({
			agencia
		});

		return res.send({ agencia, contas: accounts.length });
	} catch (err) {
		return res.status(400).send({ error: err.message });
	}
});

/**
 * 8 - Faz transferência entre contas. Debita 8 da conta origem caso for entre agências diferentes.
 * @param Int contaOrigem, Int contaDestino, Float valor
 * @returns Object {saldo da conta origem, saldo da conta destino}
 */
router.put('/transfer', async (req, res) => {
	const { contaOrigem, contaDestino, valor } = req.body;

	if (!contaOrigem || !contaDestino) {
		return res.status(500).send({ error: 'Obrigatório contaOrigem e contaDestino.' });
	}

	if (!valor || valor < 0 || typeof valor !== 'number') {
		return res.status(500).send({ error: 'Informe corretamente o valor para a transferência.' });
	}
	try {
		const accountOrigin = await accountModel.findOne({
			conta: contaOrigem
		});

		if (!accountOrigin) {
			return res.status(500).send({ error: 'Conta de origem não encontrada.' });
		}

		const accountDestiny = await accountModel.findOne({
			conta: contaDestino
		});

		if (!accountDestiny) {
			return res.status(500).send({ error: 'Conta de destino não encontrada.' });
		}

		let decreasedValue = valor;
		if (accountOrigin.agencia !== accountDestiny.agencia) {
			decreasedValue += 8;
		}

		if (accountOrigin.balance - valor < 0) {
			return res.status(500).send({ message: 'Saldo insuficiente.', saldo: accountOrigin.balance });
		}

		await accountModel.updateOne(
			{
				conta: contaOrigem
			},
			{
				$inc: { balance: -decreasedValue }
			}
		);

		await accountModel.updateOne(
			{
				conta: contaDestino
			},
			{
				$inc: { balance: valor }
			}
		);

		return res.status(200).send({
			'Saldo da conta origem': accountOrigin.balance - decreasedValue,
			'Saldo da conta destino': accountDestiny.balance + valor
		});
	} catch (err) {
		return res.status(400).send({ error: err.message });
	}
});

/**
 * 9 - Consulta a média do saldo dos clientes de determinada agência.
 * @param Int agencia
 * @returns Object {agencia, Saldo médio}
 */
router.get('/avgbalance', async (req, res) => {
	const { agencia } = req.query;

	if (!agencia) {
		return res.status(500).send({ error: 'Obrigatório número da agência.' });
	}

	try {
		const accounts = await accountModel.find({
			agencia
		});

		if (accounts.length === 0) {
			return res.status(500).send({ error: `Nenhuma conta encontrada para a agência ${agencia}.` });
		}

		const avgBalance =
			accounts.reduce((sum, account) => {
				return sum + account.balance;
			}, 0) / accounts.length;

		return res.status(200).send({
			agencia,
			'Saldo médio': parseFloat(parseFloat(avgBalance).toFixed(2))
		});
	} catch (err) {
		return res.status(400).send({ error: err.message });
	}
});

/**
 * 10 - Consulta os clientes com menor saldo em conta. Ordem crescente pelo saldo.
 * @param Int quantidade
 * @returns accounts
 */
router.get('/lowest', async (req, res) => {
	let { quantidade = 0 } = req.query;

	quantidade = parseInt(quantidade);

	if (quantidade < 0) {
		return res.status(500).send({ error: 'Informe corretamente a quantidade de registros para a busca.' });
	}

	try {
		const accounts = await accountModel
			.find({}, { _id: 0, agencia: 1, conta: 1, name: 1, balance: 1 })
			.sort({ balance: 1 })
			.limit(quantidade);

		if (accounts.length === 0) {
			return res.status(400).send({ message: 'Nenhuma conta cadastrada.' });
		}

		return res.send(accounts);
	} catch (err) {
		return res.status(400).send({ error: err.message });
	}
});

/**
 * 11 - Consulta clientes maior saldo em conta. Ordem decrescente pelo saldo.
 * @param Int quantidade
 * @returns Array accounts
 */
router.get('/highest', async (req, res) => {
	let { quantidade = 0 } = req.query;

	quantidade = parseInt(quantidade);

	if (quantidade < 0) {
		return res.status(500).send({ error: 'Informe corretamente a quantidade de registros para a busca.' });
	}

	try {
		const accounts = await accountModel
			.find({}, { _id: 0, agencia: 1, conta: 1, name: 1, balance: 1 })
			.sort({ balance: -1, name: 1 })
			.limit(quantidade);

		if (accounts.length === 0) {
			return res.status(400).send({ message: 'Nenhuma conta cadastrada.' });
		}

		return res.send(accounts);
	} catch (err) {
		return res.status(400).send({ error: err.message });
	}
});

/**
 * 12 - Transfere o cliente com maior saldo em conta de cada agência, para a agência private (99).
 * @returns accounts
 */
router.put('/private', async (req, res) => {
	try {
		const agencies = await accountModel.distinct('agencia', {
			agencia: {
				$ne: 99
			}
		});

		if (agencies.length === 0) {
			return res.status(400).send({ message: 'Nenhuma conta comum encontrada.' });
		}

		const accounts = [];
		for (let i in agencies) {
			const { agencia, conta, name, balance } = await accountModel
				.findOneAndUpdate(
					{
						agencia: agencies[i]
					},
					{
						agencia: 99
					},
					{ useFindAndModify: false }
				)
				.sort({ balance: -1 });

			accounts.push({
				agencia,
				conta,
				name,
				balance
			});
		}

		return res.status(200).send(accounts);
	} catch (err) {
		return res.status(400).send({ error: err.message });
	}
});

export default router;
