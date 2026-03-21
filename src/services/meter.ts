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

export const meterService = {
    // Services Endpoint (Global)
    getAllServices: async () => {
        const response = await api.get('/v1/services');
        return response.data;
    },

    createService: async (data: any) => {
        const response = await api.post('/v1/services', data);
        return response.data;
    },

    updateService: async (id: number | string, data: any) => {
        const response = await api.put(`/v1/services/${id}`, data);
        return response.data;
    },

    // Building Services (Pricing)
    getBuildingServices: async (buildingId: number | string) => {
        const response = await api.get(`/v1/buildings/${buildingId}/services`);
        return response.data;
    },

    upsertBuildingService: async (buildingId: number | string, data: any) => {
        const response = await api.post(`/v1/buildings/${buildingId}/services`, data);
        return response.data;
    },

    // Meter Readings Endpoint
    getReadings: async (params?: { roomId?: number, month?: number, year?: number }) => {
        const response = await api.get('/v1/meter-readings', { params });
        return response.data;
    },

    getLastMonthReading: async (roomId: number, serviceId: number) => {
        const response = await api.get('/v1/meter-readings/last-month', {
            params: { roomId, serviceId }
        });
        return response.data;
    },

    recordReading: async (data: any) => {
        const response = await api.post('/v1/meter-readings', data);
        return response.data;
    },

    bulkRecord: async (data: any[]) => {
        const response = await api.post('/v1/meter-readings/bulk', data);
        return response.data;
    },

    updateReading: async (id: number | string, data: any) => {
        const response = await api.put(`/v1/meter-readings/${id}`, data);
        return response.data;
    }
};
