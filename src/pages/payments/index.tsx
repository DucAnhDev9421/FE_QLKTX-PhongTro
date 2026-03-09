import { useState } from 'react';
import { Layout } from '../../components/layout';
import { CreditCard, Download, Search, Filter, MoreVertical, CheckCircle2, AlertCircle, Clock, Receipt } from 'lucide-react';

// Mock Data
const mockPayments = [
    {
        id: 'PAY-202611-001',
        room: 'A101',
        tenant: 'Nguyễn Văn A',
        amount: 4500000,
        type: 'Tiền phòng + Dịch vụ',
        status: 'PAID',
        date: '2026-11-05',
        method: 'Chuyển khoản',
    },
    {
        id: 'PAY-202611-002',
        room: 'B205',
        tenant: 'Trần Thị B',
        amount: 3200000,
        type: 'Tiền phòng',
        status: 'PENDING',
        date: '2026-11-10',
        method: '-',
    },
    {
        id: 'PAY-202611-003',
        room: 'C302',
        tenant: 'Lê Hoàng C',
        amount: 5100000,
        type: 'Tiền phòng + Điện nước',
        status: 'OVERDUE',
        date: '2026-11-01',
        method: '-',
    },
    {
        id: 'PAY-202610-045',
        room: 'A105',
        tenant: 'Phạm D',
        amount: 4000000,
        type: 'Tiền phòng',
        status: 'PAID',
        date: '2026-10-28',
        method: 'Tiền mặt',
    },
    {
        id: 'PAY-202611-005',
        room: 'D101',
        tenant: 'Hoàng E',
        amount: 6000000,
        type: 'Cọc phòng',
        status: 'PAID',
        date: '2026-11-12',
        method: 'Chuyển khoản',
    }
];

const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
        case 'PAID':
            return (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 w-fit">
                    <CheckCircle2 size={14} />
                    <span className="text-xs font-medium">Đã thanh toán</span>
                </div>
            );
        case 'PENDING':
            return (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20 w-fit">
                    <Clock size={14} />
                    <span className="text-xs font-medium">Chờ thanh toán</span>
                </div>
            );
        case 'OVERDUE':
            return (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-500 border border-rose-500/20 w-fit">
                    <AlertCircle size={14} />
                    <span className="text-xs font-medium">Quá hạn</span>
                </div>
            );
        default:
            return null;
    }
};

export default function Payments() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <Layout>
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100 mb-1">Thiết lập hóa đơn & Thanh toán</h1>
                    <p className="text-slate-400 text-sm">Quản lý các khoản thu, chi và hóa đơn điện nước hàng tháng.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700">
                        <Download size={18} />
                        Xuất Excel
                    </button>
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-emerald-500/20">
                        <Receipt size={18} />
                        Lập phiếu thu mới
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden group">
                    <div className="flex items-start justify-between relative z-10">
                        <div>
                            <p className="text-slate-400 text-sm font-medium mb-1">Tổng thu tháng này</p>
                            <h3 className="text-2xl font-bold text-slate-100">45,800,000đ</h3>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <CreditCard size={20} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm relative z-10">
                        <span className="text-emerald-500 font-medium flex items-center">
                            ↑ 12.5%
                        </span>
                        <span className="text-slate-500">so với tháng trước</span>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden group">
                    <div className="flex items-start justify-between relative z-10">
                        <div>
                            <p className="text-slate-400 text-sm font-medium mb-1">Chờ thanh toán</p>
                            <h3 className="text-2xl font-bold text-amber-500">12,500,000đ</h3>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                            <Clock size={20} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm relative z-10">
                        <span className="text-slate-400 font-medium">5 hóa đơn</span>
                        <span className="text-slate-500">đang chờ thu</span>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden group">
                    <div className="flex items-start justify-between relative z-10">
                        <div>
                            <p className="text-slate-400 text-sm font-medium mb-1">Nợ quá hạn</p>
                            <h3 className="text-2xl font-bold text-rose-500">5,100,000đ</h3>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                            <AlertCircle size={20} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm relative z-10">
                        <span className="text-rose-500 font-medium">1 hóa đơn</span>
                        <span className="text-slate-500">cần nhắc nhở</span>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm theo mã phiếu, phòng, tên người nộp..."
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    <button className="flex items-center gap-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                        <Filter size={16} />
                        Tháng: 11/2026
                    </button>
                    <button className="flex items-center gap-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                        <Filter size={16} />
                        Trạng thái
                    </button>
                </div>
            </div>

            {/* Payments Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-900/50 border-b border-slate-800">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-semibold">Mã phiếu</th>
                                <th scope="col" className="px-6 py-4 font-semibold">Phòng / Người nộp</th>
                                <th scope="col" className="px-6 py-4 font-semibold">Loại khoản thu</th>
                                <th scope="col" className="px-6 py-4 font-semibold">Số tiền</th>
                                <th scope="col" className="px-6 py-4 font-semibold">Trạng thái</th>
                                <th scope="col" className="px-6 py-4 font-semibold">Ngày tạo/thu</th>
                                <th scope="col" className="px-6 py-4 text-right font-semibold">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {mockPayments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-emerald-500 font-medium">{payment.id}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-slate-200 font-medium">{payment.room}</span>
                                            <span className="text-xs text-slate-500">{payment.tenant}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-slate-300">{payment.type}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-slate-200 font-semibold font-mono">
                                            {payment.amount.toLocaleString()}đ
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={payment.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-slate-300">{payment.date}</span>
                                            <span className="text-xs text-slate-500">{payment.method}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-emerald-500 p-2 rounded-lg hover:bg-slate-800 transition-colors">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/50">
                    <span className="text-sm text-slate-500">
                        Hiển thị <span className="font-medium text-slate-300">1</span> đến <span className="font-medium text-slate-300">5</span> trong <span className="font-medium text-slate-300">5</span> kết quả
                    </span>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                            Trước
                        </button>
                        <button className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-sm font-medium">
                            1
                        </button>
                        <button className="px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                            Sau
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
