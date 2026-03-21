import { useState, useMemo } from 'react';
import { Layout } from '../../components/layout';
import { Search, Filter, Plus, FileText, CheckCircle2, AlertCircle, Clock, Send, MoreVertical, Download, Loader2 } from 'lucide-react';
import InvoiceModal from './components/InvoiceModal';
import { useQuery } from '@tanstack/react-query';
import { invoiceService, Invoice } from '../../services/invoice';

const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
        case 'PAID':
            return (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 w-fit">
                    <CheckCircle2 size={14} />
                    <span className="text-xs font-medium">Đã thu</span>
                </div>
            );
        case 'UNPAID':
        case 'PENDING':
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
        default:
            return null;
    }
};

export default function Invoices() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

    // Fetch invoices from BE
    const { data: invoicesData, isLoading } = useQuery({
        queryKey: ['invoices'],
        queryFn: () => invoiceService.getInvoices()
    });

    // Cấu trúc trả về có thể được bọc trong `result` tùy backend formatter
    const invoices: Invoice[] = (invoicesData as any)?.result || invoicesData || [];

    const handleCreate = () => {
        setSelectedInvoice(null);
        setIsModalOpen(true);
    };

    const handleEdit = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setIsModalOpen(true);
    };

    // Derived states
    const filteredInvoices = useMemo(() => {
        return invoices.filter((inv) => {
             const searchLower = searchTerm.toLowerCase();
             const matchRoom = inv.contract?.room?.roomNumber?.toLowerCase().includes(searchLower);
             const matchInvId = String(inv.invoiceId).includes(searchLower);
             return matchRoom || matchInvId;
        });
    }, [invoices, searchTerm]);

    const stats = useMemo(() => {
        let totalAmount = 0;
        let totalCount = 0;
        let unpaidAmount = 0;
        let unpaidCount = 0;
        let overdueAmount = 0;
        let overdueCount = 0;

        invoices.forEach((inv) => {
            totalAmount += inv.totalAmount || 0;
            totalCount++;
            if (inv.paymentStatus === 'PENDING') {
                unpaidAmount += inv.totalAmount || 0;
                unpaidCount++;
            } else if (inv.paymentStatus === 'OVERDUE') {
                overdueAmount += inv.totalAmount || 0;
                overdueCount++;
            }
        });

        return { totalAmount, totalCount, unpaidAmount, unpaidCount, overdueAmount, overdueCount };
    }, [invoices]);

    return (
        <Layout>
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100 mb-1">Quản lý hóa đơn</h1>
                    <p className="text-slate-400 text-sm">Chốt bill hàng tháng, tổng hợp tiền điện nước và dịch vụ.</p>
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
                        Tạo Hóa đơn
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
                        <p className="text-slate-400 text-sm font-medium mb-0.5">Tổng hóa đơn (Tất cả)</p>
                        <h3 className="text-xl font-bold text-slate-100">{stats.totalAmount.toLocaleString()}đ <span className="text-sm font-normal text-slate-500">({stats.totalCount} HĐ)</span></h3>
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center gap-4 group hover:border-amber-500/50 transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm font-medium mb-0.5">Chưa thu hồi</p>
                        <h3 className="text-xl font-bold text-slate-100">{stats.unpaidAmount.toLocaleString()}đ <span className="text-sm font-normal text-slate-500">({stats.unpaidCount} HĐ)</span></h3>
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center gap-4 group hover:border-rose-500/50 transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm font-medium mb-0.5">Tổng nợ quá hạn</p>
                        <h3 className="text-xl font-bold text-slate-100">{stats.overdueAmount.toLocaleString()}đ <span className="text-sm font-normal text-slate-500">({stats.overdueCount} HĐ)</span></h3>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm theo mã HĐ, số phòng..."
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    <button className="flex items-center gap-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                        <Filter size={16} />
                        Kỳ cước
                    </button>
                    <button className="flex items-center gap-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                        <Filter size={16} />
                        Trạng thái
                    </button>
                </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden relative min-h-[300px]">
                {isLoading && (
                    <div className="absolute inset-0 z-10 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                    </div>
                )}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-900/50 border-b border-slate-800">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-semibold">Mã HĐ / Kỳ</th>
                                <th scope="col" className="px-6 py-4 font-semibold">Phòng</th>
                                <th scope="col" className="px-6 py-4 font-semibold px-2">Ngày lập</th>
                                <th scope="col" className="px-6 py-4 font-semibold">Tổng tiền</th>
                                <th scope="col" className="px-6 py-4 font-semibold">Trạng thái (Hạn)</th>
                                <th scope="col" className="px-6 py-4 text-right font-semibold">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredInvoices.length === 0 && !isLoading && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        Không tìm thấy hóa đơn nào
                                    </td>
                                </tr>
                            )}
                            {filteredInvoices.map((invoice) => (
                                <tr key={invoice.invoiceId} className="hover:bg-slate-800/50 transition-colors group cursor-pointer" onClick={() => handleEdit(invoice)}>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-mono text-emerald-500 font-medium">#INV-{invoice.invoiceId}</span>
                                            <span className="text-xs text-slate-500">T{invoice.month}/{invoice.year}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-slate-200 font-medium">Phòng {invoice.contract?.room?.roomNumber || 'Trống'}</span>
                                            <span className="text-xs text-slate-500">Hợp đồng: {invoice.contract?.contractId}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-300">
                                        {invoice.createdDate || '---'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-slate-200 font-semibold font-mono">
                                                {invoice.totalAmount?.toLocaleString()}đ
                                            </span>
                                            {invoice.notes && <span className="text-[10px] text-slate-500 truncate max-w-[120px]">{invoice.notes}</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1 items-start">
                                            <StatusBadge status={invoice.paymentStatus} />
                                            {invoice.dueDate && <span className="text-[10px] text-slate-500">Hạn: {invoice.dueDate}</span>}
                                        </div>
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
