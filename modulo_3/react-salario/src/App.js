import React, { Component } from 'react';
import InputFullSalary from './components/InputFullSalary';
import InputReadOnly from './components/InputReadOnly';
import ProgressBarSalary from './components/ProgressBarSalary';
import { calculateSalaryFrom } from './helpers/calculateSalaryFrom';
import { calculatePercentages } from './helpers/calculatePercentages';

export default class App extends Component {
	constructor() {
		super();

		this.state = {
			baseINSS: 0,
			discountINSS: 0,
			baseIRPF: 0,
			discountIRPF: 0,
			netSalary: 0,
			percDiscountINSS: 0,
			percDiscountIRPF: 0,
			percNetSalary: 0
		};
	}

	handleChange = (event) => {
		let salary =
			event.target.value === '' || isNaN(parseFloat(event.target.value)) ? 0 : parseFloat(event.target.value);

		let { baseINSS = 0, discountINSS = 0, baseIRPF = 0, discountIRPF = 0, netSalary = 0 } = calculateSalaryFrom(
			salary
		);

		this.setState({
			baseINSS,
			discountINSS,
			baseIRPF,
			discountIRPF: discountIRPF,
			netSalary
		});

		let { percDiscountINSS, percDiscountIRPF, percNetSalary } = calculatePercentages(
			salary,
			discountINSS,
			discountIRPF,
			netSalary
		);

		this.setState({
			percDiscountINSS,
			percDiscountIRPF,
			percNetSalary
		});
	};

	render() {
		const {
			baseINSS,
			discountINSS,
			baseIRPF,
			discountIRPF,
			netSalary,
			percDiscountINSS,
			percDiscountIRPF,
			percNetSalary
		} = this.state;

		return (
			<div className="main">
				<h1>React Salário</h1>
				<div className="main__items">
					<InputFullSalary label="Salário Bruto:" onHandleChange={this.handleChange} />

					<InputReadOnly id="baseINSS" label="Base INSS:" classColor="color-black" inputValue={baseINSS} />
					<InputReadOnly
						id="descontoINSS"
						label="Desconto INSS:"
						classColor="color-orange"
						inputValue={discountINSS}
						percValue={percDiscountINSS}
					/>
					<InputReadOnly id="baseIRPF" label="Base IRPF:" classColor="color-black" inputValue={baseIRPF} />
					<InputReadOnly
						id="descontoIRPF"
						label="Desconto IRPF:"
						classColor="color-red"
						inputValue={discountIRPF}
						percValue={percDiscountIRPF}
					/>
					<InputReadOnly
						id="salarioLiquido"
						label="Salário líquido:"
						classColor="color-green"
						inputValue={netSalary}
						percValue={percNetSalary}
					/>
				</div>
				<ProgressBarSalary
					orangeValue={percDiscountINSS}
					redValue={percDiscountIRPF}
					greenValue={percNetSalary}
				/>
			</div>
		);
	}
}
