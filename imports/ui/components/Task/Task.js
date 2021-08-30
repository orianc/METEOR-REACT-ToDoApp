import React from 'react';
import './Task.css';

const Task = ({ task, onCheckBoxClick, onDeleteClick }) => {
	console.log(task);
	return (
		<li className="task">
			<input className="checkbox" type="checkbox" checked={task.isChecked} onClick={() => onCheckBoxClick(task)} readOnly />
			<span>{task.text}</span>
			<p className="detail">Créé par {task.createdBy}</p>
			<button onClick={() => onDeleteClick(task)}>&times;</button>
		</li>
	);
};

export default Task;
