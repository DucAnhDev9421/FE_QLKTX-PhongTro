import { api } from './api';

export interface NotificationRequest {
    title: string;
    content: string; // Đồng bộ với backend (content thay vì message)
    type: string;
    targetType?: string;
    targetId?: number;
    userIds?: number[]; // Thêm userIds
}

export interface NotificationResponse {
    notificationId: number;
    title: string;
    content: string; // Đồng bộ với backend
    type: string;
    targetType?: string;
    targetId?: number;
    createdDate: string;
}

export interface UserNotificationResponse {
    id: number;
    notificationId: number;
    title: string;
    content: string;
    type: string;
    createdDate: string;
    isRead: boolean;
}

export const notificationService = {
    createNotification: async (data: NotificationRequest): Promise<NotificationResponse> => {
        const response = await api.post('/notifications', data);
        return response.data.result;
    },

    getUserNotifications: async (userId: number): Promise<UserNotificationResponse[]> => {
        const response = await api.get(`/notifications/user/${userId}`);
        return response.data.result;
    },

    markAsRead: async (userNotificationId: number): Promise<string> => {
        const response = await api.put(`/notifications/${userNotificationId}/read`);
        return response.data.result;
    }
};
