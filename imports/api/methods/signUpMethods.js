import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';

Meteor.methods({
	'signUp.register'(email, password, username) {
		check(email, String);
		check(password, String);
		check(username, String);
		if (!Accounts.findUserByEmail(email)) {
			Accounts.createUser({
				username,
				email,
				password,
			});
			return console.log('Sign Up success');
		}
		return console.log('Email already use');
	},
});
