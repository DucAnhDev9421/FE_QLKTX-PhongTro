import { useQuery } from '@tanstack/react-query';
import { tenantService } from '../services';

export const useTenants = () => {
    return useQuery({
        queryKey: ['tenants'],
        queryFn: () => tenantService.getTenants().then(res => res.data),
    });
};
