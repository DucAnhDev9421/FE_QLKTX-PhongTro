import { Room, Tenant } from '../types';

export const mockRooms: Room[] = [
    { id: '1', name: 'Phòng 101', capacity: 4, currentOccupancy: 4, status: 'full', price: 1500000 },
    { id: '2', name: 'Phòng 102', capacity: 4, currentOccupancy: 2, status: 'available', price: 1500000 },
    { id: '3', name: 'Phòng 103', capacity: 6, currentOccupancy: 0, status: 'maintenance', price: 1200000 },
];

export const mockTenants: Tenant[] = [
    { id: '1', tenantCode: 'NT001', fullName: 'Nguyễn Văn A', dob: '2000-01-01', gender: 'male', phone: '0123456789', roomId: '1' },
    { id: '2', tenantCode: 'NT002', fullName: 'Trần Thị B', dob: '2000-02-02', gender: 'female', phone: '0987654321', roomId: '1' },
];
