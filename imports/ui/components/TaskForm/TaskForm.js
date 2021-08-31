import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import './TaskForm.css';
const TaskForm = () => {
	const [toggle, setToggle] = useState(false);
	const [newTask, setNewTask] = useState('');
	const handleChange = (e) => {
		e.preventDefault();
		setNewTask(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!newTask) return console.log('nothing to submit');
		try {
			Meteor.call('tasks.insert', newTask);
			console.log(`task added : ${newTask}`);
			setNewTask('');
			setToggle(false);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
			{!toggle && (
				<div onClick={() => setToggle(true)} className="add-task-toggler">
					<p>Add</p>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						class="bi bi-plus-lg"
						viewBox="0 0 22 22"
					>
						<path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" />
					</svg>
				</div>
			)}
			{toggle && (
				<form className="task-form" onSubmit={(e) => handleSubmit(e)}>
					<h3>
						<div
							onClick={() => setToggle(false)}
							className="add-task-toggler-close"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								class="bi bi-arrow-bar-left"
								viewBox="0 0 16 16"
							>
								<path
									fill-rule="evenodd"
									d="M12.5 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5zM10 8a.5.5 0 0 1-.5.5H3.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L3.707 7.5H9.5a.5.5 0 0 1 .5.5z"
								/>
							</svg>
						</div>
						Add task
					</h3>
					<textarea
						value={newTask}
						onChange={(e) => handleChange(e)}
						type="text"
						rows="10"
						style={{ resize: 'none', width: '100%' }}
						placeholder="something to do..."
					/>
					<button type="submit">Enregister</button>
				</form>
			)}
		</>
	);
};

export default TaskForm;
