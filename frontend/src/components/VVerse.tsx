import React, { useState, useEffect } from 'react';
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
  CardContent,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip
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
  createdAt: string;
  media?: string;
  mediaType?: string;
  location?: string;
  tags?: string[];
  likes: string[];
  comments: any[];
}

const VVerse: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPost, setNewPost] = useState({
    content: '',
    media: null as File | null,
    mediaType: '',
    fileName: '',
    location: '',
    tags: [] as string[]
  });
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await vverseService.fetchPosts();
      setPosts(data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching posts');
      setLoading(false);
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await vverseService.createPost(newPost);
      setNewPost({
        content: '',
        media: null,
        mediaType: '',
        fileName: '',
        location: '',
        tags: []
      });
      fetchPosts();
    } catch (err) {
      setError('Error creating post');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewPost({
        ...newPost,
        media: file,
        mediaType: file.type,
        fileName: file.name
      });
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await vverseService.likePost(postId);
      fetchPosts();
    } catch (err) {
      setError('Error liking post');
    }
  };

  const handleAddLink = () => {
    setLinkDialogOpen(true);
  };

  const handleLinkSubmit = () => {
    setNewPost({
      ...newPost,
      content: `${newPost.content} ${linkUrl}`
    });
    setLinkUrl('');
    setLinkDialogOpen(false);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <form onSubmit={handlePostSubmit}>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Share your thoughts..."
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                data-testid="post-input"
              />
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<PhotoCamera />}
                >
                  Photo
                  <input
                    type="file"
                    hidden
                    accept="image/*,video/*,.pdf,.doc,.docx"
                    onChange={handleFileChange}
                    data-testid="file-input"
                    id="file-input"
                  />
                </Button>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<VideoCameraBack />}
                >
                  Video
                  <input
                    type="file"
                    hidden
                    accept="video/*"
                    onChange={handleFileChange}
                    data-testid="video-input"
                    id="video-input"
                  />
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<LinkIcon />}
                  onClick={handleAddLink}
                >
                  Link
                </Button>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <TextField
                  placeholder="Location"
                  value={newPost.location}
                  onChange={(e) => setNewPost({ ...newPost, location: e.target.value })}
                  InputProps={{
                    startAdornment: <LocationOn />
                  }}
                />
                <TextField
                  placeholder="Tags (comma-separated)"
                  value={newPost.tags.join(',')}
                  onChange={(e) => setNewPost({ ...newPost, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                  InputProps={{
                    startAdornment: <Tag />
                  }}
                />
              </Box>
              {newPost.fileName && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected file: {newPost.fileName}
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 2 }}
              >
                Post
              </Button>
            </form>
          </Paper>
        </Grid>

        <Dialog open={linkDialogOpen} onClose={() => setLinkDialogOpen(false)}>
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
            <Button onClick={() => setLinkDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleLinkSubmit}>Add</Button>
          </DialogActions>
        </Dialog>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Typography>Loading...</Typography>
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ width: '100%', textAlign: 'center' }}>
            {error}
          </Typography>
        ) : (
          posts.map((post) => (
            <Grid item xs={12} key={post._id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar src={post.author.avatar} alt={post.author.name} />
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="subtitle1">{post.author.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        @{post.author.username}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body1">{post.content}</Typography>
                  {post.media && (
                    <CardMedia
                      component={post.mediaType?.startsWith('video') ? 'video' : 'img'}
                      src={post.media}
                      controls={post.mediaType?.startsWith('video')}
                      sx={{ mt: 2, maxHeight: 400 }}
                    />
                  )}
                  {post.location && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      <LocationOn fontSize="small" /> {post.location}
                    </Typography>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      {post.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                      ))}
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <IconButton
                      onClick={() => handleLike(post._id)}
                      data-testid={`like-button-${post._id}`}
                    >
                      {post.likes.includes('user1') ? <Favorite color="error" /> : <FavoriteBorder />}
                    </IconButton>
                    <IconButton>
                      <Comment />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default VVerse;