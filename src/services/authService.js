import api from '../api/client';

export const authService = {
    async login(email, password) {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('auth_token', response.data.token);
        }
        return response.data;
    },

    async register(userData) {
        const response = await api.post('/auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('auth_token', response.data.token);
        }
        return response.data;
    },

    logout() {
        localStorage.removeItem('auth_token');
    },

    async fetchCurrentUser() {
        try {
            const response = await api.get('/auth/me');
            return response.data;
        } catch (error) {
            console.error('Error fetching current user:', error);
            return null;
        }
    },

    getCurrentUser() {
        const token = localStorage.getItem('auth_token');
        if (!token) return null;
        return this.fetchCurrentUser();
    },

    async updateProfile(profileData) {
        const response = await api.put('/auth/profile', profileData);
        return response.data;
    }
};