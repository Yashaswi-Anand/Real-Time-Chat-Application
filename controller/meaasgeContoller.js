const User = require("../models/user");
const serverResponses = require("../config/responses");
const Message = require("../models/Message");
const { io, userSocketMap } = require("../config/socket");

module.exports = {
    
    async getAllMessages(req, res, next) {
        try {
            const {id: selsctedUserId} = req.params;
            const my_id = req.user_id;

            const messages = await Message.find({
                $or: [
                    {sender_id: my_id, receiver_id: selsctedUserId},
                    {sender_id: selsctedUserId, receiver_id: my_id}
                ]
            })
            await Message.updateMany({
                sender_id: selsctedUserId,
                receiver_id: my_id,
            }, {
                seen: true
            })
            serverResponses.successResponse(res, "User Fetched Successfully", messages)
        }
        catch (error) {
            serverResponses.errorResponse(res, error.message, 'unable to get users')
        }
    },

    // mark message as seen


    async sendMessage(req, res, next) {
        try {
            const { content } = req.body;
            const receiver_id = req.params.id;
            const sender_id = req.user_id;
            const message = await Message.create({ sender_id, receiver_id, content });

            // Emit the message to the receiver's socket
            const receiverSocket = userSocketMap[receiver_id];
            if (receiverSocket) {
                io.to(receiverSocket).emit('newMessage', message);
            }
            serverResponses.successResponse(res, "Message Sent Successfully", message)
        } catch (error) {
            serverResponses.errorResponse(res, error.message, 'unable to send message...')
        }
    },
}

