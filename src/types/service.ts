export interface Service {
    id: string;
    name: string;
    unit: string;
    basePrice: number;
    type: 'METERED' | 'FIXED';
    description?: string;
    status: 'ACTIVE' | 'INACTIVE';
}

export interface BuildingService {
    id: string;
    buildingId: string;
    serviceId: string;
    customPrice: number;
}
