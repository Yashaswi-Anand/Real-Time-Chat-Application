const express = require("express");
const app = express();
require('dotenv').config();
const port = process.env.PORT || 8500;
require('./config/mongoose')
app.use(express.json());
const cors = require('cors');
const User = require("./models/user");
const users_router = require("./routers/user_routes");

const corsOption ={
    origin : '*'
}
app.use(cors(corsOption))

app.use('/users/v1', users_router)

app.get('/', (req,res) =>{
    return res.send('Server is healthy...');
})
app.listen(port, function(err){
    if(err) {console.log("error");}
    console.log(`Server is running on port: ${port}`);
})