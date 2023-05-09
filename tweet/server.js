import { ApolloServer, gql } from "apollo-server";

let tweets = [
	{
		id: "1",
		text: "first",
	},
	{
		id: "2",
		text: "second",
	},
];

const typeDefs = gql`
	type User {
		id: ID!
		username: String!
		firstName: String
		lastName: String
	}
	type Tweet {
		id: ID!
		text: String!
		author: User
	}
	type Query {
		allTweets: [Tweet]!
		tweet(id: ID!): Tweet
	}
	type Mutation {
		postTweet(text: String!, userId: ID!): Tweet!
		deleteTweet(id: ID!): Boolean!
	}
`;

const resolvers = {
	Query: {
		allTweets() {
			return tweets;
		},
		tweet(root, { id }) {
			return tweets.findIndex((tweet) => tweet.id === id);
		},
	},
	Mutation: {
		postTweet(_, { text, userId }) {
			const newTweet = {
				id: tweets.length + 1,
				text,
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
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
	console.log(`Running on ${url}`);
});
