const express = require('express');
const usersController = require('../controller/userController.js');
const authorize = require('../middleware/authorize');
const router = express.Router();

router.post('/register_user', usersController.registerUser);

router.post('/login_user', usersController.loginUser);

router.get('/get_all_users', authorize(), usersController.getAllUsers);

module.exports = router;