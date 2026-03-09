import { api } from './api';
import { mockRooms } from '../utils/mockData';

export const roomService = {
    getRooms: () => {
        // mock data cho dev
        return Promise.resolve({ data: mockRooms });
    }
};
