export interface ServiceInfoResponse {
    serviceId: number;
    serviceName: string;
    unit: string;
    calculationMethod: string;
    icon?: string;
}

export interface ServiceInfoRequest {
    serviceName: string;
    unit: string;
    calculationMethod: string;
    icon?: string;
}

export interface BuildingServiceResponse {
    buildingServiceId: number;
    buildingId: number;
    serviceId: number;
    serviceName: string;
    unit: string;
    unitPrice: number;
}

export interface BuildingServiceRequest {
    serviceId: number;
    unitPrice: number;
}
