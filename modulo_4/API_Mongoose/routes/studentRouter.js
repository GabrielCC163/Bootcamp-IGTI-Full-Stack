import express from 'express';
import { studentModel } from '../models/student.js';

const router = express();

router.get('/student', async (req, res) => {
	try {
		const student = await studentModel.find({});
		return res.send(student);
	} catch (err) {
		return res.status(500).send(err);
	}
});

router.post('/student', async (req, res) => {
	try {
		const student = new studentModel(req.body);
		await student.save();

		return res.send(student);
	} catch (err) {
		return res.status(500).send(err);
	}
});

router.delete('/student/:id', async (req, res) => {
	try {
		const student = await studentModel.findOneAndDelete({ _id: req.params.id });

		if (!student) {
			return res.status(404).send('Documento não encontrado na coleção.');
		}

		return res.status(200).send();
	} catch (err) {
		return res.status(500).send(err);
	}
});

router.put('/student/:id', async (req, res) => {
	try {
		const student = await studentModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });

		return res.send(student);
	} catch (err) {
		return res.status(500).send(err);
	}
});

export { router as studentRouter };
