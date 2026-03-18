export interface Building {
    id: string;
    name: string;
    address: string;
    numberOfFloors: number;
    totalRooms: number;
    managerId?: string;
    status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
    createdAt: string;
}
