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
    paymentStatus: 'PENDING' | 'PAID' | 'OVERDUE';
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

// Lấy Token do project dùng cookie hoặc localStorage
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const invoiceService = {
    getInvoices: async (): Promise<Invoice[]> => {
        const response = await axios.get(INVOICE_API, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    getInvoiceById: async (id: number): Promise<Invoice> => {
        const response = await axios.get(`${INVOICE_API}/${id}`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    createInvoice: async (payload: InvoiceRequest): Promise<Invoice> => {
        const response = await axios.post(INVOICE_API, payload, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    updateInvoice: async (id: number, payload: InvoiceRequest): Promise<Invoice> => {
        const response = await axios.put(`${INVOICE_API}/${id}`, payload, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    deleteInvoice: async (id: number): Promise<void> => {
        await axios.delete(`${INVOICE_API}/${id}`, {
            headers: getAuthHeaders()
        });
    }
};
