const { ApolloServer } = require('apollo-server');
const resolvers = require('./graphql/resolvers')
const typeDefs = require('./graphql/typeDefs')

const {sequelize} = require("./models/index")

const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);

    sequelize.authenticate().then(()=>console.log('Database connected!')).catch(err=>console.log(err))
});