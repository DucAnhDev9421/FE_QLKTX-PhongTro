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
}

export interface LiquidationResponse {
    contractId: number;
    liquidationDate: string;
    depositAmount: number;
    deductionAmount: number;
    refundAmount: number;
    deductionReason: string;
    contractStatus: string;
}
