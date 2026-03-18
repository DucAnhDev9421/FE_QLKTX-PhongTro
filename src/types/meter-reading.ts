export interface MeterReading {
    id: string;
    roomId: string;
    serviceId: string;
    billingMonth: string; // e.g. "11/2026"
    previousIndex: number;
    currentIndex: number;
    imageProofUrl?: string; // Tùy chọn ảnh đồng hồ
    readingDate: string;
    recordedBy: string; // Ai ghi
}
