import axios from 'axios';

const MOMO_API = 'http://localhost:8080/api/payments/momo';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface MoMoPaymentResponse {
    partnerCode: string;
    requestId: string;
    orderId: string;
    amount: number;
    responseTime: number;
    message: string;
    resultCode: number;
    payUrl: string;      // URL để redirect user vào trang thanh toán MoMo
    deeplink: string;
    qrCodeUrl: string;
}

export const momoService = {
    createPayment: async (invoiceId: number): Promise<MoMoPaymentResponse> => {
        const response = await axios.post(
            `${MOMO_API}/create/${invoiceId}`,
            {},
            { headers: getAuthHeaders() }
        );
        return response.data;
    },

    queryStatus: async (orderId: string): Promise<MoMoPaymentResponse> => {
        const response = await axios.get(
            `${MOMO_API}/query/${orderId}`,
            { headers: getAuthHeaders() }
        );
        return response.data;
    },
};
