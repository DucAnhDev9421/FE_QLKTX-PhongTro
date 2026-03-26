import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1';

export interface Asset {
    assetId: number;
    assetName: string;
    assetCode?: string;
    purchasePrice?: number;
    purchaseDate?: string;
}

export interface AssetRequest {
    assetName: string;
    assetCode?: string;
    purchasePrice?: number;
    purchaseDate?: string;
}

export interface RoomAsset {
    roomAssetId: number;
    roomId: number;
    roomNumber: string;
    assetId: number;
    assetName: string;
    quantity: number;
    conditionStatus: string;
}

export interface RoomAssetRequest {
    roomId: number;
    assetId: number;
    quantity: number;
    conditionStatus?: string;
}

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const assetService = {
    // ---- Global Assets ----
    getAllAssets: async (): Promise<{ result: Asset[] }> => {
        const response = await axios.get(`${API_URL}/assets`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    createAsset: async (payload: AssetRequest): Promise<{ result: Asset }> => {
        const response = await axios.post(`${API_URL}/assets`, payload, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    updateAsset: async (id: number, payload: AssetRequest): Promise<{ result: Asset }> => {
        const response = await axios.put(`${API_URL}/assets/${id}`, payload, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    deleteAsset: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/assets/${id}`, {
            headers: getAuthHeaders()
        });
    },

    // ---- Room Assets ----
    getAssetsByRoom: async (roomId: number): Promise<{ result: RoomAsset[] }> => {
        const response = await axios.get(`${API_URL}/rooms/${roomId}/assets`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    assignAssetToRoom: async (payload: RoomAssetRequest): Promise<{ result: RoomAsset }> => {
        const response = await axios.post(`${API_URL}/room-assets`, payload, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    bulkAssignAssets: async (payload: any): Promise<{ result: string }> => {
        const response = await axios.post(`${API_URL}/room-assets/bulk`, payload, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    bulkRemoveAssets: async (payload: any): Promise<{ result: string }> => {
        const response = await axios.delete(`${API_URL}/room-assets/bulk`, {
            data: payload,
            headers: getAuthHeaders()
        });
        return response.data;
    },

    updateRoomAsset: async (id: number, payload: RoomAssetRequest): Promise<{ result: RoomAsset }> => {
        const response = await axios.put(`${API_URL}/room-assets/${id}`, payload, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    removeRoomAsset: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/room-assets/${id}`, {
            headers: getAuthHeaders()
        });
    }
};
