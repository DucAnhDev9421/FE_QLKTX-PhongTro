export interface IncidentRequest {
    roomId: number;
    description: string;
    priority?: string;
    // adding typical fields based on BE APIs
}

export interface IncidentStatusRequest {
    status: string;
}

export interface IncidentResponse {
    incidentId: number;
    description: string;
    status: string;
    priority?: string;
    createdDate?: string;
    room?: {
        roomId: number;
        roomNumber: string;
    };
    tenant?: {
        tenantId: number;
        fullName: string;
    };
}
