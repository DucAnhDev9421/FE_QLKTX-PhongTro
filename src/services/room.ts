import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env?.VITE_API_URL || 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Authorization header
    }
    return config;
});

export const roomService = {
    // Room Types
    getRoomTypes: async () => {
        const response = await api.get('/v1/room-types');
        return response.data;
    },

    createRoomType: async (data: any) => {
        const response = await api.post('/v1/room-types', data);
        return response.data;
    },

    // Rooms
    getRooms: async (params?: { floorId?: number, status?: string, minPrice?: number, maxPrice?: number }) => {
        const response = await api.get('/v1/rooms', { params });
        return response.data;
    },

    getRoomDetail: async (id: number | string) => {
        const response = await api.get(`/v1/rooms/${id}`);
        return response.data;
    },

    createRoom: async (data: any) => {
        const response = await api.post('/v1/rooms', data);
        return response.data;
    },

    updateRoom: async (id: number | string, data: any) => {
        const response = await api.put(`/v1/rooms/${id}`, data);
        return response.data;
    },

    updateRoomStatus: async (id: number | string, status: string) => {
        const response = await api.patch(`/v1/rooms/${id}/status`, { status });
        return response.data;
    }
};
