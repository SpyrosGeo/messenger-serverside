const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type User {
      username:String!
      email:String!
      createdAt:String!
      token:String
  }
  type Message {
    uuid:String!
    content:String!
    from:String!
    to: String!
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "users" query returns an array of zero or more Books (defined above).
  type Query {
   getUsers:[User]!
   login(username:String! password:String!):User!
  }
  
  type Mutation{
    register( 
      username:String!
      email:String!
      password:String!
      confirmPassword:String!
      ):User!
      sendMessage(to:String! content:String!):Message!
  }
`;
module.exports = typeDefs;