export interface IncidentRequest {
    roomId: number;
    tenantId: number;
    description: string;
}

export interface IncidentStatusRequest {
    status: string;
}

export interface IncidentResponse {
    incidentId: number;
    roomId: number;
    roomNumber: string;
    tenantId: number;
    tenantName: string;
    description: string;
    status: string;
    reportedDate: string;
}
