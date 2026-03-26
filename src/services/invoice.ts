import axios from 'axios';

const INVOICE_API = 'http://localhost:8080/api/v1/invoices';

export interface Invoice {
    invoiceId: number;
    contract: {
        contractId: number;
        room: {
            roomId: number;
            roomNumber: string;
        }
    };
    month: number;
    year: number;
    createdDate: string;
    dueDate: string;
    totalAmount: number;
    paymentStatus: 'PENDING' | 'PAID' | 'OVERDUE' | 'UNPAID';
    notes: string;
}

export interface InvoiceRequest {
    contractId: number;
    month: number;
    year: number;
    createdDate?: string | null;
    dueDate?: string | null;
    totalAmount: number;
    paymentStatus: string;
    notes?: string;
}

export interface PageResponse<T> {
    data: T[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}

// Lấy Token do project dùng cookie hoặc localStorage
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const invoiceService = {
    getInvoices: async (
        page: number = 0, 
        size: number = 10,
        filters?: {
            month?: number;
            year?: number;
            status?: string;
            buildingId?: number;
            roomNumber?: string;
        }
    ): Promise<PageResponse<Invoice>> => {
        let url = `${INVOICE_API}?page=${page}&size=${size}`;
        if (filters) {
            if (filters.month) url += `&month=${filters.month}`;
            if (filters.year) url += `&year=${filters.year}`;
            if (filters.status) url += `&status=${filters.status}`;
            if (filters.buildingId) url += `&buildingId=${filters.buildingId}`;
            if (filters.roomNumber) url += `&roomNumber=${encodeURIComponent(filters.roomNumber)}`;
        }
        const response = await axios.get(url, {
            headers: getAuthHeaders()
        });
        return response.data.result;
    },

    getInvoiceById: async (id: number): Promise<Invoice> => {
        const response = await axios.get(`${INVOICE_API}/${id}`, {
            headers: getAuthHeaders()
        });
        return response.data.result;
    },

    createInvoice: async (payload: InvoiceRequest): Promise<Invoice> => {
        const response = await axios.post(INVOICE_API, payload, {
            headers: getAuthHeaders()
        });
        return response.data.result;
    },

    updateInvoice: async (id: number, payload: InvoiceRequest): Promise<Invoice> => {
        const response = await axios.put(`${INVOICE_API}/${id}`, payload, {
            headers: getAuthHeaders()
        });
        return response.data.result;
    },

    deleteInvoice: async (id: number): Promise<void> => {
        await axios.delete(`${INVOICE_API}/${id}`, {
            headers: getAuthHeaders()
        });
    }
};
