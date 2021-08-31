import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import './SignUpForm.css';

const SignUpForm = (props) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');

	const loginSubmit = () => {
		try {
			Meteor.call('signUp.register', email, password, username);
			console.log('SignUpSuccess');
		} catch (error) {
			console.error('error on SignUp', error);
		}
	};

	return (
		<div className="wrapper">
			<form onSubmit={loginSubmit} className="loginForm">
				<h3>Sign Up</h3>
				<input
					required
					placeholder="username"
					type="text"
					onChange={(e) => setUsername(e.target.value)}
				/>
				<input
					required
					placeholder="email"
					type="email"
					onChange={(e) => setEmail(e.target.value)}
				/>
				<input
					required
					placeholder="password"
					type="password"
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button type="submit">Submit</button>
			</form>
		</div>
	);
};

export default SignUpForm;
