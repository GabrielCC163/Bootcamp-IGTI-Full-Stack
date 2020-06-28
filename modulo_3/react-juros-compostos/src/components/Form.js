import React from 'react';
import css from './form.module.css';

export default function Form({ children }) {
	return <form className={css.flexRow}>{children}</form>;
}
