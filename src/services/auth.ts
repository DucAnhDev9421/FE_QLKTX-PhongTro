import axios from 'axios';

// Sử dụng một instance axios riêng biệt cho Auth để tránh bị đính kèm header Authorization (Token cũ)
const authApi = axios.create({
    baseURL: import.meta.env?.VITE_API_URL || 'http://localhost:8080/api',
    timeout: 10000,
});

export const authService = {
    login: async (data: any) => {
        const response = await authApi.post('/v1/auth/login', data);
        return response.data;
    },
    register: async (data: any) => {
        const response = await authApi.post('/v1/auth/register', data);
        return response.data;
    },
    getMe: async () => {
        const response = await authApi.get('/v1/auth/me', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    },
    updateProfile: async (data: any) => {
        const response = await authApi.put('/v1/auth/me', data, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },
    changePassword: async (data: any) => {
        const response = await authApi.put('/v1/auth/change-password', data, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    }
};

export const decodeToken = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (error) {
        return null;
    }
};
