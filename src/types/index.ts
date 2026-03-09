export interface User {
    userId: number;
    username: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    role: any;
    isActive: boolean;
}

export interface Building {
    buildingId: number;
    buildingName: string;
    address: string;
    manager: User;
    totalFloors: number;
}

export interface Floor {
    floorId: number;
    floorName: string;
    building: Building;
}

export interface RoomType {
    roomTypeId: number;
    typeName: string;
    basePrice: number;
    area: number;
    maxOccupancy: number;
    description: string;
}

export interface Room {
    roomId: number;
    roomNumber: string;
    floor: Floor;
    roomType: RoomType;
    currentStatus: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
}

export interface Tenant {
    tenantId: number;
    fullName: string;
    phoneNumber: string;
    email: string;
    hometown: string;
    identityCardNumber: string;
    user?: User;
}
