import React, { Component } from 'react';
import User from './User';

export default class Users extends Component {
	constructor() {
		super();

		this.state = {
			secondsVisible: 0
		};

		this.interval = null;
	}

	componentDidMount() {
		console.log('component did mount de User');

		this.interval = setInterval(() => {
			const { secondsVisible } = this.state;
			this.setState({
				secondsVisible: secondsVisible + 1
			});
		}, 1000);
	}

	componentWillUnmount() {
		console.log('component did will unmount de User');
		clearInterval(this.interval);
	}

	render() {
		const { secondsVisible } = this.state;
		const { users } = this.props;

		return (
			<div>
				<p>Componente Users visível por {secondsVisible}</p>
				<ul>
					{users.map((user) => {
						const { login } = user;
						return (
							<li key={login.uuid}>
								<User user={user} />
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}
