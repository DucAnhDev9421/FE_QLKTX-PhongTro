import { api } from './api';

export interface RevenueMonthResponse {
    month: number;
    year: number;
    totalRevenue: number;
}

export interface RevenueDetailResponse {
    month: number;
    year: number;
    rentRevenue: number;
    serviceRevenue: number;
    totalRevenue: number;
}

export interface ExpenseStatisticResponse {
    expenseType: string;
    totalAmount: number;
}

export interface OccupancyByBuildingResponse {
    buildingName: string;
    totalRooms: number;
    occupiedRooms: number;
    vacantRooms: number;
}

export interface RoomStatusStatisticsResponse {
    totalRooms: number;
    rentedRooms: number;
    emptyRooms: number;
    activeTenants: number;
}

export const statisticsService = {
    getRevenueByMonthAndYear: async (month: number, year: number, buildingId?: number): Promise<RevenueMonthResponse> => {
        const url = buildingId 
            ? `/statistics/revenue?month=${month}&year=${year}&buildingId=${buildingId}`
            : `/statistics/revenue?month=${month}&year=${year}`;
        const response = await api.get(url);
        return response.data.result;
    },

    getRoomStatusStatistics: async (buildingId?: number): Promise<RoomStatusStatisticsResponse> => {
        const url = buildingId 
            ? `/statistics/rooms?buildingId=${buildingId}`
            : '/statistics/rooms';
        const response = await api.get(url);
        return response.data.result;
    },

    getRevenueDetail: async (month: number, year: number): Promise<RevenueDetailResponse> => {
        const response = await api.get(`/statistics/revenue/detail?month=${month}&year=${year}`);
        return response.data.result;
    },

    getExpenseDistribution: async (): Promise<ExpenseStatisticResponse[]> => {
        const response = await api.get('/statistics/expenses');
        return response.data.result;
    },

    getOccupancyByBuilding: async (): Promise<OccupancyByBuildingResponse[]> => {
        const response = await api.get('/statistics/occupancy/buildings');
        return response.data.result;
    }
};

