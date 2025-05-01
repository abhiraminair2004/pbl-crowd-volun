import axios from 'axios';

const API_URL = 'http://localhost:5000/api/vverse';

export interface CreatePostData {
  content: string;
  media?: File;
  location?: string;
  tags?: string[];
}

const vverseService = {
  async createPost(data: CreatePostData) {
    const token = localStorage.getItem('token');
    const formData = new FormData();

    formData.append('content', data.content);
    if (data.media) {
      formData.append('media', data.media);
    }
    if (data.location) {
      formData.append('location', data.location);
    }
    if (data.tags && data.tags.length > 0) {
      formData.append('tags', JSON.stringify(data.tags));
    }

    const response = await axios.post(`${API_URL}/posts`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  },

  async getFeedPosts(page = 1, limit = 10) {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/feed?page=${page}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },

  async likePost(postId: string) {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/posts/${postId}/like`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },

  async commentOnPost(postId: string, content: string) {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/posts/${postId}/comment`,
      { content },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  }
};

export default vverseService;