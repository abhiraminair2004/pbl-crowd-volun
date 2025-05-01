import axios from 'axios';

const API_URL = 'http://localhost:5000/api/vverse';

export interface CreatePostData {
  content: string;
  media?: File;
  location?: string;
  tags?: string[];
}

const vverseService = {
  fetchPosts: async () => {
    return [];
  },
  createPost: async (post: any) => {
    return post;
  },
  likePost: async (postId: string) => {
    return { _id: postId, likes: [] };
  },
  addComment: async (postId: string, comment: string) => {
    return { _id: postId, comments: [{ content: comment }] };
  },
  deletePost: async (postId: string) => {
    return { _id: postId };
  },
  updatePost: async (postId: string, post: any) => {
    return { _id: postId, ...post };
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