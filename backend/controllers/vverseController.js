const Post = require('../models/Post');
const User = require('../models/User');
const { getMediaType, getFileUrl } = require('../middleware/upload');
const axios = require('axios');

const vverseController = {
    async createPost(req, res) {
        try {
            console.log('Creating post with body:', req.body);
            console.log('File:', req.file);

            const { content, visibility = 'public', location, tags, link } = req.body;
            let mediaUrl = null;
            let mediaType = null;
            let fileName = null;
            let linkPreview = null;

            // Handle file upload
            if (req.file) {
                mediaUrl = getFileUrl(req.file.filename);
                mediaType = getMediaType(req.file.mimetype);
                fileName = req.file.originalname;
                console.log('File processed:', { mediaUrl, mediaType, fileName });
            }
            // Handle link
            else if (link) {
                try {
                    // Fetch link preview data
                    const response = await axios.get(link);
                    const html = response.data;

                    // Extract metadata (simplified version)
                    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
                    const descriptionMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i);
                    const imageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"[^>]*>/i);

                    linkPreview = {
                        title: titleMatch ? titleMatch[1] : link,
                        description: descriptionMatch ? descriptionMatch[1] : '',
                        image: imageMatch ? imageMatch[1] : null,
                        url: link
                    };
                    mediaType = 'link';
                    console.log('Link processed:', linkPreview);
                } catch (error) {
                    console.error('Error fetching link preview:', error);
                    // Still create the post with the link even if preview fails
                    linkPreview = {
                        title: link,
                        url: link
                    };
                    mediaType = 'link';
                }
            }

            const post = new Post({
                author: req.user._id,
                content,
                media: mediaUrl,
                mediaType,
                fileName,
                linkPreview,
                visibility,
                location,
                tags: tags ? JSON.parse(tags) : []
            });

            await post.save();
            await post.populate('author', 'name username avatar');

            console.log('Post created successfully:', post);
            res.status(201).json(post);
        } catch (error) {
            console.error('Error creating post:', error);
            res.status(500).json({
                message: 'Error creating post',
                error: error.message,
                details: error.stack
            });
        }
    },

    async getFeedPosts(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const user = await User.findById(req.user._id);

            // Get posts from followed users and public posts
            const posts = await Post.find({
                $or: [
                    { author: { $in: user.following } },
                    { visibility: 'public' }
                ]
            })
            .populate('author', 'name username avatar')
            .populate({
                path: 'comments.user',
                select: 'name username avatar'
            })
            .sort('-createdAt')
            .skip((page - 1) * limit)
            .limit(limit);

            // Get total count for pagination
            const total = await Post.countDocuments({
                $or: [
                    { author: { $in: user.following } },
                    { visibility: 'public' }
                ]
            });

            res.json({
                posts,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            console.error('Error fetching feed:', error);
            res.status(500).json({ message: 'Error fetching feed', error: error.message });
        }
    },

    async likePost(req, res) {
        try {
            const post = await Post.findById(req.params.postId);
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            const likeIndex = post.likes.indexOf(req.user._id);
            if (likeIndex > -1) {
                post.likes.splice(likeIndex, 1); // Unlike
            } else {
                post.likes.push(req.user._id); // Like
            }

            await post.save();
            res.json({ likes: post.likes.length, isLiked: likeIndex === -1 });
        } catch (error) {
            console.error('Error liking post:', error);
            res.status(500).json({ message: 'Error liking post', error: error.message });
        }
    },

    async commentOnPost(req, res) {
        try {
            const { content } = req.body;
            const post = await Post.findById(req.params.postId);
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            post.comments.push({
                user: req.user._id,
                content
            });

            await post.save();
            await post.populate('comments.user', 'name username avatar');

            res.json(post.comments);
        } catch (error) {
            console.error('Error commenting on post:', error);
            res.status(500).json({ message: 'Error commenting on post', error: error.message });
        }
    },

    async getSuggestedUsers(req, res) {
        try {
            const user = await User.findById(req.user._id);
            const suggestedUsers = await User.find({
                _id: {
                    $nin: [...user.following, req.user._id]
                }
            })
            .select('name username avatar bio')
            .limit(5);

            res.json(suggestedUsers);
        } catch (error) {
            console.error('Error getting suggested users:', error);
            res.status(500).json({ message: 'Error getting suggested users', error: error.message });
        }
    },

    async followUser(req, res) {
        try {
            if (req.params.userId === req.user._id.toString()) {
                return res.status(400).json({ message: 'Cannot follow yourself' });
            }

            const [targetUser, currentUser] = await Promise.all([
                User.findById(req.params.userId),
                User.findById(req.user._id)
            ]);

            if (!targetUser || !currentUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            const isFollowing = currentUser.following.includes(targetUser._id);
            if (!isFollowing) {
                currentUser.following.push(targetUser._id);
                targetUser.followers.push(currentUser._id);
                await Promise.all([currentUser.save(), targetUser.save()]);
            }

            res.json({
                isFollowing: !isFollowing,
                followersCount: targetUser.followers.length
            });
        } catch (error) {
            console.error('Error following user:', error);
            res.status(500).json({ message: 'Error following user', error: error.message });
        }
    },

    async getStories(req, res) {
        try {
            const user = await User.findById(req.user._id);
            // For now, return empty array as stories feature is not implemented
            res.json([]);
        } catch (error) {
            console.error('Error getting stories:', error);
            res.status(500).json({ message: 'Error getting stories', error: error.message });
        }
    }
};

module.exports = vverseController;