import { api } from './api';

export interface BuildingServiceResponse {
    buildingServiceId: number;
    buildingId: number;
    serviceId: number;
    serviceName: string;
    unit: string;
    unitPrice: number;
}

export const configService = {
    getBuildingServices: async (buildingId: number): Promise<{ result: BuildingServiceResponse[] }> => {
        const response = await api.get(`/v1/buildings/${buildingId}/services`);
        return response.data;
    },
    
    getAllServices: async () => {
        const response = await api.get('/v1/services');
        return response.data;
    }
};
