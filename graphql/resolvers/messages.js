const { Message, User } = require("../../models")
const { UserInputError, AuthenticationError } = require('apollo-server')
const { Op } = require('sequelize')


const resolvers = {
    Query: {
        getMessages: async (parent, { from }, { user }) => {
            try {
                if (!user) throw new AuthenticationError('Unauthenticated')
                const sender = await User.findOne({
                    where: { username: from }
                })
                if (!sender) throw new UserInputError('User not found')

                const usernames = [user.username, sender.username]
                const messages = await Message.findAll({
                    where: {
                        from: { [Op.in]: usernames },
                        to: { [Op.in]: usernames },
                    },
                    order:[['createdAt','DESC']]
                })

                return messages;
            } catch (err) {
                console.log(err)
            }
        }
    },
    Mutation: {

        sendMessage: async (parent, { to, content }, { user }) => {
            try {
                if (!user) throw new AuthenticationError('Unauthenticated')
                const recipient = await User.findOne({ where: { username: to } })
                if (!recipient) {
                    throw new UserInputError('User not found')
                } else if (recipient.username === user.username) {
                    throw new UserInputError("Can't message self!")
                }
                if (!content.trim() === '') {
                    throw new UserInputError('empty message')
                }
                const message = await Message.create({
                    from: user.username,
                    to,
                    content
                })
                return message
            } catch (err) {
                console.log(err)
            }
        }
    }
};

module.exports = resolvers;