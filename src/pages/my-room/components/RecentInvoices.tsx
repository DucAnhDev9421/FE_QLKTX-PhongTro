import { FileText, CreditCard, ChevronRight, CheckCircle2, Clock } from 'lucide-react';

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
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handlePayment = (invoiceId: number) => {
        // Implement MoMo payment flow
        console.log(`Initiate payment for invoice ${invoiceId}`);
        // In a real app, this would call your backend API:
        // const response = await apiClient.post(`/api/payments/momo/create/${invoiceId}`);
        // window.location.href = response.payUrl;
        alert(`Đang chuyển hướng đến MoMo để thanh toán hóa đơn #${invoiceId}...`);
    };

    return (
        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden shadow-lg">
            <div className="p-6 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/80">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <FileText className="h-5 w-5 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-100">Hóa đơn gần đây</h3>
                </div>
                <button className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
                    Xem tất cả
                </button>
            </div>
            
            <div className="divide-y divide-slate-700/50">
                {invoices.map((invoice) => (
                    <div key={invoice.id} className="p-6 hover:bg-slate-800/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-5 group">
                        <div className="flex items-start sm:items-center gap-4">
                            <div className={`p-3 rounded-2xl flex shrink-0 shadow-inner group-hover:scale-105 transition-transform ${
                                invoice.status === 'PAID' 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                                {invoice.status === 'PAID' ? <CheckCircle2 className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-200 text-base">Hóa đơn tháng {invoice.month}/{invoice.year}</h4>
                                <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" /> Hạn chót: {invoice.dueDate}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0">
                            <div className="text-left sm:text-right">
                                <p className="font-bold text-slate-100 text-lg">{formatCurrency(invoice.totalAmount)}</p>
                                <p className={`text-xs font-semibold mt-1 tracking-wide uppercase ${
                                    invoice.status === 'PAID' ? 'text-emerald-400' : 'text-amber-400'
                                }`}>
                                    {invoice.status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                </p>
                            </div>
                            
                            {invoice.status === 'PENDING' && (
                                <button 
                                    onClick={() => handlePayment(invoice.id)}
                                    className="px-5 py-2.5 bg-pink-600 hover:bg-pink-700 active:bg-pink-800 text-white text-sm font-semibold rounded-xl transition-all flex items-center gap-2.5 shadow-lg shadow-pink-900/30 hover:shadow-pink-900/50 hover:-translate-y-0.5"
                                >
                                    <CreditCard className="h-4 w-4" />
                                    <span>Thanh toán MoMo</span>
                                </button>
                            )}
                            
                            {invoice.status === 'PAID' && (
                                <button className="p-2 text-slate-500 hover:text-slate-300 hover:bg-slate-700/50 rounded-xl transition-colors">
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                
                {invoices.length === 0 && (
                    <div className="p-12 text-center flex flex-col items-center">
                        <FileText className="h-12 w-12 text-slate-600 mb-4" />
                        <p className="text-slate-400 font-medium">Chưa có hóa đơn nào.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
