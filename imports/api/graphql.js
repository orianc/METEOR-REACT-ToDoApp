import { Meteor } from 'meteor/meteor';
import { startGraphQLServer } from 'meteor/quave:graphql/server';
import { TasksCollection } from './collection/TasksCollection';

const log = (error) => console.error('Graph ql server error', error);

const UserSchema = `  
  type Query {
    loggedUser : User
  }

  type User {
    _id : ID!
    username: String
  }`;

const UserResolvers = {
	Query: {
		async loggedUser(root, args, { userId }) {
			if (!userId) return null;
			return Meteor.users.findOne(userId);
		},
	},
};

const TaskSchema = `
	type Query {
		tasks: [Task]
	}

	type Mutation {
		addTask( text : String! ) : Task
	}

	type Task {
		_id : ID!
		text: String
		createAt: String
		isChecked: Boolean
		user: User
	}
`;

const TaskResolvers = {
	Query: {
		async tasks(root, args, { userId }) {
			if (!userId) {
				return null;
			}

			return TasksCollection.find({ userId }, { sort: { createAt: -1 } });
		},
	},
	Mutation: {
		addTask(root, { text }, { userId }) {
			if (!userId) {
				return null;
			}
			return TasksCollection.save({ text, userId });
		},
	},
	Task: {
		user({ userId }) {
			return Meteor.users.findOne(userId);
		},
	},
};
startGraphQLServer({
	typeDefs: [UserSchema, TaskSchema],
	resolvers: [UserResolvers, TaskResolvers],
	log,
});
