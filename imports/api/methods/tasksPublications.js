import { Meteor } from 'meteor/meteor';
import { TasksCollection } from '../collection/TasksCollection';

// don't bind an arrow function to keep 'this' context
Meteor.publish('tasks', function publishTasks() {
	return TasksCollection.find({ userId: this.userId });
});
