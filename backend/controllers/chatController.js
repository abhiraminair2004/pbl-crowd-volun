const Chat = require('../models/Chat');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

const chatController = {
    // Get all chats for the current user
    async getChats(req, res) {
        try {
            const chats = await Chat.find({
                participants: req.user._id
            })
            .populate('participants', 'name email avatar online lastLogin')
            .populate('lastMessage.sender', 'name')
            .sort('-updatedAt');

            res.json(chats);
        } catch (error) {
            console.error('Error getting chats:', error);
            res.status(500).json({ message: 'Error getting chats', error: error.message });
        }
    },

    // Create a new chat
    async createChat(req, res) {
        try {
            const { userId } = req.body;

            // Check if chat already exists between these users
            const existingChat = await Chat.findOne({
                participants: {
                    $all: [req.user._id, userId]
                }
            }).populate('participants', 'name email avatar online lastLogin');

            if (existingChat) {
                return res.json(existingChat);
            }

            // Create new chat
            const chat = new Chat({
                participants: [req.user._id, userId]
            });

            await chat.save();

            // Populate participant details
            await chat.populate('participants', 'name email avatar online lastLogin');

            res.status(201).json(chat);
        } catch (error) {
            console.error('Error creating chat:', error);
            res.status(500).json({ message: 'Error creating chat', error: error.message });
        }
    },

    // Get messages for a specific chat
    async getMessages(req, res) {
        try {
            const chat = await Chat.findOne({
                _id: req.params.chatId,
                participants: req.user._id
            })
            .populate('messages.sender', 'name email avatar');

            if (!chat) {
                return res.status(404).json({ message: 'Chat not found' });
            }

            res.json(chat.messages);
        } catch (error) {
            console.error('Error getting messages:', error);
            res.status(500).json({ message: 'Error getting messages', error: error.message });
        }
    },

    // Send a message in a chat
    async sendMessage(req, res) {
        try {
            const { content } = req.body;
            const chat = await Chat.findOne({
                _id: req.params.chatId,
                participants: req.user._id
            });

            if (!chat) {
                return res.status(404).json({ message: 'Chat not found' });
            }

            const message = {
                sender: req.user._id,
                content,
                timestamp: new Date()
            };

            chat.messages.push(message);
            chat.lastMessage = {
                content,
                timestamp: new Date(),
                sender: req.user._id
            };

            await chat.save();

            // Get the last message (the one we just added) and populate it
            const populatedChat = await Chat.findById(chat._id)
                .populate('messages.sender', 'name email avatar')
                .select({ messages: { $slice: -1 } });

            const populatedMessage = populatedChat.messages[0];

            // Emit socket event for real-time update
            const io = req.app.get('io');
            io.to(req.params.chatId).emit('new-message', populatedMessage);

            res.json(populatedMessage);
        } catch (error) {
            console.error('Error sending message:', error);
            res.status(500).json({ message: 'Error sending message', error: error.message });
        }
    },

    // Upload file in chat
    async uploadFile(req, res) {
        try {
            console.log('Starting file upload process');
            console.log('Request file:', req.file);
            console.log('Request body:', req.body);
            console.log('Chat ID:', req.params.chatId);

            if (!req.file) {
                console.log('No file in request');
                return res.status(400).json({ message: 'No file uploaded' });
            }

            const chat = await Chat.findOne({
                _id: req.params.chatId,
                participants: req.user._id
            });

            if (!chat) {
                console.log('Chat not found');
                return res.status(404).json({ message: 'Chat not found' });
            }

            console.log('Found chat:', chat._id);

            const fileType = req.file.mimetype.startsWith('image/') ? 'image' :
                           req.file.mimetype.startsWith('video/') ? 'video' :
                           req.file.mimetype.startsWith('application/') ? 'application' :
                           req.file.mimetype.startsWith('text/') ? 'text' :
                           'document';

            const fileUrl = `/uploads/${req.file.filename}`;

            console.log('File details:', {
                type: fileType,
                url: fileUrl,
                originalName: req.file.originalname
            });

            const message = {
                sender: req.user._id,
                content: req.file.originalname,
                mediaUrl: fileUrl,
                mediaType: fileType,
                timestamp: new Date()
            };

            chat.messages.push(message);
            chat.lastMessage = {
                content: `Shared a ${fileType}`,
                timestamp: new Date(),
                sender: req.user._id
            };

            await chat.save();

            // Get the last message (the one we just added) and populate it
            const populatedChat = await Chat.findById(chat._id)
                .populate('messages.sender', 'name email avatar')
                .select({ messages: { $slice: -1 } });

            const populatedMessage = populatedChat.messages[0];

            // Emit socket event for real-time update
            const io = req.app.get('io');
            io.to(req.params.chatId).emit('new-message', populatedMessage);

            console.log('Successfully processed file upload');
            res.json(populatedMessage);
        } catch (error) {
            console.error('Error in uploadFile:', error);
            console.error('Error stack:', error.stack);
            res.status(500).json({
                message: 'Error uploading file',
                error: error.message,
                details: error.toString()
            });
        }
    },

    // Get shared media for a chat
    async getSharedMedia(req, res) {
        try {
            const chat = await Chat.findOne({
                _id: req.params.chatId,
                participants: req.user._id
            });

            if (!chat) {
                return res.status(404).json({ message: 'Chat not found' });
            }

            const media = chat.messages
                .filter(msg => msg.mediaType === 'image' || msg.mediaType === 'video')
                .map(msg => ({
                    id: msg._id,
                    url: msg.mediaUrl,
                    type: msg.mediaType,
                    timestamp: msg.timestamp
                }));

            res.json(media);
        } catch (error) {
            console.error('Error getting shared media:', error);
            res.status(500).json({ message: 'Error getting shared media', error: error.message });
        }
    },

    // Get shared files for a chat
    async getSharedFiles(req, res) {
        try {
            const chat = await Chat.findOne({
                _id: req.params.chatId,
                participants: req.user._id
            });

            if (!chat) {
                return res.status(404).json({ message: 'Chat not found' });
            }

            const files = chat.messages
                .filter(msg => msg.mediaType === 'document' || msg.mediaType === 'application' || msg.mediaType === 'text')
                .map(msg => ({
                    id: msg._id,
                    name: msg.content,
                    url: msg.mediaUrl,
                    timestamp: msg.timestamp
                }));

            res.json(files);
        } catch (error) {
            console.error('Error getting shared files:', error);
            res.status(500).json({ message: 'Error getting shared files', error: error.message });
        }
    },

    // Get shared links for a chat
    async getSharedLinks(req, res) {
        try {
            const chat = await Chat.findOne({
                _id: req.params.chatId,
                participants: req.user._id
            });

            if (!chat) {
                return res.status(404).json({ message: 'Chat not found' });
            }

            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const links = chat.messages
                .filter(msg => urlRegex.test(msg.content))
                .map(msg => ({
                    id: msg._id,
                    url: msg.content.match(urlRegex)[0],
                    title: msg.content,
                    timestamp: msg.timestamp
                }));

            res.json(links);
        } catch (error) {
            console.error('Error getting shared links:', error);
            res.status(500).json({ message: 'Error getting shared links', error: error.message });
        }
    }
};

module.exports = chatController;