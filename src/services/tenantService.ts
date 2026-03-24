import { api } from './api';

export const tenantService = {
    getTenants: async () => {
        const response = await api.get('/v1/tenants');
        return response.data.result;
    }
};

