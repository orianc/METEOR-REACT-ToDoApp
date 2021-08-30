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
	const [hideCompleted, setHideCompleted] = useState(false);

	// note : useTracker bug quand on le déclare au dessus des hooks React...?
	const hideCompletedFilter = { isChecked: { $ne: true } };

	// dataTracker
	const tasks = useTracker(() => TasksCollection.find(hideCompleted ? hideCompletedFilter : {}, { sort: { createdAt: -1 } }).fetch());
	const user = useTracker(() => Meteor.user());
	console.log('logged as :', user);

	const toggleChecked = ({ _id, isChecked }) => {
		TasksCollection.update(_id, {
			$set: {
				isChecked: !isChecked,
			},
		});
	};

	const deleteTask = ({ _id }) => {
		TasksCollection.remove(_id);
	};

	return (
		<div>
			{user ? (
				<Fragment>
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
								<Task key={task._id} task={task} onCheckBoxClick={toggleChecked} onDeleteClick={deleteTask} />
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
