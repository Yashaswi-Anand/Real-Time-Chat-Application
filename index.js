const express = require("express");
const app = express();
require('dotenv').config();
const http = require('http');
const cors = require('cors');

const port = process.env.PORT || 8500;
require('./config/mongoose');

// Middlewares
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Routes
const users_router = require("./routers/user_routes");
const message_router = require("./routers/message_router");

app.use('/users/v1', users_router);
app.use('/messages/v1', message_router);

app.get('/', (req, res) => {
    return res.send('Server is healthy...');
});

// Create HTTP server and attach socket.io
const server = http.createServer(app);
require('./config/socket').initSocket(server);  // Pass server to socket module

// Start server
server.listen(port, function (err) {
    if (err) {
        console.log("Error in starting server");
    }
    console.log(`Server is running on port: ${port}`);
});