import React, { Fragment, useState } from 'react';
// meteor
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
// data
import { TasksCollection } from '../api/collection/TasksCollection';
// components
import Task from './components/Task/Task.js';
import TaskForm from './components/TaskForm/TaskForm';
import LoginForm from './components/LoginForm/LoginForm';

export const App = () => {
	// note : useTracker bug quand on le déclare au dessus des hooks React...?
	const [hideCompleted, setHideCompleted] = useState(false);

	// user Tracker
	const user = useTracker(() => Meteor.user());

	// request filter
	const hideCompletedFilter = { isChecked: { $ne: true } };
	const userFilter = user ? { userId: user._id } : {};
	const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

	/**
	 * fetch tasks data
	 */
	const tasks = useTracker(() => {
		if (!user) {
			return [];
		}
		return TasksCollection.find(hideCompleted ? pendingOnlyFilter : userFilter, {
			sort: { createdAt: -1 },
		}).fetch();
	});

	const toggleChecked = ({ _id, isChecked }) => {
		Meteor.call('tasks.update', _id, !isChecked);

		// ---- insecure method from meteor and mini mongo
		// TasksCollection.update(_id, {
		// 	$set: {
		// 		isChecked: !isChecked,
		// 	},
		// });
	};

	const deleteTask = ({ _id }) => {
		Meteor.call('tasks.remove', _id);
		// TasksCollection.remove(_id);
	};

	return (
		<div>
			{user ? (
				<Fragment>
					<div>
						Connect as {user.username}
						<button onClick={() => Meteor.logout()}>LogOut</button>
					</div>

					<TaskForm />
					<h1>Task</h1>

					<div>
						<button className="button-filter" onClick={() => setHideCompleted(!hideCompleted)}>
							{hideCompleted ? 'Show All' : 'Only Not Completed'}
						</button>
					</div>
					{!tasks && <p>chargement...</p>}
					{tasks && (
						<ul>
							{tasks.map((task) => (
								<Task
									key={task._id}
									task={task}
									onCheckBoxClick={toggleChecked}
									onDeleteClick={deleteTask}
								/>
							))}
						</ul>
					)}
				</Fragment>
			) : (
				<LoginForm />
			)}
		</div>
	);
};

export default App;
