import express from 'express';
import { promises } from 'fs';

const router = express.Router();
const readFile = promises.readFile;

//5 -Mostra a nota total de um aluno em uma disciplina
router.get('/totalscorebystudent', async (req, res) => {
	try {
		const { student, subject } = req.query;

		if (student === undefined || student.trim() === '') {
			return res.status(400).send({ error: 'student query param is missing' });
		}
		if (subject === undefined || subject.trim() === '') {
			return res.status(400).send({ error: 'subject query param is missing' });
		}

		let data = await readFile(global.fileName, 'utf8');
		let json = JSON.parse(data);

		const score = json.grades
			.filter((grade) => {
				return grade.student === student.trim() && grade.subject === subject.trim();
			})
			.reduce((acc, cur) => {
				return acc + cur.value;
			}, 0);

		return res.send({
			student,
			subject,
			score
		});
	} catch (err) {
		return res.status(400).send({ error: err.message });
	}
});

//6 -Mostra a média das grades de determinado subject e type
router.get('/avgscore', async (req, res) => {
	try {
		const { subject, type } = req.query;

		if (subject === undefined || subject.trim() === '') {
			return res.status(400).send({ error: 'subject query param is missing' });
		}

		if (type === undefined || type.trim() === '') {
			return res.status(400).send({ error: 'type query param is missing' });
		}

		let data = await readFile(global.fileName, 'utf8');
		let json = JSON.parse(data);

		const scores = json.grades.filter((grade) => {
			return grade.type === type.trim() && grade.subject === subject.trim();
		});

		const avgScore =
			scores.reduce((acc, cur) => {
				return acc + cur.value;
			}, 0) / scores.length;

		return res.send({
			subject,
			type,
			avgScore
		});
	} catch (err) {
		return res.status(400).send({ error: err.message });
	}
});

//7 - três melhores grades
router.get('/topthreescores', async (req, res) => {
	try {
		const { subject, type } = req.query;

		if (subject === undefined || subject.trim() === '') {
			return res.status(400).send({ error: 'subject query param is missing' });
		}

		if (type === undefined || type.trim() === '') {
			return res.status(400).send({ error: 'type query param is missing' });
		}

		let data = await readFile(global.fileName, 'utf8');
		let json = JSON.parse(data);

		let scores = json.grades
			.filter((grade) => {
				return grade.type === type.trim() && grade.subject === subject.trim();
			})
			.sort((a, b) => {
				return b.value - a.value;
			});

		scores = scores.slice(0, 3);

		return res.send({
			scores
		});
	} catch (err) {
		return res.status(400).send({ error: err.message });
	}
});

export default router;
