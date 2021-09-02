import { Mongo } from 'meteor/mongo';

const TasksCollection = Object.assign(new Mongo.Collection('tasks'), {
	save({ text, userId }) {
		const newTaskId = this.insert({
			text,
			userId,
			createAt: new Date(),
		});
		return this.findOne(newTaskId);
	},
});

export { TasksCollection };
