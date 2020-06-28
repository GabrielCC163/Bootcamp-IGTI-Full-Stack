import React from 'react';
import css from './installments.module.css';

export default function Installments({ children }) {
	return <div className={css.flexInstallments}>{children}</div>;
}
