import React from 'react';

export default function NumericInput({ label, id, value, step, min, max, handleChange }) {
	return (
		<div style={{ width: '320px', marginLeft: '10px', marginRight: '10px' }} className="input-field">
			<input id={id} type="number" step={step} min={min} max={max} value={value} onChange={handleChange} />
			<label htmlFor={id}>{label}</label>
		</div>
	);
}
