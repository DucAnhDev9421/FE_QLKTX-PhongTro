import { useState, useMemo } from 'react';
import { Layout } from '../../components/layout';
import { CreditCard, Download, Search, CheckCircle2, AlertCircle, Clock, Receipt, Loader2, RefreshCw, CheckSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoiceService, Invoice } from '../../services/invoice';

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

const formatCurrency = (val: number) => new Intl.NumberFormat('vi-VN').format(val);

export default function Payments() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [page, setPage] = useState(0);
    const queryClient = useQueryClient();

    const { data: pageResult, isLoading, error } = useQuery({
        queryKey: ['invoices', page],
        queryFn: () => invoiceService.getInvoices(page, 10),
    });

    const invoices: Invoice[] = pageResult?.data || [];

    const confirmMutation = useMutation({
        mutationFn: (id: number) => invoiceService.updateInvoice(id, { paymentStatus: 'PAID' } as any),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invoices'] }),
    });

    // Compute stats - Note: these are based on CURRENT PAGE
    const stats = useMemo(() => {
        const paid = invoices.filter(i => i.paymentStatus === 'PAID');
        const pending = invoices.filter(i => i.paymentStatus === 'PENDING');
        const overdue = invoices.filter(i => i.paymentStatus === 'OVERDUE');
        return {
            totalPaid: paid.reduce((s, i) => s + (i.totalAmount || 0), 0),
            paidCount: paid.length,
            totalPending: pending.reduce((s, i) => s + (i.totalAmount || 0), 0),
            pendingCount: pending.length,
            totalOverdue: overdue.reduce((s, i) => s + (i.totalAmount || 0), 0),
            overdueCount: overdue.length,
        };
    }, [invoices]);

    // Filter & Search
    const filtered = useMemo(() => {
        let list = invoices;
        if (statusFilter !== 'ALL') {
            list = list.filter(i => i.paymentStatus === statusFilter);
        }
        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            list = list.filter(i =>
                (i.contract?.room?.roomNumber || '').toLowerCase().includes(q) ||
                (i.notes || '').toLowerCase().includes(q) ||
                String(i.invoiceId).includes(q)
            );
        }
        return list;
    }, [invoices, statusFilter, searchTerm]);

    if (isLoading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-96">
                    <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center h-96 gap-4">
                    <AlertCircle className="h-12 w-12 text-rose-500" />
                    <p className="text-slate-400">Không thể tải dữ liệu hóa đơn.</p>
                    <button onClick={() => queryClient.invalidateQueries({ queryKey: ['invoices'] })} className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 rounded-lg hover:bg-slate-700 transition-colors">
                        <RefreshCw size={16} /> Thử lại
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100 mb-1">Thiết lập hóa đơn & Thanh toán</h1>
                    <p className="text-slate-400 text-sm">Quản lý các khoản thu, chi và hóa đơn hàng tháng.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700">
                        <Download size={18} />
                        Xuất Excel
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-slate-400 text-sm font-medium mb-1">Tổng đã thu</p>
                            <h3 className="text-2xl font-bold text-slate-100">{formatCurrency(stats.totalPaid)}đ</h3>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <CreditCard size={20} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm">
                        <span className="text-emerald-500 font-medium">{stats.paidCount} hóa đơn</span>
                        <span className="text-slate-500">đã thanh toán</span>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-slate-400 text-sm font-medium mb-1">Chờ thanh toán</p>
                            <h3 className="text-2xl font-bold text-amber-500">{formatCurrency(stats.totalPending)}đ</h3>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                            <Clock size={20} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm">
                        <span className="text-slate-400 font-medium">{stats.pendingCount} hóa đơn</span>
                        <span className="text-slate-500">đang chờ thu</span>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-slate-400 text-sm font-medium mb-1">Nợ quá hạn</p>
                            <h3 className="text-2xl font-bold text-rose-500">{formatCurrency(stats.totalOverdue)}đ</h3>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                            <AlertCircle size={20} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm">
                        <span className="text-rose-500 font-medium">{stats.overdueCount} hóa đơn</span>
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
                        placeholder="Tìm theo mã hóa đơn, phòng, ghi chú..."
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    {['ALL', 'PAID', 'PENDING', 'OVERDUE'].map(s => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap border ${
                                statusFilter === s
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                            }`}
                        >
                            {s === 'ALL' && 'Tất cả'}
                            {s === 'PAID' && <><CheckCircle2 size={14} /> Đã thanh toán</>}
                            {s === 'PENDING' && <><Clock size={14} /> Chờ thanh toán</>}
                            {s === 'OVERDUE' && <><AlertCircle size={14} /> Quá hạn</>}
                        </button>
                    ))}
                </div>
            </div>

            {/* Payments Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-900/50 border-b border-slate-800">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-semibold">Mã HĐ</th>
                                <th scope="col" className="px-6 py-4 font-semibold">Phòng</th>
                                <th scope="col" className="px-6 py-4 font-semibold">Kỳ</th>
                                <th scope="col" className="px-6 py-4 font-semibold">Số tiền</th>
                                <th scope="col" className="px-6 py-4 font-semibold">Trạng thái</th>
                                <th scope="col" className="px-6 py-4 font-semibold">Ngày tạo</th>
                                <th scope="col" className="px-6 py-4 font-semibold">Hạn thanh toán</th>
                                <th scope="col" className="px-6 py-4 text-right font-semibold">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                                        <Receipt className="h-10 w-10 mx-auto mb-3 opacity-30" />
                                        Không có hóa đơn nào.
                                    </td>
                                </tr>
                            ) : filtered.map((inv) => (
                                <tr key={inv.invoiceId} className="hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-emerald-500 font-medium">#{inv.invoiceId}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-slate-200 font-medium">{inv.contract?.room?.roomNumber || '---'}</span>
                                            <span className="text-xs text-slate-500 truncate max-w-[150px]">{inv.notes || ''}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-slate-300">T{inv.month}/{inv.year}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-slate-200 font-semibold font-mono">
                                            {formatCurrency(inv.totalAmount)}đ
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={inv.paymentStatus} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-slate-300">{inv.createdDate || '---'}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-slate-300">{inv.dueDate || '---'}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            {inv.paymentStatus === 'PENDING' && (
                                                <button
                                                    onClick={() => confirmMutation.mutate(inv.invoiceId)}
                                                    disabled={confirmMutation.isPending}
                                                    title="Xác nhận đã thu"
                                                    className="text-emerald-500 hover:bg-emerald-500/10 p-2 rounded-lg transition-colors"
                                                >
                                                    <CheckSquare size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/50">
                    <span className="text-sm text-slate-500">
                        Hiển thị <span className="font-medium text-slate-300">{filtered.length}</span> trong <span className="font-medium text-slate-300">{pageResult?.totalElements || 0}</span> hóa đơn
                    </span>
                    
                    {pageResult && pageResult.totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <button 
                                disabled={page === 0}
                                onClick={() => setPage(page - 1)}
                                className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <span className="text-sm text-slate-300 font-medium px-2">
                                Trang {page + 1} / {pageResult.totalPages}
                            </span>
                            <button 
                                disabled={page >= pageResult.totalPages - 1}
                                onClick={() => setPage(page + 1)}
                                className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
