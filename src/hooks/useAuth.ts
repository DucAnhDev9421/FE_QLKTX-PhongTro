import { authService, decodeToken } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export interface User {
    id: number;
    userId: number;
    username: string;
    role?: string;
    roles?: string[];
    tenantId?: number;
    fullName?: string;
    [key: string]: any;
}

export function useAuth() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const token = localStorage.getItem('token');

    const { data: user, isLoading: loading, error } = useQuery({
        queryKey: ['auth', 'me'],
        queryFn: async () => {
            if (!token) return null;
            
            try {
                const data = await authService.getMe();
                // Handle different response formats
                const userData = data?.result || data?.data || data;
                
                // Augment with role from token
                const decoded = decodeToken(token);
                if (decoded && decoded.scope) {
                    userData.role = decoded.scope;
                }
                
                // Sync IDs
                if (userData.userId && !userData.id) {
                    userData.id = userData.userId;
                }
                
                return userData as User;
            } catch (err) {
                localStorage.removeItem('token');
                throw err;
            }
        },
        enabled: !!token,
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10,  // 10 minutes
        retry: false,
    });

    const logout = () => {
        localStorage.removeItem('token');
        queryClient.setQueryData(['auth', 'me'], null);
        queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
        navigate('/login');
    };

    return { 
        user: user || null, 
        loading, 
        logout,
        isAuthenticated: !!user && !!token,
        error 
    };
}
