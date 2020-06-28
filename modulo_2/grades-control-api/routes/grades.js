import express from 'express';
import moment from 'moment';
import { promises } from 'fs';

const router = express.Router();
const readFile = promises.readFile;
const writeFile = promises.writeFile;

//1 - Criar grade
router.post('/', async (req, res) => {
	try {
		let grade = req.body;
		let data = await readFile(global.fileName, 'utf8');
		let json = JSON.parse(data);

		grade.timestamp = moment().format();
		grade = { id: json.nextId++, ...grade };
		json.grades.push(grade);

		await writeFile(global.fileName, JSON.stringify(json));

		return res.json(grade);
	} catch (err) {
		return res.status(400).send({ error: err.message });
	}
});

//2 - Atualizar grade
router.put('/', async (req, res) => {
	try {
		let newGrade = req.body;
		let data = await readFile(global.fileName, 'utf8');
		let json = JSON.parse(data);
		let index = json.grades.findIndex((grade) => grade.id === newGrade.id);

		if (index === -1) {
			return res.send({ message: 'Grade not found.' });
		}

		if (newGrade.student !== undefined) {
			json.grades[index].student = newGrade.student.trim();
		}

		if (newGrade.subject !== undefined) {
			json.grades[index].subject = newGrade.subject.trim();
		}

		if (newGrade.type !== undefined) {
			json.grades[index].type = newGrade.type.trim();
		}

		if (newGrade.value !== undefined) {
			json.grades[index].value = newGrade.value;
		}

		await writeFile(global.fileName, JSON.stringify(json));

		return res.send(newGrade);
	} catch (err) {
		return res.status(400).send({ error: err.message });
	}
});

//3 - Excluir grade
router.delete('/:id', async (req, res) => {
	try {
		let data = await readFile(global.fileName, 'utf8');
		let json = JSON.parse(data);
		let grades = json.grades.filter((grade) => grade.id !== parseInt(req.params.id));

		json.grades = grades;

		await writeFile(global.fileName, JSON.stringify(json));

		return res.send({ message: `Grade ${req.params.id} successfully deleted!` });
	} catch (err) {
		return res.status(400).send({ error: err.message });
	}
});

//4 - Mostra grade específica
router.get('/:id', async (req, res) => {
	try {
		let data = await readFile(global.fileName, 'utf8');
		let json = JSON.parse(data);

		const grade = json.grades.find((item) => item.id === parseInt(req.params.id));
		if (grade) {
			return res.send(grade);
		}

		return res.send({ message: 'Grade not found' });
	} catch (err) {
		return res.status(400).send({ error: err.message });
	}
});

export default router;
