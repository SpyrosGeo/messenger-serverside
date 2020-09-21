const  users  = require('../dummyData')

const resolvers = {
    Query: {
        getUsers: () => users,
    },
};

module.exports = resolvers;