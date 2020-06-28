import React, { Component } from 'react';
import './style.css';

export default class InputFullSalary extends Component {
	render() {
		const { label, onHandleChange } = this.props;

		return (
			<div className="input-field input-full-salary">
				<input placeholder="3500.50" id="salario" type="text" onChange={onHandleChange} maxLength="12" />
				<label htmlFor="salario">{label}</label>
			</div>
		);
	}
}
