const http = require('http');
const { Server } = require("socket.io");
const express = require("express");
const app = express();
const server = http.createServer(app);

// Initialize Socket.io server
const io = new Server(server, { cors: { origin: "*" } });

// store online users
const userSocketMap = {};

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User Connected", userId);

    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    // Emit the online users list
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        console.log("User Disconnected", userId);
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    }); 
})

module.exports = {io, userSocketMap}