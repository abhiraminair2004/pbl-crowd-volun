const express = require('express');
const router = express.Router();
const vverseController = require('../controllers/vverseController');
const { authenticateToken } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// Feed and posts
router.get('/feed', authenticateToken, vverseController.getFeedPosts);
router.post('/posts', authenticateToken, upload.single('media'), vverseController.createPost);
router.post('/posts/:postId/like', authenticateToken, vverseController.likePost);
router.post('/posts/:postId/comment', authenticateToken, vverseController.commentOnPost);

// User interactions
router.get('/suggested-users', authenticateToken, vverseController.getSuggestedUsers);
router.post('/users/:userId/follow', authenticateToken, vverseController.followUser);

// Stories
router.get('/stories', authenticateToken, vverseController.getStories);

module.exports = router;