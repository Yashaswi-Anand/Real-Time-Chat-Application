const { Server } = require("socket.io");

let io = null;
const userSocketMap = {};

function initSocket(server) {
    io = new Server(server, {
        cors: { origin: "*" }
    });

    io.on('connection', (socket) => {
        const userId = socket.handshake.query.user_id;
        console.log("User Connected:", userId);

        if (userId) {
            socket.user_id = userId;
            userSocketMap[userId] = socket.id;
        }

        // Emit updated online users to all
        io.emit('getOnlineUsers', Object.keys(userSocketMap));

        // Respond to a specific client's request for online users
        socket.on('requestOnlineUsers', () => {
            socket.emit('getOnlineUsers', Object.keys(userSocketMap));
        });

        socket.on('disconnect', () => {
            console.log("User Disconnected:", userId);
            delete userSocketMap[userId];
            io.emit('getOnlineUsers', Object.keys(userSocketMap));
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