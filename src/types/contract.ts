export interface ContractMemberResponse {
    contractTenantId: number;
    tenantId: number;
    fullName: string;
    phoneNumber: string;
    isRepresentative: boolean;
}

export interface ContractResponse {
    contractId: number;
    roomId: number;
    roomNumber: string;
    rentalPrice: number;
    depositAmount: number;
    startDate: string;
    endDate: string | null;
    contractStatus: string; // ACTIVE, EXPIRED, TERMINATED
    members: ContractMemberResponse[];
}

export interface ContractRequest {
    roomId: number;
    representativeTenantId: number;
    startDate: string;
    endDate?: string | null;
    rentalPrice: number;
    depositAmount?: number;
    paymentCycle?: number;
}

export interface MemberRequest {
    tenantId: number;
}

export interface TerminateRequest {
    deductionAmount: number;
    deductionReason?: string;
    finalElectricityReading?: number;
    finalWaterReading?: number;
}

export interface LiquidationResponse {
    contractId: number;
    liquidationDate: string;
    depositAmount: number;
    deductionAmount: number;
    refundAmount: number;
    deductionReason: string;
    contractStatus: string;
    finalElectricityReading: number;
    finalWaterReading: number;
}

export interface RoomRegistrationRequest {
    roomId: number;
    startDate: string;
    endDate: string;
    paymentMethod: 'MOMO' | 'CASH';
}

export interface ContractRegistrationResponse {
    contract: ContractResponse;
    depositInvoice: {
        invoiceId: number;
        totalAmount: number;
        paymentStatus: string;
        notes: string;
    };
    payUrl?: string;
}

export interface MyRoomResponse {
    room: any; // RoomResponse
    roommates: any[]; // TenantResponse[]
    services: any[]; // BuildingServiceResponse[]
    recentInvoices: any[]; // InvoiceResponse[]
    contract: ContractResponse;
}
