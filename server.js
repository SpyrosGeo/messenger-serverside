const { ApolloServer } = require('apollo-server');
const resolvers = require('./graphql/resolvers')
const typeDefs = require('./graphql/typeDefs')



const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});