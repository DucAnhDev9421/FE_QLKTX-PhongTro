import { useState } from 'react';
import { FileText, CreditCard, ChevronRight, CheckCircle2, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { momoService } from '../../../services';

interface Invoice {
    id: number;
    month: number;
    year: number;
    totalAmount: number;
    status: string;
    dueDate: string;
}

interface RecentInvoicesProps {
    invoices: Invoice[];
}

export default function RecentInvoices({ invoices }: RecentInvoicesProps) {
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const [errorId, setErrorId] = useState<number | null>(null);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN').format(amount);
    };

    const handlePayment = async (invoiceId: number) => {
        setLoadingId(invoiceId);
        setErrorId(null);
        try {
            const response = await momoService.createPayment(invoiceId);
            if (response.payUrl) {
                window.location.href = response.payUrl;
            } else {
                setErrorId(invoiceId);
            }
        } catch (error) {
            console.error('MoMo payment error:', error);
            setErrorId(invoiceId);
        } finally {
            setLoadingId(null);
        }
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'PAID':
                return { 
                    icon: <CheckCircle2 className="h-5 w-5" />,
                    label: 'Đã thanh toán', 
                    colors: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                    dot: 'bg-emerald-400'
                };
            case 'OVERDUE':
                return { 
                    icon: <AlertTriangle className="h-5 w-5" />,
                    label: 'Quá hạn', 
                    colors: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
                    dot: 'bg-rose-400'
                };
            default:
                return { 
                    icon: <Clock className="h-5 w-5" />,
                    label: 'Chưa thanh toán', 
                    colors: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
                    dot: 'bg-amber-400'
                };
        }
    };

    return (
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800/80 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <FileText className="h-4.5 w-4.5 text-blue-400" />
                    </div>
                    <h3 className="text-base font-bold text-slate-100">Hóa đơn gần đây</h3>
                </div>
                <button className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-semibold px-3 py-1.5 rounded-lg hover:bg-emerald-500/10">
                    Xem tất cả
                </button>
            </div>
            
            <div className="divide-y divide-slate-800/60">
                {invoices.map((invoice) => {
                    const statusConfig = getStatusConfig(invoice.status);
                    return (
                        <div key={invoice.id} className="px-6 py-5 hover:bg-slate-800/30 transition-all duration-200 group">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                {/* Left: Invoice info */}
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-2xl border ${statusConfig.colors} group-hover:scale-105 transition-transform duration-200`}>
                                        {statusConfig.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-100 text-sm">
                                            Hóa đơn tháng {invoice.month}/{invoice.year}
                                        </h4>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${statusConfig.colors}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}></span>
                                                {statusConfig.label}
                                            </span>
                                            {invoice.dueDate && (
                                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    Hạn: {invoice.dueDate}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Right: Amount + Action */}
                                <div className="flex items-center gap-4 ml-auto">
                                    <div className="text-right">
                                        <p className="font-bold text-white text-lg tabular-nums">
                                            {formatCurrency(invoice.totalAmount)} <span className="text-xs font-normal text-slate-500">đ</span>
                                        </p>
                                    </div>
                                    
                                    {invoice.status === 'PENDING' && (
                                        <div className="flex flex-col items-end gap-1">
                                            <button 
                                                onClick={() => handlePayment(invoice.id)}
                                                disabled={loadingId === invoice.id}
                                                className="px-4 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-pink-900/30 hover:shadow-pink-900/50 hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
                                            >
                                                {loadingId === invoice.id
                                                    ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Đang xử lý...</>
                                                    : <><CreditCard className="h-3.5 w-3.5" /> Thanh toán</>}
                                            </button>
                                            {errorId === invoice.id && (
                                                <span className="text-[11px] text-rose-400">Lỗi kết nối, thử lại</span>
                                            )}
                                        </div>
                                    )}
                                    
                                    {invoice.status === 'PAID' && (
                                        <button className="p-2 text-slate-600 hover:text-slate-400 hover:bg-slate-800/60 rounded-xl transition-colors">
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                
                {invoices.length === 0 && (
                    <div className="py-16 text-center flex flex-col items-center">
                        <div className="p-4 rounded-2xl bg-slate-800/50 mb-4">
                            <FileText className="h-10 w-10 text-slate-600" />
                        </div>
                        <p className="text-slate-400 font-medium">Chưa có hóa đơn nào</p>
                        <p className="text-xs text-slate-600 mt-1">Hóa đơn sẽ xuất hiện ở đây khi có</p>
                    </div>
                )}
            </div>
        </div>
    );
}
