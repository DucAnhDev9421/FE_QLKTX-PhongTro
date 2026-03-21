import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-900">
                <div className="text-emerald-500 font-medium">Đang tải...</div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && allowedRoles.length > 0) {
        // Extract the role from user.role or user.roles (array)
        const userRoles = Array.isArray(user.roles) 
            ? user.roles.map(r => typeof r === 'string' ? r.toUpperCase() : r) 
            : typeof user.role === 'string' ? [user.role.toUpperCase()] : [];
        
        // Some backends prefix roles with ROLE_ or SCOPE_
        const normalizedRoles = userRoles.map(r => 
            r.startsWith('ROLE_') ? r.substring(5) : 
            r.startsWith('SCOPE_') ? r.substring(6) : r
        );
        const normalizedAllowedRoles = allowedRoles.map(r => r.toUpperCase());

        const hasAccess = normalizedRoles.some(role => normalizedAllowedRoles.includes(role));

        if (!hasAccess) {
            // User is logged in but does not have the required role
            return <Navigate to="/" replace />;
        }
    }

    return <Outlet />;
};
