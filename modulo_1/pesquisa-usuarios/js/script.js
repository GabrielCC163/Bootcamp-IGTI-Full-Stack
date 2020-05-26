let tabUsers,
	tabStatistics,
	defaultResult,
	defaultStatistics,
	searchField,
	searchButton = null;

let countUsers,
	countFemale,
	countMale,
	countAges,
	avgAges = 0;

let allUsers,
	newUsers = [];

window.addEventListener('load', () => {
	tabUsers = document.querySelector('#tabUsers');
	tabStatistics = document.querySelector('#tabStatistics');
	defaultResult = document.querySelector('#defaultResult');
	defaultStatistics = document.querySelector('#defaultStatistics');
	searchButton = document.querySelector('#searchButton');
	searchButton.disabled = true;
	searchField = document.querySelector('#searchField');

	fetchUsers();
	handleSearch();
});

async function fetchUsers() {
	let users = localStorage.getItem('allUsers');
	allUsers = users ? JSON.parse(users) : [];

	if (allUsers.length === 0) {
		console.log('here');
		const res = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo');
		const json = await res.json();

		allUsers = json.results.map((user) => {
			const { gender, name, dob, picture } = user;

			return {
				name: `${name.first} ${name.last}`,
				gender,
				age: dob.age,
				picture: picture.large
			};
		});

		localStorage.setItem('allUsers', JSON.stringify(allUsers));
	}
}

function handleSearch() {
	searchButton.addEventListener('click', () => doSearch(searchField.value));
	searchField.addEventListener('keyup', (event) => {
		if (event.target.value !== '') {
			searchButton.disabled = false;
			if (event.keyCode === 13) {
				event.preventDefault();
				searchButton.click();
			}
		} else {
			searchButton.disabled = true;
		}
	});
}

function doSearch(text) {
	text = text.toLowerCase();
	defaultStatistics.style.display = 'none';
	defaultResult.style.display = 'none';

	newUsers = allUsers.filter(({ name }) => {
		return name.toLowerCase().includes(text);
	});

	countUsers = newUsers.length;

	if (countUsers > 0) {
		countMale = newUsers.filter(({ gender }) => gender === 'male').reduce((sum, user) => {
			return sum + 1;
		}, 0);

		countFemale = newUsers.filter(({ gender }) => gender === 'female').reduce((sum, user) => {
			return sum + 1;
		}, 0);

		countAges = newUsers.reduce((sum, { age }) => {
			return sum + age;
		}, 0);

		let numAvg = countAges / countUsers;
		// prettier-ignore
		avgAges = (Math.round(numAvg * 100) / 100).toFixed(2);
	} else {
		countMale = countFemale = countAges = avgAges = '---';
	}

	render();
}

function render() {
	renderUserList();
	renderStatistics();
}

function renderUserList() {
	let usersHTML = `
		<h5><span>${countUsers}</span> usuário(s) encontrado(s)</h5>
		<div class='users'>
	`;

	if (countUsers > 0) {
		newUsers.forEach((user) => {
			const { name, age, picture } = user;

			const userHTML = `
				<div class='user'>
					<img src="${picture}" alt="${name}">
					<span>${name}, ${age} anos</span>
				</div>
			`;

			usersHTML += userHTML;
		});
	}

	usersHTML += '</div>';
	tabUsers.innerHTML = usersHTML;
}

function renderStatistics() {
	let statisticsHTML = `
		<h5>Estatísticas</h5>
		<div class='statistics'>
			<span>Sexo masculino: ${countMale}</span>
			<span>Sexo feminino: ${countFemale}</span>
			<span>Soma das idades: ${countAges}</span>
			<span>Média das idades: ${avgAges}</span>
		</div>
	`;

	tabStatistics.innerHTML = statisticsHTML;
}
