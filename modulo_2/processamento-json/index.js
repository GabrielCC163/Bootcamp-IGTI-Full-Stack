import express from 'express';
import fs, { promises } from 'fs';

const app = express();

app.use(express.json());

const readFile = promises.readFile;
const writeFile = promises.writeFile;

const getCidades = async () => {
	let cities;
	try {
		cities = await readFile('./public/files/Cidades.json', 'utf8');
	} catch (err) {
		console.log(err);
	}
	return JSON.parse(cities);
};

const getEstados = async () => {
	let states;
	try {
		states = await readFile('./public/files/Estados.json', 'utf8');
	} catch (err) {
		console.log(err);
	}
	return JSON.parse(states);
};

//1
const createStateFile = async () => {
	let estados, cidades;
	try {
		estados = await getEstados();
		cidades = await getCidades();

		estados.forEach((estado) => {
			const { ID, Sigla } = estado;
			if (!fs.existsSync(`./public/results/01/${Sigla}.json`)) {
				let CitiesFromState = cidades
					.filter((cidade) => {
						return cidade.Estado === ID;
					})
					.map((cidade) => {
						return cidade.Nome;
					});

				writeFile(`./public/results/01/${Sigla}.json`, JSON.stringify(CitiesFromState)).catch((err) => {
					console.log(err);
				});
			}
		});
	} catch (err) {
		console.log(err);
	}
};

//2.1
const qtCitiesState = async (state) => {
	let cities;
	try {
		cities = await readFile(`./public/results/01/${state}.json`, 'utf8');
	} catch (err) {
		console.log(err);
	}
	return JSON.parse(cities).length;
};

//2.2
const qtCitiesByState = async () => {
	console.log('2 - Qtde de cidades de cada estado: ');
	let addItems = true;
	try {
		if (!fs.existsSync('./public/results/02/qt_cities_by_state.json')) {
			const initialJson = {
				states: []
			};

			await writeFile('./public/results/02/qt_cities_by_state.json', JSON.stringify(initialJson));
		} else {
			let checkData = await readFile('./public/results/02/qt_cities_by_state.json', 'utf8');
			if (JSON.parse(checkData).states.length > 0) {
				addItems = false;
			}
		}

		try {
			let estados = await getEstados();

			for (let i = 0; i < estados.length; i++) {
				const Sigla = estados[i].Sigla;
				const qt = await qtCitiesState(Sigla);

				//DO NOT PUT IT INSIDE A FOREACH
				if (addItems) {
					let data = await readFile('./public/results/02/qt_cities_by_state.json', 'utf8');
					let json = JSON.parse(data);

					let obj = {
						state: Sigla,
						qt_cities: qt
					};

					json.states.push(obj);

					await writeFile('./public/results/02/qt_cities_by_state.json', JSON.stringify(json));
				}
				//END

				console.log(`Qtde de cidades de ${Sigla}: ${qt}`);
			}
		} catch (err) {
			console.log(err);
		}
	} catch (err) {
		console.log(err);
	}
};

//3
const fiveStatesMoreCities = async () => {
	console.log('3 - UF dos cinco estados que mais possuem cidades: ');
	try {
		let estados_cidades = await readFile('./public/results/02/qt_cities_by_state.json', 'utf8');
		let units = JSON.parse(estados_cidades).states;
		units = units.sort((a, b) => {
			return b.qt_cities - a.qt_cities;
		});
		units = units.slice(0, 5);
		console.log(units);
		return units;
	} catch (err) {
		console.log(err);
	}
};

//4
const fiveStatesLessCities = async () => {
	console.log('4 - UF dos cinco estados que menos possuem cidades: ');
	try {
		let estados_cidades = await readFile('./public/results/02/qt_cities_by_state.json', 'utf8');
		let units = JSON.parse(estados_cidades).states;
		units = units.sort((a, b) => {
			return b.qt_cities - a.qt_cities;
		});
		units = units.slice(-5);
		console.log(units);
		return units;
	} catch (err) {
		console.log(err);
	}
};

//5
const getCityGreaterNameByState = async () => {
	console.log('5 - Cidades de maior nome de cada estado: ');
	let states = await getEstados();
	for (let i = 0; i < states.length; i++) {
		const Sigla = states[i].Sigla;
		let cities = await readFile(`./public/results/01/${Sigla}.json`);
		let city = JSON.parse(cities).sort((a, b) => {
			if (b.length - a.length === 0) {
				return a.localeCompare(b); //sort alphabetically when equal size
			}
			return b.length - a.length; //sort by size
		})[0];
		console.log(`${city} - ${Sigla}`);

		if (!fs.existsSync(`./public/results/05/${Sigla}_city_greater_name.json`)) {
			let obj = { city };
			await writeFile(`./public/results/05/${Sigla}_city_greater_name.json`, JSON.stringify(obj));
		}
	}
};

//6
const getCitySmallerNameByState = async () => {
	console.log('6 - Cidades de menor nome de cada estado: ');
	let states = await getEstados();
	for (let i = 0; i < states.length; i++) {
		const Sigla = states[i].Sigla;
		let cities = await readFile(`./public/results/01/${Sigla}.json`);
		let city = JSON.parse(cities).sort((a, b) => {
			if (a.length - b.length === 0) {
				return a.localeCompare(b); //sort alphabetically when equal size
			}
			return a.length - b.length; //sort by size
		})[0];
		console.log(`${city} - ${Sigla}`);

		if (!fs.existsSync(`./public/results/05/${Sigla}_city_smaller_name.json`)) {
			let obj = { city };
			await writeFile(`./public/results/05/${Sigla}_city_smaller_name.json`, JSON.stringify(obj));
		}
	}
};

//7
const getCityGreaterName = async () => {
	console.log('\n7 - Cidade de maior nome entre todos os estados: ');
	let cities = [];
	let states = await getEstados();
	for (let i = 0; i < states.length; i++) {
		const Sigla = states[i].Sigla;
		let city = await readFile(`./public/results/05/${Sigla}_city_greater_name.json`, 'utf8');
		cities.push(JSON.parse(city).city);
	}

	let city_greater_name = cities.sort((a, b) => {
		if (b.length - a.length === 0) {
			return a.localeCompare(b); //sort alphabetically when equal size
		}
		return b.length - a.length; //sort by size
	})[0];
	console.log(city_greater_name);
};

//8
const getCitySmallerName = async () => {
	console.log('\n8 - Cidade de menor nome entre todos os estados: ');
	let cities = [];
	let states = await getEstados();
	for (let i = 0; i < states.length; i++) {
		const Sigla = states[i].Sigla;
		let city = await readFile(`./public/results/05/${Sigla}_city_smaller_name.json`, 'utf8');
		cities.push(JSON.parse(city).city);
	}

	let city_smaller_name = cities.sort((a, b) => {
		if (b.length - a.length === 0) {
			return a.localeCompare(b); //sort alphabetically when equal size
		}
		return a.length - b.length; //sort by size
	})[0];
	console.log(city_smaller_name);
};

//Exec all
(async () => {
	//1
	await createStateFile();

	//2
	await qtCitiesByState();

	//3
	await fiveStatesMoreCities();

	//4
	await fiveStatesLessCities();

	//5
	await getCityGreaterNameByState();

	//6
	await getCitySmallerNameByState();

	//7
	await getCityGreaterName();

	//8
	await getCitySmallerName();
})();

app.listen(3333);
