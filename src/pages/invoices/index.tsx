import { useState } from 'react';
import { Layout } from '../../components/layout';
import { Search, Filter, Plus, FileText, CheckCircle2, AlertCircle, Clock, Send, MoreVertical, Download } from 'lucide-react';
import InvoiceModal from './components/InvoiceModal';
import { Invoice } from '../../types/invoice';

const mockInvoices: Invoice[] = [
    {
        id: 'HD-2611-001',
        roomId: 'A101',
        tenantName: 'Nguyễn Văn A',
        billingMonth: '11/2026',
        waterUsageStart: 120,
        waterUsageEnd: 135,
        electricityUsageStart: 2500,
        electricityUsageEnd: 2650,
        roomPrice: 4000000,
        otherFees: 150000,
        totalAmount: 4940000,
        status: 'PAID',
        dueDate: '2026-11-10',
        createdAt: '2026-11-01T00:00:00.000Z'
    },
    {
        id: 'HD-2611-002',
        roomId: 'B205',
        tenantName: 'Trần Thị B',
        billingMonth: '11/2026',
        waterUsageStart: 85,
        waterUsageEnd: 92,
        electricityUsageStart: 1100,
        electricityUsageEnd: 1180,
        roomPrice: 3500000,
        otherFees: 150000,
        totalAmount: 3981000,
        status: 'UNPAID',
        dueDate: '2026-11-10',
        createdAt: '2026-11-01T00:00:00.000Z'
    },
    {
        id: 'HD-2610-045',
        roomId: 'C302',
        tenantName: 'Lê Hoàng C',
        billingMonth: '10/2026',
        waterUsageStart: 45,
        waterUsageEnd: 60,
        electricityUsageStart: 800,
        electricityUsageEnd: 950,
        roomPrice: 5000000,
        otherFees: 200000,
        totalAmount: 5875000,
        status: 'OVERDUE',
        dueDate: '2026-10-10',
        createdAt: '2026-10-01T00:00:00.000Z'
    }
];

const StatusBadge = ({ status }: { status: Invoice['status'] }) => {
    switch (status) {
        case 'PAID':
            return (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 w-fit">
                    <CheckCircle2 size={14} />
                    <span className="text-xs font-medium">Đã thu</span>
                </div>
            );
        case 'UNPAID':
            return (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20 w-fit">
                    <Clock size={14} />
                    <span className="text-xs font-medium">Chưa thu</span>
                </div>
            );
        case 'OVERDUE':
            return (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-500 border border-rose-500/20 w-fit">
                    <AlertCircle size={14} />
                    <span className="text-xs font-medium">Quá hạn</span>
                </div>
            );
    }
};

export default function Invoices() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

    const handleCreate = () => {
        setSelectedInvoice(null);
        setIsModalOpen(true);
    };

    const handleEdit = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setIsModalOpen(true);
    };

    return (
        <Layout>
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100 mb-1">Quản lý hóa đơn</h1>
                    <p className="text-slate-400 text-sm">Chốt bill hàng tháng, tính tiền điện nước và gửi thông báo.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700">
                        <Download size={18} />
                        Xuất Excel
                    </button>
                    <button 
                        onClick={handleCreate}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                        <Plus size={18} />
                        Chốt bill mới
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center gap-4 group hover:border-emerald-500/50 transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <FileText size={24} />
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm font-medium mb-0.5">Tổng hóa đơn (T11/2026)</p>
                        <h3 className="text-xl font-bold text-slate-100">45,800,000đ <span className="text-sm font-normal text-slate-500">(15 HĐ)</span></h3>
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center gap-4 group hover:border-amber-500/50 transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm font-medium mb-0.5">Chưa thu hồi</p>
                        <h3 className="text-xl font-bold text-slate-100">12,500,000đ <span className="text-sm font-normal text-slate-500">(5 HĐ)</span></h3>
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center gap-4 group hover:border-rose-500/50 transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm font-medium mb-0.5">Tổng nợ quá hạn</p>
                        <h3 className="text-xl font-bold text-slate-100">5,100,000đ <span className="text-sm font-normal text-slate-500">(1 HĐ)</span></h3>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm theo mã HĐ, số phòng, người thuê..."
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    <button className="flex items-center gap-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                        <Filter size={16} />
                        Kỳ cước: 11/2026
                    </button>
                    <button className="flex items-center gap-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                        <Filter size={16} />
                        Trạng thái
                    </button>
                </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-900/50 border-b border-slate-800">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-semibold">Mã HĐ / Kỳ</th>
                                <th scope="col" className="px-6 py-4 font-semibold">Phòng / Người thuê</th>
                                <th scope="col" className="px-6 py-4 font-semibold px-2">Điện / Nước (Số)</th>
                                <th scope="col" className="px-6 py-4 font-semibold">Tổng tiền</th>
                                <th scope="col" className="px-6 py-4 font-semibold">Trạng thái</th>
                                <th scope="col" className="px-6 py-4 text-right font-semibold">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {mockInvoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-slate-800/50 transition-colors group cursor-pointer" onClick={() => handleEdit(invoice)}>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-mono text-emerald-500 font-medium">{invoice.id}</span>
                                            <span className="text-xs text-slate-500">T{invoice.billingMonth}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-slate-200 font-medium">{invoice.roomId}</span>
                                            <span className="text-xs text-slate-500">{invoice.tenantName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-slate-400">⚡ {invoice.electricityUsageEnd - invoice.electricityUsageStart} kWh</span>
                                            <span className="text-xs text-slate-400">💧 {invoice.waterUsageEnd - invoice.waterUsageStart} m³</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-slate-200 font-semibold font-mono">
                                                {invoice.totalAmount.toLocaleString()}đ
                                            </span>
                                            <span className="text-xs text-slate-500 text-rose-400">Hạn: {invoice.dueDate}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={invoice.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                className="text-slate-400 hover:text-emerald-500 p-2 rounded-lg hover:bg-slate-800 transition-colors"
                                                title="Gửi thông báo (Zalo/Email)"
                                                onClick={(e) => { e.stopPropagation(); /* Send Notice */ }}
                                            >
                                                <Send size={18} />
                                            </button>
                                            <button className="text-slate-400 hover:text-slate-200 p-2 rounded-lg hover:bg-slate-800 transition-colors">
                                                <MoreVertical size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/50">
                    <span className="text-sm text-slate-500">
                        Hiển thị <span className="font-medium text-slate-300">1</span> đến <span className="font-medium text-slate-300">3</span> trong <span className="font-medium text-slate-300">3</span> kết quả
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

            {isModalOpen && (
                <InvoiceModal 
                    invoice={selectedInvoice} 
                    onClose={() => setIsModalOpen(false)} 
                />
            )}
        </Layout>
    );
}
