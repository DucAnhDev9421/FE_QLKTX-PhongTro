import React from 'react';

export const Badge = ({ children, variant = "primary" }: { children: React.ReactNode, variant?: string }) => {
    return <span className={`px-2 py-1 rounded text-xs ${variant === 'primary' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>{children}</span>;
};
