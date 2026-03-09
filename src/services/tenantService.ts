import { api } from './api';
import { mockTenants } from '../utils/mockData';

export const tenantService = {
    getTenants: () => {
        // mock data cho dev
        return Promise.resolve({ data: mockTenants });
    }
};
