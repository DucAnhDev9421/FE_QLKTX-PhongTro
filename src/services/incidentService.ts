import { api } from './api';
import { IncidentResponse, IncidentRequest, IncidentStatusRequest } from '../types/incident';

export const incidentService = {
    createIncident: async (data: IncidentRequest): Promise<IncidentResponse> => {
        const response = await api.post('/incidents', data);
        return response.data.result;
    },

    getAllIncidents: async (): Promise<IncidentResponse[]> => {
        const response = await api.get('/incidents');
        return response.data.result;
    },

    getIncidentsByRoom: async (roomId: number): Promise<IncidentResponse[]> => {
        const response = await api.get(`/incidents/room/${roomId}`);
        return response.data.result;
    },

    getIncidentsByTenant: async (tenantId: number): Promise<IncidentResponse[]> => {
        const response = await api.get(`/incidents/tenant/${tenantId}`);
        return response.data.result;
    },

    updateIncidentStatus: async (id: number, data: IncidentStatusRequest): Promise<IncidentResponse> => {
        const response = await api.put(`/incidents/${id}/status`, data);
        return response.data.result;
    }
};
