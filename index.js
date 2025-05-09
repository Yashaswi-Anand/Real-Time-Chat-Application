const express = require("express");
const app = express();
const PORT = process.env.PORT || 8500;

app.use(express.json());

app.listen(PORT,
    console.log(`Server running on PORT ${PORT}`)
);