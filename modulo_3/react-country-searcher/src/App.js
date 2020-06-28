import React, { useState, useEffect } from 'react';
import Countries from './components/countries/Countries';
import Header from './components/header/Header';

export default function App() {
	const [ allCountries, setAllCountries ] = useState([]);
	const [ filteredCountries, setFilteredCountries ] = useState([]);
	const [ filteredPopulation, setFilteredPopulation ] = useState(0);
	const [ userFilter, setUserFilter ] = useState('');
	const [ isFetching, setIsFetching ] = useState(true);

	useEffect(() => {
		const getCountries = async () => {
			const res = await fetch('http://restcountries.eu/rest/v2/all');
			let json = await res.json();
			json = json.map(({ name, numericCode, flag, population }) => {
				return {
					id: numericCode,
					name,
					filterName: name.toLowerCase(),
					flag,
					population
				};
			});

			setAllCountries(json);
			setFilteredCountries(Object.assign([], json));
			setIsFetching(false);
		};

		getCountries();
	}, []);

	const calculateTotalPopulationFrom = (countries) => {
		const totalPopulation = countries.reduce((acc, cur) => {
			return acc + cur.population;
		}, 0);

		return totalPopulation;
	};

	const handleChangeFilter = (newText) => {
		setUserFilter(newText);

		const filterLowerCase = newText.toLowerCase();

		const filteredCountries = allCountries.filter((country) => {
			return country.filterName.includes(filterLowerCase);
		});

		const filteredPopulation = calculateTotalPopulationFrom(filteredCountries);

		setFilteredCountries(filteredCountries);
		setFilteredPopulation(filteredPopulation);
	};

	return (
		<div className="container">
			<h1 style={styles.centeredTitle}>React countries</h1>

			<Header
				filter={userFilter}
				countryCount={filteredCountries.length}
				totalPopulation={filteredPopulation}
				onChangeFilter={handleChangeFilter}
			/>

			{isFetching ? <div>Loading...</div> : <Countries countries={filteredCountries} />}
		</div>
	);
}

const styles = {
	centeredTitle: {
		textAlign: 'center'
	}
};
