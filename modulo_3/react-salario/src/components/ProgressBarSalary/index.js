import React, { Component } from 'react';

export default class ProgressBarSalary extends Component {
	render() {
		const { orangeValue = '0', redValue = '0', greenValue = '100' } = this.props;

		return (
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					width: '100%',
					paddingLeft: '20px',
					paddingRight: '20px'
				}}
			>
				<div
					style={{
						marginTop: '40px',
						width: orangeValue + '%',
						height: '20px',
						backgroundColor: 'orange'
					}}
				/>
				<div
					style={{
						marginTop: '40px',
						width: redValue + '%',
						height: '20px',
						backgroundColor: 'red'
					}}
				/>
				<div
					style={{
						marginTop: '40px',
						width: greenValue + '%',
						height: '20px',
						backgroundColor: 'green'
					}}
				/>
			</div>
		);
	}
}
