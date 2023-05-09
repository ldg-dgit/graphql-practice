import { ApolloServer, gql } from "apollo-server";

let tweets = [
	{
		id: "1",
		text: "first",
		userId: "2",
	},
	{
		id: "2",
		text: "second",
		userId: "1",
	},
];

const typeDefs = gql`
	type User {
		id: ID!
		username: String!
		firstName: String
		lastName: String
		"""
		I the sum of firstname and lastname
		"""
		fullName: String
	}
	"""
	Tweet object represents a resource for a tweet
	"""
	type Tweet {
		id: ID!
		text: String!
		author: User
	}
	type Query {
		allUsers: [User!]!
		allTweets: [Tweet]!
		tweet(id: ID!): Tweet
	}
	type Mutation {
		postTweet(text: String!, userId: ID!): Tweet!
		"""
		delete the tweet if is exist
		"""
		deleteTweet(id: ID!): Boolean!
	}
`;

let users = [
	{
		id: "1",
		firstName: "Bobby",
		lastName: "Lee",
	},
	{
		id: "2",
		firstName: "Elon",
		lastName: "Mask",
	},
];

const resolvers = {
	Query: {
		allTweets() {
			return tweets;
		},
		tweet(root, { id }) {
			return tweets.findIndex((tweet) => tweet.id === id);
		},
		allUsers() {
			return users;
		},
	},
	Mutation: {
		postTweet(_, { text, userId }) {
			const newTweet = {
				id: tweets.length + 1,
				text,
				userId,
			};
			tweets.push(newTweet);
			return newTweet;
		},
		deleteTweet(_, { id }) {
			const tweet = tweets.find((tweet) => tweet.id === id);
			if (!tweet) return false;
			tweets = tweets.filter((tweet) => tweet.id !== id);
			return true;
		},
	},
	User: {
		fullName({ firstName, lastName }) {
			return `${firstName} ${lastName}`;
		},
	},
	Tweet: {
		author({ userId }) {
			const writeUser = users.find((user) => user.id === userId);
			if (!writeUser) {
				throw new Error("cant find user");
			}
			return writeUser;
		},
	},
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
	console.log(`Running on ${url}`);
});
