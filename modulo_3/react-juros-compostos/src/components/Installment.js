import React from 'react';
import css from './installment.module.css';

export default function Installment({ month, nextValue, calculatedValue, percentage, positive }) {
	const valueClass = positive ? css.green : css.red;
	const percentageClass = positive ? css.blue : css.orange;

	return (
		<div key={month} className={css.card}>
			<div className={css.card__installment}>
				<span>{month}</span>
			</div>
			<div className={css.card__installment_info}>
				<span className={valueClass}>{nextValue}</span>
				<span className={valueClass}>
					{positive ? '+' : ''}
					{calculatedValue}
				</span>
				<span className={percentageClass}>{percentage}%</span>
			</div>
		</div>
	);
}
