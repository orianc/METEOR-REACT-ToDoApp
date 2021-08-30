import React, { useState, useEffect } from 'react';
import { Accounts } from 'meteor/accounts-base';
import { TasksCollection } from '../../../api/collection/TasksCollection';

const TaskForm = (props) => {
	const user = Accounts.user();

	const [newTask, setNewTask] = useState('');

	const handleChange = (e) => {
		e.preventDefault();
		setNewTask(e.target.value);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!newTask) return console.log('nothing to submit');
		try {
			TasksCollection.insert({
				text: newTask.trim(),
				isChecked: false,
				createdAt: new Date(),
				userId: user._id,
				createdBy: user.username,
			});
			console.log(`task added : ${newTask}`);
			setNewTask('');
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<form onSubmit={(e) => handleSubmit(e)}>
			<h3>New task here</h3>
			<input value={newTask} onChange={(e) => handleChange(e)} type="text" placeholder="task tilte" />
			<button type="submit">Enregister</button>
		</form>
	);
};

export default TaskForm;
