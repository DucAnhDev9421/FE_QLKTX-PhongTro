export interface Invoice {
    id: string;
    roomId: string;
    tenantName: string;
    billingMonth: string; // e.g., "11/2026"
    waterUsageStart: number;
    waterUsageEnd: number;
    electricityUsageStart: number;
    electricityUsageEnd: number;
    roomPrice: number;
    otherFees: number;
    totalAmount: number;
    status: 'PAID' | 'UNPAID' | 'OVERDUE';
    dueDate: string;
    createdAt: string;
}
