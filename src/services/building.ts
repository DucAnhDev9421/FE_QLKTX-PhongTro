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

export const buildingService = {
    getBuildings: async () => {
        const response = await api.get('/v1/buildings');
        return response.data;
    },

    createBuilding: async (data: any) => {
        const response = await api.post('/v1/buildings', data);
        return response.data;
    },

    updateBuilding: async (id: number | string, data: any) => {
        const response = await api.put(`/v1/buildings/${id}`, data);
        return response.data;
    },

    deleteBuilding: async (id: number | string) => {
        const response = await api.delete(`/v1/buildings/${id}`);
        return response.data;
    },

    getFloorsByBuilding: async (buildingId: number | string) => {
        const response = await api.get(`/v1/buildings/${buildingId}/floors`);
        return response.data;
    },

    createFloor: async (data: any) => {
        const response = await api.post('/v1/floors', data);
        return response.data;
    },
    
    deleteFloor: async (id: number | string) => {
        const response = await api.delete(`/v1/floors/${id}`);
        return response.data;
    },

    updateFloor: async (id: number | string, data: any) => {
        const response = await api.put(`/v1/floors/${id}`, data);
        return response.data;
    },

    assignManagerToBuildings: async (userId: number | string, buildingIds: (number | string)[]) => {
        const response = await api.put(`/v1/buildings/assign-manager/${userId}`, buildingIds);
        return response.data;
    }
};
