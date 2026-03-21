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
import { ContractResponse, ContractRequest, MemberRequest, TerminateRequest, LiquidationResponse } from '../types/contract';

export const contractService = {
    getContracts: async (status?: string): Promise<any> => {
        const response = await api.get('/v1/contracts', { params: { status } });
        return response.data;
    },

    getContractById: async (id: number): Promise<any> => {
        const response = await api.get(`/v1/contracts/${id}`);
        return response.data;
    },

    createContract: async (data: ContractRequest): Promise<any> => {
        const response = await api.post('/v1/contracts', data);
        return response.data;
    },

    updateContract: async (id: number, data: Partial<ContractRequest>): Promise<any> => {
        const response = await api.put(`/v1/contracts/${id}`, data);
        return response.data;
    },

    addMember: async (id: number, data: MemberRequest): Promise<any> => {
        const response = await api.post(`/v1/contracts/${id}/add-member`, data);
        return response.data;
    },

    removeMember: async (id: number, tenantId: number): Promise<any> => {
        const response = await api.delete(`/v1/contracts/${id}/remove-member`, {
            params: { tenantId }
        });
        return response.data;
    },

    terminateContract: async (id: number, data: TerminateRequest): Promise<any> => {
        const response = await api.post(`/v1/contracts/${id}/terminate`, data);
        return response.data;
    },

    getLiquidationDocs: async (id: number): Promise<any> => {
        const response = await api.get(`/v1/contracts/${id}/liquidation`);
        return response.data;
    },

    downloadContractWord: async (id: number) => {
        const response = await api.get(`/v1/contracts/download/${id}`, {
            responseType: 'blob'
        });
        // Handle file download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `contract_${id}.docx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    }
};
