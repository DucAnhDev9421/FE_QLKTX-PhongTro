import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env?.VITE_API_URL || 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const userService = {
    getUsers: async (role?: string, search?: string, page: number = 0, size: number = 10) => {
        const response = await api.get('/v1/users', { params: { role, search, page, size } });
        return response.data.result;
    },
    createUser: async (data: any) => {
        const response = await api.post('/v1/users', data);
        return response.data;
    },
    updateUser: async (id: number | string, data: any) => {
        const response = await api.put(`/v1/users/${id}`, data);
        return response.data;
    },
    updateUserStatus: async (id: number | string, isActive: boolean) => {
        const response = await api.put(`/v1/users/${id}/status?isActive=${isActive}`);
        return response.data;
    },
    assignRole: async (id: number | string, roleName: string) => {
        const response = await api.put(`/v1/users/${id}/role`, { roleName });
        return response.data;
    },
    deleteUser: async (id: number | string) => {
        const response = await api.delete(`/v1/users/${id}`);
        return response.data;
    },
    getRoles: async () => {
        const response = await api.get('/v1/roles');
        return response.data;
    }
};
