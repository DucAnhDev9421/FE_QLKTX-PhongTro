import React from 'react';

export const Pagination = ({ currentPage, totalPages }: { currentPage: number, totalPages: number }) => {
    return (
        <div className="flex justify-center mt-4 space-x-2">
            <button className="px-3 py-1 border rounded" disabled={currentPage === 1}>Prev</button>
            <span className="px-3 py-1">Page {currentPage} of {totalPages}</span>
            <button className="px-3 py-1 border rounded" disabled={currentPage === totalPages}>Next</button>
        </div>
    );
};
