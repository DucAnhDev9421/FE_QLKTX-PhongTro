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

export const tenantService = {
    getTenants: async (keyword?: string) => {
        const params = keyword ? { keyword } : {};
        const response = await api.get('/v1/tenants', { params });
        return response.data;
    },

    getTenantDetail: async (id: number | string) => {
        const response = await api.get(`/v1/tenants/${id}`);
        return response.data;
    },

    createTenant: async (data: any) => {
        const response = await api.post('/v1/tenants', data);
        return response.data;
    },

    updateTenant: async (id: number | string, data: any) => {
        const response = await api.put(`/v1/tenants/${id}`, data);
        return response.data;
    },

    uploadCCCD: async (id: number | string, frontImage?: File, backImage?: File) => {
        const formData = new FormData();
        if (frontImage) formData.append('frontImage', frontImage);
        if (backImage) formData.append('backImage', backImage);

        const response = await api.post(`/v1/tenants/${id}/upload-cccd`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    exportPolice: async () => {
        const response = await api.get('/v1/tenants/export-police', {
            responseType: 'blob' // Required for downloading files
        });
        
        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'tenants.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        return true;
    }
};
