const { Server } = require("socket.io");
const Message = require("../models/Message");

let io = null;
const userSocketMap = {};

function initSocket(server) {
    io = new Server(server, {
        cors: { origin: "*" },
    });

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.user_id;
        console.log("✅ User Connected:", userId);

        if (userId) {
            socket.user_id = userId;
            userSocketMap[userId] = socket.id;

            // Notify all clients of current online users
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        }

        // Provide online users on request
        socket.on("requestOnlineUsers", () => {
            socket.emit("getOnlineUsers", Object.keys(userSocketMap));
        });

        // Send a message
        socket.on("sendMessage", async ({ content, receiver_id }) => {
            const sender_id = userId;

            if (!sender_id || !receiver_id || !content) {
                console.warn("⚠️ Invalid message data:", { sender_id, receiver_id, content });
                return;
            }

            // console.log("📨 Sending message from", sender_id, "to", receiver_id);

            // Save to DB
            const message = await Message.create({ sender_id, receiver_id, content });
            // console.log("✅ Message saved:", message);

            // Fetch conversation
            const messages = await Message.find({
                $or: [
                    { sender_id, receiver_id },
                    { sender_id: receiver_id, receiver_id: sender_id },
                ],
            });

            // Emit updated messages to both users
            const receiverSocket = userSocketMap[receiver_id];
            const senderSocket = userSocketMap[sender_id];

            if (receiverSocket) {
                io.to(receiverSocket).emit("getAllMessagesBetweenUsers", messages);
            }
            if (senderSocket && senderSocket !== receiverSocket) {
                io.to(senderSocket).emit("getAllMessagesBetweenUsers", messages);
            }
        });

        // Fetch all messages between two users
        socket.on("getAllMessagesBetweenUsers", async ({ chat_partner_id }) => {
            const my_id = userId;

            if (!my_id || !chat_partner_id) {
                console.warn("⚠️ Missing sender or receiver ID.");
                return;
            }

            // console.log("📩 Fetching messages between", my_id, "and", chat_partner_id);

            const messages = await Message.find({
                $or: [
                    { sender_id: my_id, receiver_id: chat_partner_id },
                    { sender_id: chat_partner_id, receiver_id: my_id },
                ],
            });

            socket.emit("getAllMessagesBetweenUsers", messages);
        });

        // Handle disconnect
        socket.on("disconnect", () => {
            console.log("🔌 User Disconnected:", userId);
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        });
    });
}

function getIo() {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
}

module.exports = {
    initSocket,
    getIo,
    userSocketMap
};