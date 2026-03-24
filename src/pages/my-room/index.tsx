import { RefreshCw, AlertCircle, ArrowLeft, CreditCard, FileText, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { contractService } from '../../services';
import RoomOverviewCard from './components/RoomOverviewCard';
import RoommatesList from './components/RoommatesList';
import ServicesCard from './components/ServicesCard';
import RecentInvoices from './components/RecentInvoices';

export default function MyRoom() {
    const navigate = useNavigate();
    
    const { data: apiData, isLoading, error } = useQuery({
        queryKey: ['myRoom'],
        queryFn: () => contractService.getMyRoom(),
    });

    const roomData = apiData && apiData.room ? {
        roomName: apiData.room.roomNumber,
        building: apiData.room.buildingName,
        floor: apiData.room.floorName,
        roomType: apiData.room.roomTypeName,
        status: apiData.room.currentStatus,
        joinDate: apiData.contract?.startDate,
        price: apiData.room.price,
        members: (apiData.contract?.members || []).map((m: any) => ({
            id: m.tenantId,
            name: m.fullName,
            phone: m.phoneNumber,
            role: m.isRepresentative ? 'Đại diện' : 'Thành viên',
            joinDate: apiData.contract?.startDate 
        })),
        services: (apiData.services || []).map((s: any) => ({
            id: s.buildingServiceId,
            name: s.serviceName,
            type: 'FIXED', 
            unit: s.unit,
            price: s.unitPrice
        })),
        invoices: (apiData.recentInvoices || []).map((i: any) => ({
            id: i.invoiceId,
            month: i.month,
            year: i.year,
            totalAmount: i.totalAmount,
            status: i.paymentStatus,
            dueDate: i.dueDate
        }))
    } : null;

    const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN').format(amount);

    // Loading state
    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                            <RefreshCw className="h-7 w-7 animate-spin text-emerald-500" />
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-slate-300 font-medium">Đang tải thông tin</p>
                        <p className="text-slate-600 text-sm mt-1">Vui lòng chờ trong giây lát...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-950">
                <div className="flex flex-col items-center text-center max-w-sm px-6">
                    <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-5">
                        <AlertCircle className="h-8 w-8 text-red-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-100 mb-2">Đã có lỗi xảy ra</h2>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Không thể tải thông tin phòng. Vui lòng thử lại sau hoặc liên hệ quản lý.
                    </p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-6 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-all text-sm font-medium hover:border-slate-600"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    // Empty state
    if (!roomData) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-950">
                <div className="flex flex-col items-center text-center max-w-sm px-6">
                    <div className="w-20 h-20 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-5 border border-slate-700/50">
                        <AlertCircle className="h-10 w-10 text-slate-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-100 mb-2">Chưa có phòng</h2>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Bạn chưa được gán vào phòng nào, hoặc hợp đồng chưa bắt đầu. Liên hệ quản lý để biết thêm.
                    </p>
                    <button 
                        onClick={() => navigate('/rooms')}
                        className="mt-6 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all text-sm font-semibold shadow-lg shadow-emerald-900/30"
                    >
                        Tìm phòng
                    </button>
                </div>
            </div>
        );
    }

    // Calculate quick stats
    const totalPending = roomData.invoices.filter((i: any) => i.status !== 'PAID').reduce((sum: number, i: any) => sum + (i.totalAmount || 0), 0);
    const pendingCount = roomData.invoices.filter((i: any) => i.status !== 'PAID').length;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6 pb-16">
                {/* Header */}
                <div className="flex items-center gap-4 mb-2">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-800 hover:border-slate-700 transition-all"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-extrabold text-white tracking-tight">Phòng của tôi</h1>
                        <p className="text-slate-500 text-sm mt-0.5">Quản lý không gian ở, dịch vụ và thanh toán</p>
                    </div>
                </div>

                {/* Room Hero Card */}
                <RoomOverviewCard room={roomData} />

                {/* Quick Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
                        <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                            <FileText className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Tổng hóa đơn</p>
                            <p className="text-lg font-bold text-slate-100">{roomData.invoices.length}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
                        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                            <CreditCard className="h-5 w-5 text-amber-400" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Chưa thanh toán</p>
                            <p className="text-lg font-bold text-slate-100">
                                {pendingCount > 0 ? `${formatCurrency(totalPending)} đ` : '0 đ'}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
                        <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
                            <Users className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Thành viên</p>
                            <p className="text-lg font-bold text-slate-100">{roomData.members.length} người</p>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Invoices (takes 2 cols) */}
                    <div className="lg:col-span-2">
                        <RecentInvoices invoices={roomData.invoices} />
                    </div>

                    {/* Right Column: Members & Services */}
                    <div className="space-y-6">
                        <RoommatesList members={roomData.members} />
                        <ServicesCard services={roomData.services} />
                    </div>
                </div>
            </div>
        </div>
    );
}
