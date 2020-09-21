const {User } = require("../models")
const resolvers = {
    Query: {
        getUsers: async() => {
            try {
                const users = await User.findAll()
                return users
            } catch (error) {
                console.log(error)
            }
        }
    },
};

module.exports = resolvers;