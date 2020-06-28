import React, { Component } from 'react';
import './style.css';

export default class InputReadOnly extends Component {
	render() {
		let { id, label, classColor, inputValue = 0, percValue } = this.props;

		let InputFormatedValue = percValue
			? `R$ ${parseFloat(inputValue).toFixed(2)} (${parseFloat(percValue).toFixed(2)})%`
			: `R$ ${parseFloat(inputValue).toFixed(2)}`;
		return (
			<div className="input-field input-read-only">
				<input id={id} type="text" disabled className={classColor} value={InputFormatedValue} />
				<label htmlFor={id}>{label}</label>
			</div>
		);
	}
}
