import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Avatar,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CardMedia,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  PhotoCamera,
  VideoCameraBack,
  Link as LinkIcon,
  LocationOn,
  Tag,
  Favorite,
  FavoriteBorder,
  Comment,
  Close as CloseIcon
} from '@mui/icons-material';
import vverseService from '../services/vverseService';

interface Post {
  _id: string;
  author: {
    _id: string;
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  media?: string;
  mediaType?: 'image' | 'video' | 'document';
  fileName?: string;
  likes: string[];
  comments: Array<{
    _id: string;
    user: {
      _id: string;
      name: string;
      username: string;
      avatar: string;
    };
    content: string;
    createdAt: string;
  }>;
  location?: string;
  tags: string[];
  createdAt: string;
}

const VVerse: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newPost, setNewPost] = useState({
    content: '',
    location: '',
    tags: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const photoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await vverseService.getFeedPosts();
      setPosts(data.posts);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching posts');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        setError('File size must be less than 25MB');
        return;
      }
      console.log('Selected file:', file);
      setSelectedFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.content.trim()) {
      setError('Please enter some content');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('content', newPost.content);
      if (selectedFile) {
        formData.append('media', selectedFile);
      }
      if (newPost.location) {
        formData.append('location', newPost.location);
      }
      if (newPost.tags) {
        formData.append('tags', JSON.stringify(newPost.tags.split(',').map(tag => tag.trim())));
      }

      console.log('Submitting form data:', {
        content: newPost.content,
        file: selectedFile,
        location: newPost.location,
        tags: newPost.tags
      });

      await vverseService.createPost({
        content: newPost.content,
        media: selectedFile || undefined,
        location: newPost.location || undefined,
        tags: newPost.tags ? newPost.tags.split(',').map(tag => tag.trim()) : undefined
      });

      // Reset form
      setNewPost({ content: '', location: '', tags: '' });
      setSelectedFile(null);
      setError('');

      // Show success message
      alert('Post created successfully!');
    } catch (err: any) {
      console.error('Error creating post:', err);
      setError(err.response?.data?.message || 'Error creating post');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const response = await vverseService.likePost(postId);
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId
            ? { ...post, likes: response.isLiked
                ? [...post.likes, response.userId]
                : post.likes.filter(id => id !== response.userId) }
            : post
        )
      );
    } catch (err: any) {
      console.error('Error liking post:', err);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Share your thoughts or initiative..."
            value={newPost.content}
            onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
            error={Boolean(error)}
            helperText={error}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<PhotoCamera />}
            >
              Photo
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileSelect}
              />
            </Button>

            <Button
              variant="outlined"
              component="label"
              startIcon={<VideoCameraBack />}
            >
              Video
              <input
                type="file"
                hidden
                accept="video/*"
                onChange={handleFileSelect}
              />
            </Button>

            <Button
              variant="outlined"
              startIcon={<LinkIcon />}
              onClick={() => {
                const url = prompt('Enter URL:');
                if (url) {
                  setNewPost(prev => ({
                    ...prev,
                    content: prev.content + (prev.content ? '\n' : '') + url
                  }));
                }
              }}
            >
              Link
            </Button>
          </Box>

          {selectedFile && (
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">
                Selected file: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)}MB)
              </Typography>
              <IconButton size="small" onClick={() => setSelectedFile(null)}>
                <CloseIcon />
              </IconButton>
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              size="small"
              placeholder="Location"
              value={newPost.location}
              onChange={(e) => setNewPost(prev => ({ ...prev, location: e.target.value }))}
              InputProps={{
                startAdornment: <LocationOn sx={{ mr: 1 }} />
              }}
              sx={{ flex: 1 }}
            />
            <TextField
              size="small"
              placeholder="Tags (comma-separated)"
              value={newPost.tags}
              onChange={(e) => setNewPost(prev => ({ ...prev, tags: e.target.value }))}
              InputProps={{
                startAdornment: <Tag sx={{ mr: 1 }} />
              }}
              sx={{ flex: 1 }}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={24} /> : 'Post'}
          </Button>
        </form>
      </Paper>

      {/* Link Dialog */}
      <Dialog open={showLinkDialog} onClose={() => setShowLinkDialog(false)}>
        <DialogTitle>Add Link</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="URL"
            type="url"
            fullWidth
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLinkDialog(false)}>Cancel</Button>
          <Button onClick={() => {
            setNewPost(prev => ({
              ...prev,
              content: prev.content + (prev.content ? '\n' : '') + linkUrl
            }));
            setShowLinkDialog(false);
          }}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Posts Feed */}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        posts.map(post => (
          <Card key={post._id} sx={{ mb: 2 }}>
            <CardHeader
              avatar={<Avatar src={post.author.avatar}>{post.author.name[0]}</Avatar>}
              title={post.author.name}
              subheader={new Date(post.createdAt).toLocaleDateString()}
            />
            <CardContent>
              <Typography variant="body1">{post.content}</Typography>

              {post.media && post.mediaType === 'image' && (
                <CardMedia
                  component="img"
                  image={`http://localhost:5000${post.media}`}
                  alt="Post media"
                  sx={{ maxHeight: 500, objectFit: 'contain', mt: 2 }}
                />
              )}

              {post.media && post.mediaType === 'video' && (
                <CardMedia
                  component="video"
                  src={`http://localhost:5000${post.media}`}
                  controls
                  sx={{ maxHeight: 500, mt: 2 }}
                />
              )}

              {post.location && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  <LocationOn fontSize="small" /> {post.location}
                </Typography>
              )}

              {post.tags.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  {post.tags.map(tag => (
                    <Typography
                      key={tag}
                      variant="body2"
                      component="span"
                      sx={{ mr: 1, color: 'primary.main' }}
                    >
                      #{tag}
                    </Typography>
                  ))}
                </Box>
              )}
            </CardContent>

            <CardActions>
              <IconButton onClick={() => handleLike(post._id)}>
                {post.likes.includes(localStorage.getItem('userId') || '') ? (
                  <Favorite color="error" />
                ) : (
                  <FavoriteBorder />
                )}
              </IconButton>
              <Typography>{post.likes.length}</Typography>

              <IconButton>
                <Comment />
              </IconButton>
              <Typography>{post.comments.length}</Typography>
            </CardActions>
          </Card>
        ))
      )}
    </Box>
  );
};

export default VVerse;