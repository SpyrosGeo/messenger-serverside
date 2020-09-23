const { User } = require("../models")
const bcrypt = require('bcryptjs')
const { UserInputError, AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken');



const resolvers = {
    Query: {
        getUsers: async () => {
            try {
                const users = await User.findAll()
                return users
            } catch (error) {
                console.log(error)
            }
        },
        login: async (parent, args) => {
            const { username, password } = args
            let errors = {}
            try {
                if (username.trim() === '') errors.username = 'user cannot be empty'
                if (password.trim() === '') errors.password = 'password cannot be empty'
                if (Object.keys(errors).length > 0) {
                    throw new UserInputError('Bad Input', { errors })
                }
                const user = await User.findOne({
                    where: {
                        username
                    }
                })
                if (!user) {
                    errors.username = 'User not found'
                    throw new UserInputError('User not found', { errors })

                }


                const correctPassword = await bcrypt.compare(password, user.password)
                if (!correctPassword) {
                    errors.password = 'Incorrect Password'
                    throw new AuthenticationError('Incorrect password', { errors })
                }
                const token = jwt.sign({
                    username
                }, 'sjhfdsj hsdfkj hsfsd', { expiresIn: 60 * 60 });
                user.token = token
                return user
            } catch (err) {
                console.log(err)
                throw err
            }
        }
    },
    Mutation: {
        register: async (parent, args) => {
            let { username, email, password, confirmPassword } = args;
            let errors = {}
            try {
                //validate input data
                if (email.trim() === '') errors.email = "Email cannot be empty"
                if (username.trim() === '') errors.username = "Username cannot be empty"
                if (password.trim() === '') errors.password = "Password cannot be empty"
                if (confirmPassword.trim() === '') errors.confirmPassword = "Repeat password cannot be empty"
                if (password !== confirmPassword) errors.confirmPassword = "Passwords must match"
                //check if creds exist
                // const userByUsername = await User.findOne({ where: { username } })
                // const userByEmail = await User.findOne({ where: { email } })

                // if (userByUsername) errors.username = 'Username is taken'
                // if (userByEmail) errors.email = 'Email is taken'

                if (Object.keys(errors).length > 0) {
                    throw errors
                }
                //hash password
                password = await bcrypt.hash(password, 6)

                //create user
                const user = await User.create({
                    username,
                    email,
                    password,
                    // confirmedpassword
                })

                //return user
                return user


            } catch (error) {
                console.log(error)
                if (error.name === 'SequelizeUniqueConstraintError') {
                    error.errors.forEach(e => (errors[e.path] = `${e.path} is already taken`))
                } else if (error.name === 'SequelizeValidationError') {
                    error.errors.forEach(e => errors[e.path] = e.message)
                }
                throw new UserInputError("Bad Input", { errors })
            }

        }
    }
};

module.exports = resolvers;