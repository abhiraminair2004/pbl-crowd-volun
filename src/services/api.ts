import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production'
  ? '/api'
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for logging and authorization
api.interceptors.request.use(function (config) {
  console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);

  // Add authorization header if user is logged in
  const token = localStorage.getItem('auth_token');
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
}, function (error) {
  console.error('API Request Error:', error);
  return Promise.reject(error);
});

// Add a response interceptor for logging
api.interceptors.response.use(function (response) {
  console.log('API Response:', response.status, response.data);
  return response;
}, function (error) {
  console.error('API Response Error:', error.response?.status, error.response?.data || error.message);
  return Promise.reject(error);
});

// Auth APIs
export const registerUser = async (userData: any) => {
  try {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (credentials: any) => {
  try {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem('auth_token');
};

export const requestPasswordReset = async (email: string) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    console.error('Error requesting password reset:', error);
    throw error;
  }
};

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response.data;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// Volunteer APIs
export const registerVolunteer = async (volunteerData: any) => {
  try {
    const response = await api.post('/volunteers/register', volunteerData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error registering volunteer:', error);
    throw error;
  }
};

export const getVolunteers = async () => {
  try {
    const response = await api.get('/volunteers');
    return response.data;
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    throw error;
  }
};

export const getVolunteerOpportunities = async () => {
  try {
    const response = await api.get('/volunteer/opportunities');
    return response.data;
  } catch (error) {
    console.error('Error fetching volunteer opportunities:', error);
    throw error;
  }
};

export const getVolunteerOpportunity = async (id: string) => {
  try {
    const response = await api.get(`/volunteer/opportunities/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching volunteer opportunity ${id}:`, error);
    throw error;
  }
};

// Donation APIs
export const makeDonation = async (donationData: any) => {
  try {
    const response = await api.post('/crowdfunding/donate', donationData);
    return response.data;
  } catch (error) {
    console.error('Error processing donation:', error);
    throw error;
  }
};

export const getDonations = async () => {
  try {
    const response = await api.get('/donations');
    return response.data;
  } catch (error) {
    console.error('Error fetching donations:', error);
    throw error;
  }
};

export const getCampaignDonations = async (campaignId: string) => {
  try {
    const response = await api.get(`/donations/campaign/${campaignId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching donations for campaign ${campaignId}:`, error);
    throw error;
  }
};

export const getCampaigns = async () => {
  try {
    const response = await api.get('/crowdfunding/campaigns');
    return response.data;
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }
};

export const getCampaign = async (id: string) => {
  try {
    const response = await api.get(`/crowdfunding/campaigns/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching campaign ${id}:`, error);
    throw error;
  }
};

export const subscribeNewsletter = async (email: string) => {
  try {
    const response = await api.post('/newsletter/subscribe', { email });
    return response.data;
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    throw error;
  }
};

export const shareOpportunity = async (opportunityId: string, recipientEmail: string, senderName: string) => {
  try {
    const response = await api.post('/volunteer/share', {
      opportunityId,
      recipientEmail,
      senderName
    });
    return response.data;
  } catch (error) {
    console.error('Error sharing opportunity:', error);
    throw error;
  }
};

// Chat APIs
export const getUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getMessages = async (chatId: string) => {
  try {
    const response = await api.get(`/chats/${chatId}/messages`);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const sendMessage = async (chatId: string, content: string) => {
  try {
    const response = await api.post(`/chats/${chatId}/messages`, { content });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getChats = async () => {
  try {
    const response = await api.get('/chats');
    return response.data;
  } catch (error) {
    console.error('Error fetching chats:', error);
    throw error;
  }
};

export const createChat = async (userId: string) => {
  try {
    const response = await api.post('/chats', { userId });
    return response.data;
  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
};

export const getSharedMedia = async (chatId: string) => {
  try {
    const response = await api.get(`/chats/${chatId}/media`);
    return response.data;
  } catch (error) {
    console.error('Error fetching shared media:', error);
    throw error;
  }
};

export const getSharedFiles = async (chatId: string) => {
  try {
    const response = await api.get(`/chats/${chatId}/files`);
    return response.data;
  } catch (error) {
    console.error('Error fetching shared files:', error);
    throw error;
  }
};

export const getSharedLinks = async (chatId: string) => {
  try {
    const response = await api.get(`/chats/${chatId}/links`);
    return response.data;
  } catch (error) {
    console.error('Error fetching shared links:', error);
    throw error;
  }
};

export const uploadFile = async (chatId: string, formData: FormData) => {
  try {
    const response = await api.post(`/chats/${chatId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export default api;
