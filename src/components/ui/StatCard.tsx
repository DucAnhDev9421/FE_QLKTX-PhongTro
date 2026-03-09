import React from 'react';

export const StatCard = ({ title, value, icon }: { title: string, value: string | number, icon?: React.ReactNode }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow min-w-[200px] flex items-center space-x-4">
            {icon && <div className="text-3xl text-blue-500">{icon}</div>}
            <div>
                <h3 className="text-gray-500 text-sm">{title}</h3>
                <p className="text-2xl font-bold">{value}</p>
            </div>
        </div>
    );
};
