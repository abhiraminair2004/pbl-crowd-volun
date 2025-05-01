const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticateToken } = require('../middleware/auth');
const { upload, processImage } = require('../middleware/upload');

// All chat routes require authentication
router.use(authenticateToken);

// Get all chats for the current user
router.get('/', chatController.getChats);

// Create a new chat
router.post('/', chatController.createChat);

// Get messages for a specific chat
router.get('/:chatId/messages', chatController.getMessages);

// Send a message in a chat
router.post('/:chatId/messages', chatController.sendMessage);

// Upload files/media in chat
router.post('/:chatId/upload', upload.single('file'), processImage, chatController.uploadFile);

// Get shared media for a chat
router.get('/:chatId/media', chatController.getSharedMedia);

// Get shared files for a chat
router.get('/:chatId/files', chatController.getSharedFiles);

// Get shared links for a chat
router.get('/:chatId/links', chatController.getSharedLinks);

module.exports = router;