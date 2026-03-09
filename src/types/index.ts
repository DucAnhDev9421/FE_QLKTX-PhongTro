export interface Room {
    id: string;
    name: string;
    capacity: number;
    currentOccupancy: number;
    status: 'available' | 'full' | 'maintenance';
    price: number;
}

export interface Tenant {
    id: string;
    tenantCode: string;
    fullName: string;
    dob: string;
    gender: 'male' | 'female';
    phone: string;
    roomId: string | null;
}
