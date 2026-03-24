import { api } from './api';

export interface NotificationRequest {
    title: string;
    message: string;
    type: string;
    targetType: string;
    targetId?: number;
}

export interface NotificationResponse {
    notificationId: number;
    title: string;
    message: string;
    type: string;
    targetType: string;
    targetId?: number;
    createdDate: string;
}

export interface UserNotificationResponse {
    userNotificationId: number;
    notificationTitle: string;
    notificationMessage: string;
    notificationType: string;
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
