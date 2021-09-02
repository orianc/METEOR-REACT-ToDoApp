import React, { Fragment, useState } from 'react';
// meteor
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
// graphQL
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

// data
import { TasksCollection } from '../api/collection/TasksCollection';
// components
import Task from './components/Task/Task.js';
import TaskForm from './components/TaskForm/TaskForm';
import LoginForm from './components/LoginForm/LoginForm';
import SignUpForm from './components/SignUpForm/SignUpForm';

const taskQuery = gql`
	query Tasks {
		tasks {
			_id
			text
		}
	}
`;

export const App = () => {
	const { data, loading, refetch } = useQuery(taskQuery);
	// note : useTracker bug quand on le déclare au dessus des hooks React...?
	const [hideCompleted, setHideCompleted] = useState(false);
	const USER = useTracker(() => Meteor.user());

	// request filter
	const hideCompletedFilter = { isChecked: { $ne: true } };
	const userFilter = USER ? { userId: USER._id } : {};
	const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

	const { tasksStatus, pendingTasksCount, isLoading } = useTracker(() => {
		const noDataAvailable = { tasks: [], pendingTasksCount: 0 };
		if (!USER) {
			console.log('nodata');
			return noDataAvailable;
		}

		const handler = Meteor.subscribe('tasks');
		if (!handler.ready || loading) {
			console.log('loading');
			return { ...noDataAvailable, isLoading: true };
		}

		const tasksStatus = TasksCollection.find(
			hideCompleted ? pendingOnlyFilter : userFilter,
			{
				sort: { createdAt: -1 },
			},
		).fetch();
		const pendingTasksCount = TasksCollection.find(pendingOnlyFilter).count();
		console.log('tasks fetch');
		return { tasksStatus, pendingTasksCount };
	});

	const tasksData = (data && data.tasks) || [];
	const tasks = tasksData.map(({ _id, ...rest }) => ({
		_id,
		...rest,
		isChecked: (tasksStatus.find((t) => t._id === _id) || {}).isChecked,
	}));

	const toggleChecked = ({ _id, isChecked }) => {
		Meteor.call('tasks.update', _id, !isChecked);
	};

	const deleteTask = ({ _id }) => {
		Meteor.call('tasks.remove', _id);
		refetch();
	};

	return (
		<div>
			{USER ? (
				<Fragment>
					<div className="top-bar">
						<p>
							Connect as <span className="userName">{USER.username}</span>
						</p>
						<div>
							Pending tasks
							<span className="tasksCount">{pendingTasksCount}</span>
						</div>
						<button className="logout" onClick={() => Meteor.logout()}>
							Logout
						</button>
					</div>

					<div className="wrapper">
						<TaskForm />
						<div className="wrapper-task">
							<h2>Tasks</h2>

							<div>
								<button
									className="button-filter"
									onClick={() => setHideCompleted(!hideCompleted)}
								>
									{hideCompleted ? 'Show All' : 'Only pending tasks'}
								</button>
							</div>
							{isLoading && pendingTasksCount < 0 && <p>chargement...</p>}
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
						</div>
					</div>
				</Fragment>
			) : (
				<Fragment>
					<LoginForm />
					<SignUpForm />
				</Fragment>
			)}
		</div>
	);
};

export default App;
