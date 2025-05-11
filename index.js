const express = require("express");
const app = express();
require('dotenv').config();
const port = process.env.PORT || 8500;
require('./config/mongoose')
app.use(express.json());
const cors = require('cors');
const users_router = require("./routers/user_routes");
const message_router = require("./routers/message_router");

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use('/users/v1', users_router)
app.use('/messages/v1', message_router)

app.get('/', (req,res) =>{
    return res.send('Server is healthy...');
})
app.listen(port, function(err){
    if(err) {console.log("error in starting server");}
    console.log(`Server is running on port: ${port}`);
})