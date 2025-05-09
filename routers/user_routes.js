const express = require('express');
const usersController = require('../controller.js/userController.js');
const authorize = require('../middleware/authorize');
const router = express.Router();

router.post('/register_user', authorize(), usersController.registerUser);

router.get('/login_user', authorize(), usersController.loginUser);

// router.post('/delete_user', authorize(), usersController.deleteUser);

module.exports = router;