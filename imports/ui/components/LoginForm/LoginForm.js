import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import './LoginForm.css';

const LoginForm = (props) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const loginSubmit = () => {
		try {
			Meteor.loginWithPassword(username, password);
			console.log('login success');
		} catch (error) {
			console.error('error on login submission', error);
		}
	};

	return (
		<div className="wrapper">
			<form onSubmit={loginSubmit} className="loginForm">
				<h3>Connexion</h3>
				<input required placeholder="username" type="text" onChange={(e) => setUsername(e.target.value)} />
				<input required placeholder="password" type="password" onChange={(e) => setPassword(e.target.value)} />
				<button type="submit">Connection</button>
			</form>
		</div>
	);
};

export default LoginForm;
