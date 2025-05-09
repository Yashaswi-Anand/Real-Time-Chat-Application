const User = require("../models/user");
const serverResponses = require("../config/responses");
const bcrypt = require("bcryptjs");
const util = require("../config/utils");
const Message = require("../models/Message");

module.exports = {

    async registerUser(req, res, next) {
        try {
            const { name, email, password, image } = req.body;

            if (!name || !email || !password) {
                res.status(400);
                throw new Error("Please Enter all the Feilds");
            }

            const userExists = await User.findOne({ email });

            if (userExists) {
                res.status(400);
                throw new Error("User already exists");
            }

            const user = await User.create({ name, email,password });
            serverResponses.successResponse(res, "User Registered Successfully", user)
        }
        catch (error) {
            serverResponses.errorResponse(res, error.message, 'unable to register user')
        }
    },

    async loginUser(req, res, next) {
        try {
            const { email, password } = req.body;

            const user_data = await User.findOne({ email });

            if (!user_data) {
                throw new Error("Invalid Credentials");
            }

            if (user_data && bcrypt.compareSync(password, user_data.password)) {
                const data = {
                    name: user_data.name,
                    email: user_data.email,
                    jwt_token: await util.generateJwtToken(user_data),
                    refresh_token: await util.generateRefreshToken(user_data)
                }
                serverResponses.successResponse(res, "User Login Successfully", data)
            }   
        }
        catch (error) {
            serverResponses.errorResponse(res, error.message, 'unable to login user')
        }
    },

    async getAllUsers(req, res, next) {
        try {
            const filterUsers = await User.find({
                _id: { $ne: req.user_id }
            }).select('-password'); // remove password

            const unseenMessage = { }
            const promise = filterUsers.map(async (user) => {
                const message = await Message.find({
                    sender_id: user._id,
                    receiver_id: req.user_id,
                    seen: false
                })

                if (message.length > 0) {
                    unseenMessage[user_id] = message.length
                 }
            })

            await Promise.all(promise)
            serverResponses.successResponse(res, "User Fetched Successfully", {users:  filterUsers, unseenMessage})
        }
        catch (error) {
            serverResponses.errorResponse(res, error.message, 'unable to get users')
        }
    }
}