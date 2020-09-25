const { ApolloServer } = require('apollo-server');
const resolvers = require('./graphql/resolvers')
const typeDefs = require('./graphql/typeDefs')
const { sequelize } = require("./models/index")
const contextMiddleware = require('./util/contextMiddleware')
const server = new ApolloServer(
    {
        typeDefs,
        resolvers,
        context:contextMiddleware,
    });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);

    sequelize.authenticate().then(() => console.log('Database connected!')).catch(err => console.log(err))
});