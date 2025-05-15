const express = require('express');
const messagesController = require('../controller/meaasgeContoller');
const authorize = require('../middleware/authorize');
const router = express.Router();

router.get('/get_all_messages/:id ', authorize(), messagesController.getAllMessages);
router.post('/send_message/:id', authorize(), messagesController.sendMessage);

module.exports = router;