import { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RoomOverviewCard from './components/RoomOverviewCard';
import RoommatesList from './components/RoommatesList';
import ServicesCard from './components/ServicesCard';
import RecentInvoices from './components/RecentInvoices';

export default function MyRoom() {
    const navigate = useNavigate();
    // MOCK DATA FOR NOW
    const [isLoading, setIsLoading] = useState(true);
    const [roomData, setRoomData] = useState<any>(null);

    useEffect(() => {
        // Simulate API fetch delay
        setTimeout(() => {
            setRoomData({
                roomName: "Phòng 101",
                building: "Ký túc xá A",
                floor: 1,
                roomType: "Phòng 4 người (Bao trọn)",
                status: "ACTIVE",
                joinDate: "2023-09-01",
                members: [
                    { id: 1, name: "Nguyễn Văn A", phone: "0901234567", role: "Đại diện", joinDate: "2023-09-01" },
                    { id: 2, name: "Trần Thị B", phone: "0912345678", role: "Thành viên", joinDate: "2023-09-01" },
                    { id: 3, name: "Lê Văn C", phone: "0923456789", role: "Thành viên", joinDate: "2023-10-01" }
                ],
                services: [
                    { id: 1, name: "Điện", type: "METERED", unit: "kWh", price: 3500 },
                    { id: 2, name: "Nước", type: "FIXED_PER_USER", unit: "Người", price: 50000 },
                    { id: 3, name: "Internet", type: "FIXED_PER_ROOM", unit: "Phòng", price: 100000 },
                    { id: 4, name: "Rác", type: "FIXED_PER_ROOM", unit: "Phòng", price: 30000 }
                ],
                invoices: [
                    { id: 1, month: 2, year: 2024, totalAmount: 4350000, status: "PENDING", dueDate: "2024-03-05" },
                    { id: 2, month: 1, year: 2024, totalAmount: 4200000, status: "PAID", dueDate: "2024-02-05", momoOrderId: "INV-2-123" },
                    { id: 3, month: 12, year: 2023, totalAmount: 4150000, status: "PAID", dueDate: "2024-01-05" }
                ]
            });
            setIsLoading(false);
        }, 1000);
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <div className="flex flex-col items-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-emerald-500 mb-4" />
                    <p className="text-slate-400">Đang tải thông tin phòng...</p>
                </div>
            </div>
        );
    }

    if (!roomData) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <div className="flex flex-col items-center text-center max-w-md">
                    <AlertCircle className="h-12 w-12 text-slate-500 mb-4" />
                    <h2 className="text-xl font-semibold text-slate-200 mb-2">Chưa có thông tin phòng</h2>
                    <p className="text-slate-400">
                        Bạn hiện chưa được gán vào phòng nào, hoặc hợp đồng của bạn chưa bắt đầu. 
                        Vui lòng liên hệ quản lý để biết thêm chi tiết.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-300">
            <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-6 pb-12">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate(-1)}
                            className="p-2 mr-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-100 mb-1">Căn phòng của tôi</h1>
                            <p className="text-slate-400 text-sm">Quản lý không gian ở, dịch vụ và biên lai thanh toán</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column (Main Info & Invoices) */}
                    <div className="lg:col-span-2 space-y-6">
                        <RoomOverviewCard room={roomData} />
                        <RecentInvoices invoices={roomData.invoices} />
                    </div>

                    {/* Right Column (Roommates & Services) */}
                    <div className="space-y-6">
                        <RoommatesList members={roomData.members} />
                        <ServicesCard services={roomData.services} />
                    </div>
                </div>
            </div>
        </div>
    );
}
