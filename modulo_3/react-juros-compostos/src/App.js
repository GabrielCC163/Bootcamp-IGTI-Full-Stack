import React, { useState, useEffect } from 'react';
import Form from './components/Form';
import NumericInput from './components/NumericInput';
import Installments from './components/Installments';
import Installment from './components/Installment';

export default function App() {
	const [ installments, setInstallments ] = useState([]);
	const [ months, setMonths ] = useState([ 1 ]);
	const [ positive, setPositive ] = useState(true);
	const [ amountValue, setAmountValue ] = useState(1000);
	const [ rateValue, setRateValue ] = useState(0.5);
	const [ monthsValue, setMonthsValue ] = useState(1);

	useEffect(
		() => {
			const newInstallments = [];

			//Result = C * (1 + i)^t
			for (let i = 1; i <= months.length; i++) {
				//prettier-ignore
				let nextValue = amountValue * (Math.pow(1 + (rateValue / 100), i));
				let calculatedValue = nextValue - amountValue;
				//prettier-ignore
				let percentage = (calculatedValue * 100) / amountValue;

				const result = {
					nextValue: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(nextValue),
					calculatedValue: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
						calculatedValue
					),
					percentage: percentage.toFixed(2)
				};

				newInstallments.push(result);
			}
			setInstallments(newInstallments);
		},
		[ amountValue, rateValue, monthsValue, months.length ]
	);

	const handleChangeAmount = (event) => {
		const newAmount = parseFloat(event.target.value);
		setAmountValue(newAmount);
	};

	const handleChangeRate = (event) => {
		const newRate = parseFloat(event.target.value);
		setRateValue(newRate);
		if (newRate < 0) {
			setPositive(false);
		} else {
			setPositive(true);
		}
	};

	const handleChangeMonths = (event) => {
		const qtMonths = parseInt(event.target.value);
		if (qtMonths > 36) {
			return;
		}
		const newQt = Array.from({ length: qtMonths }, (v, i) => ++i);
		setMonths(newQt);
		setMonthsValue(qtMonths);
	};

	return (
		<div className="container">
			<h1>React - Juros Compostos</h1>
			<Form>
				<NumericInput
					label="Montante inicial:"
					id="montanteInicial"
					value={amountValue}
					step="100"
					min="100"
					max="100000"
					handleChange={handleChangeAmount}
				/>
				<NumericInput
					label="Taxa de juros mensal:"
					id="juros"
					value={rateValue}
					step="0.5"
					min="-12"
					max="12"
					handleChange={handleChangeRate}
				/>
				<NumericInput
					label="Período em meses (max. 36):"
					id="periodo"
					value={monthsValue}
					step="1"
					min="1"
					max="36"
					handleChange={handleChangeMonths}
				/>
			</Form>
			<Installments>
				{months.map((month) => {
					return (
						<Installment
							key={month}
							month={month}
							nextValue={installments[month - 1] ? installments[month - 1].nextValue : ''}
							calculatedValue={installments[month - 1] ? installments[month - 1].calculatedValue : ''}
							percentage={installments[month - 1] ? installments[month - 1].percentage : ''}
							positive={positive}
						/>
					);
				})}
			</Installments>
		</div>
	);
}
