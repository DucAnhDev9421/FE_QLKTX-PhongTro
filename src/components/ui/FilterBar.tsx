import React from 'react';

export const FilterBar = ({ onFilter }: { onFilter: (value: string) => void }) => {
    return (
        <div className="my-4 flex">
            <input
                type="text"
                placeholder="Tìm kiếm..."
                className="border p-2 rounded w-full max-w-md"
                onChange={(e) => onFilter(e.target.value)}
            />
        </div>
    );
};
