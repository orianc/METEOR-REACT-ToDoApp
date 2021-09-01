import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { TasksCollection } from '../collection/TasksCollection';

if (Meteor.isServer) {
	describe('Tasks', () => {
		describe('methods', () => {
			const userId = Random.id();
			let taskId;

			beforeEach(() => {
				TasksCollection.remove({});
				taskId = TasksCollection.insert({
					text: 'Test task',
					createAt: new Date(),
					userId,
				});
			});
		});
	});
}
