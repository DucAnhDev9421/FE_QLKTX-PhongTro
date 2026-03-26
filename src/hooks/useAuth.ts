import { useState, useEffect } from 'react';
import { authService, decodeToken } from '../services/auth';
import { useNavigate } from 'react-router-dom';

export interface User {
    id: number;
    userId: number; // Thêm userId từ backend
    username: string;
    role?: string;
    roles?: string[];
    tenantId?: number;
    fullName?: string; // Thêm fullName
    [key: string]: any;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const data = await authService.getMe();
                // Depending on the backend ApiResponse format, user might be in data.result or data itself
                const userData = data?.result || data?.data || data;
                
                // Trực tiếp lấy role từ JWT token vì back-end không trả về trong getMe
                const decoded = decodeToken(token);
                if (decoded && decoded.scope) {
                    userData.role = decoded.scope;
                }
                
                // Đồng bộ id và userId
                if (userData.userId && !userData.id) {
                    userData.id = userData.userId;
                }
                
                setUser(userData);
            } catch (error) {
                console.error('Failed to fetch user', error);
                localStorage.removeItem('token');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    return { user, loading, logout };
}
