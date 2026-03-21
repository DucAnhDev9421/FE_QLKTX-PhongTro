import { useState, FormEvent, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, Calendar as CalendarIcon } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoiceService, InvoiceRequest } from '../../../services/invoice';
import { contractService } from '../../../services/contract';
import Alert from '../../../components/ui/Alert';
// @ts-ignore
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Props {
    invoice: any | null;
    onClose: () => void;
}

export default function InvoiceModal({ invoice, onClose }: Props) {
    const queryClient = useQueryClient();
    const isEdit = !!invoice;

    const [contractId, setContractId] = useState<number | ''>('');
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [totalAmount, setTotalAmount] = useState<number | ''>('');
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [paymentStatus, setPaymentStatus] = useState('PENDING');
    const [notes, setNotes] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (isEdit && invoice) {
            setContractId(invoice.contract?.contractId || '');
            setMonth(invoice.month);
            setYear(invoice.year);
            setTotalAmount(invoice.totalAmount);
            setDueDate(invoice.dueDate ? new Date(invoice.dueDate) : null);
            setPaymentStatus(invoice.paymentStatus || 'PENDING');
            setNotes(invoice.notes || '');
        } else {
            setContractId('');
            const now = new Date();
            setMonth(now.getMonth() + 1);
            setYear(now.getFullYear());
            setTotalAmount('');
            now.setDate(now.getDate() + 7); // Default due date
            setDueDate(now);
            setPaymentStatus('PENDING');
            setNotes('');
        }
        setErrorMsg('');
    }, [isEdit, invoice]);

    // Fetch available contracts
    const { data: contractsData, isLoading: isLoadingContracts } = useQuery({
        queryKey: ['contracts', 'VALID'],
        queryFn: () => contractService.getContracts('VALID'),
        enabled: !isEdit
    });
    const contracts = contractsData?.result || [];

    const mutation = useMutation({
        mutationFn: async (payload: InvoiceRequest) => {
            if (isEdit) {
                return invoiceService.updateInvoice(invoice.invoiceId, payload);
            } else {
                return invoiceService.createInvoice(payload);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
            onClose();
        },
        onError: (err: any) => {
            setErrorMsg(err.response?.data?.message || 'Có lỗi xảy ra.');
        }
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        if (!contractId) { setErrorMsg('Vui lòng chọn Hợp đồng'); return; }
        if (!month || month < 1 || month > 12) { setErrorMsg('Tháng không hợp lệ'); return; }
        if (!year) { setErrorMsg('Năm không hợp lệ'); return; }
        if (totalAmount === '') { setErrorMsg('Vui lòng nhập tổng tiền'); return; }

        const payload: InvoiceRequest = {
            contractId: Number(contractId),
            month: Number(month),
            year: Number(year),
            totalAmount: Number(totalAmount),
            paymentStatus,
            dueDate: dueDate ? dueDate.toISOString().split('T')[0] : null,
            notes,
            createdDate: isEdit ? invoice.createdDate : new Date().toISOString().split('T')[0]
        };

        mutation.mutate(payload);
    };

    if (!invoice && !isEdit && isLoadingContracts) {
        return null; // or spinner
    }

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans bg-slate-900/80 backdrop-blur-sm">
            <div 
                className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            {isEdit ? 'Cập nhật Hóa đơn' : 'Tạo Hóa đơn mới'}
                            {isEdit && <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-mono">#{invoice.invoiceId}</span>}
                        </h2>
                        {isEdit && <p className="text-sm text-slate-400 mt-1">Hợp đồng ID: {invoice.contract?.contractId}</p>}
                    </div>
                    <button 
                        onClick={onClose}
                        disabled={mutation.isPending}
                        className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 overflow-y-auto">
                    {errorMsg && <Alert type="error" message={errorMsg} className="mb-4" />}

                    <form id="invoice-form" onSubmit={handleSubmit} className="space-y-4">
                        {/* Hợp đồng */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Hợp đồng / Phòng <span className="text-rose-500">*</span></label>
                            <select 
                                className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
                                value={contractId}
                                onChange={(e) => setContractId(Number(e.target.value))}
                                disabled={isEdit || mutation.isPending}
                            >
                                <option value="">-- Chọn hợp đồng đang hiệu lực --</option>
                                {isEdit && invoice.contract ? (
                                    <option value={invoice.contract.contractId}>HĐ#{invoice.contract.contractId} - Phòng {invoice.contract.room?.roomNumber}</option>
                                ) : contracts.map((c: any) => (
                                    <option key={c.contractId} value={c.contractId}>HĐ#{c.contractId} - Phòng {c.roomNumber} - Giá: {c.rentalPrice?.toLocaleString()}</option>
                                ))}
                            </select>
                        </div>

                        {/* Kỳ cước */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Tháng <span className="text-rose-500">*</span></label>
                                <input 
                                    type="number"
                                    min={1} max={12}
                                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
                                    value={month}
                                    onChange={(e) => setMonth(Number(e.target.value))}
                                    disabled={mutation.isPending}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Năm <span className="text-rose-500">*</span></label>
                                <input 
                                    type="number"
                                    min={2000} max={2100}
                                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
                                    value={year}
                                    onChange={(e) => setYear(Number(e.target.value))}
                                    disabled={mutation.isPending}
                                />
                            </div>
                        </div>

                        {/* Total Amount */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Tổng tiền (VNĐ) <span className="text-rose-500">*</span></label>
                            <input 
                                type="number"
                                className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 font-mono font-bold text-lg text-emerald-400"
                                value={totalAmount}
                                onChange={(e) => setTotalAmount(Number(e.target.value))}
                                disabled={mutation.isPending}
                            />
                            <p className="text-xs text-slate-500 mt-1">Lưu ý: Hệ thống hiện tại yêu cầu tổng hợp tiền điện/nước thủ công ở bước này.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Due Date */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Hạn thanh toán</label>
                                <div className="relative">
                                    <DatePicker
                                        selected={dueDate}
                                        onChange={(date: Date | null) => setDueDate(date)}
                                        dateFormat="dd/MM/yyyy"
                                        className="w-full bg-slate-950/50 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-200 px-4 py-2.5 rounded-xl text-sm transition-all shadow-inner placeholder:text-slate-600 pl-10"
                                        disabled={mutation.isPending}
                                    />
                                    <CalendarIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                                </div>
                            </div>
                            
                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Trạng thái</label>
                                <select 
                                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 font-medium"
                                    value={paymentStatus}
                                    onChange={(e) => setPaymentStatus(e.target.value)}
                                    disabled={mutation.isPending}
                                >
                                    <option value="PAID" className="text-emerald-500">Đã thanh toán (PAID)</option>
                                    <option value="PENDING" className="text-amber-500">Chưa thanh toán (PENDING)</option>
                                    <option value="OVERDUE" className="text-rose-500">Quá hạn (OVERDUE)</option>
                                </select>
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Ghi chú</label>
                            <textarea 
                                rows={2}
                                className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                disabled={mutation.isPending}
                                placeholder="Nhập ghi chú hoặc diễn giải chi tiết thu tiền..."
                            />
                        </div>

                    </form>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-slate-800 flex justify-end gap-3 bg-slate-900/50 rounded-b-2xl shrink-0">
                    <button 
                        type="button"
                        onClick={onClose}
                        disabled={mutation.isPending}
                        className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors disabled:opacity-50"
                    >
                        Hủy
                    </button>
                    <button 
                        type="submit"
                        form="invoice-form"
                        disabled={mutation.isPending}
                        className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                    >
                        {mutation.isPending && <Loader2 size={16} className="animate-spin" />}
                        {isEdit ? 'Cập nhật' : 'Tạo hóa đơn'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
