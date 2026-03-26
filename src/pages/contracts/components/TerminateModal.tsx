import { useState, FormEvent, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, AlertTriangle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { contractService } from '../../../services/contract';
import Alert from '../../../components/ui/Alert';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    contractData: any | null; // ACTIVE contract to terminate
}

export default function TerminateModal({ isOpen, onClose, contractData }: Props) {
    const queryClient = useQueryClient();

    const [deductionAmount, setDeductionAmount] = useState<number | ''>(0);
    const [deductionReason, setDeductionReason] = useState('');
    const [finalElectricityReading, setFinalElectricityReading] = useState<number | ''>('');
    const [finalWaterReading, setFinalWaterReading] = useState<number | ''>('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (isOpen) {
            setDeductionAmount(0);
            setDeductionReason('');
            setFinalElectricityReading('');
            setFinalWaterReading('');
            setErrorMsg('');
        }
    }, [isOpen]);

    const mutation = useMutation({
        mutationFn: async (payload: any) => contractService.terminateContract(contractData.contractId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contracts'] });
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
            onClose();
        },
        onError: (err: any) => {
            setErrorMsg(err.response?.data?.message || err.message || 'Có lỗi xảy ra khi thanh lý.');
        }
    });

    if (!isOpen || !contractData) return null;

    const deposit = contractData.depositAmount || 0;
    const deduction = Number(deductionAmount) || 0;
    const refund = deposit - deduction;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        if (deduction < 0) {
            setErrorMsg('Tiền khấu trừ không hợp lệ.');
            return;
        }

        if (deduction > 0 && !deductionReason.trim()) {
            setErrorMsg('Vui lòng nhập lý do khấu trừ.');
            return;
        }

        mutation.mutate({
            deductionAmount: deduction,
            deductionReason,
            finalElectricityReading: Number(finalElectricityReading) || undefined,
            finalWaterReading: Number(finalWaterReading) || undefined
        });
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans bg-rose-950/20 backdrop-blur-md">
            <div 
                className="bg-slate-900 border border-emerald-900/30 w-full max-w-md rounded-2xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-emerald-900/10 bg-emerald-950/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-500">
                            <AlertTriangle size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-100">Thanh lý Hợp đồng</h2>
                    </div>
                    <button 
                        disabled={mutation.isPending}
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {errorMsg && <Alert type="error" message={errorMsg} className="mb-4" />}

                    <div className="mb-6 bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-sm">
                        <div className="flex justify-between mb-2">
                            <span className="text-slate-400">Hợp đồng:</span>
                            <span className="font-mono text-white">#{contractData.contractId}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-slate-400">Phòng:</span>
                            <span className="font-bold text-white">{contractData.roomNumber}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-slate-700">
                            <span className="text-slate-400">Tiền cọc ban đầu:</span>
                            <span className="font-medium text-emerald-400 text-base">
                                {new Intl.NumberFormat('vi-VN').format(deposit)}đ
                            </span>
                        </div>
                    </div>

                    <form id="terminate-form" onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Chỉ số điện chốt</label>
                                <input 
                                    type="number"
                                    className="w-full bg-slate-950 border border-slate-700 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 hover:border-emerald-500/50 transition-colors font-mono"
                                    value={finalElectricityReading}
                                    onChange={(e) => setFinalElectricityReading(e.target.value === '' ? '' : Number(e.target.value))}
                                    disabled={mutation.isPending}
                                    placeholder="Điện cuối"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Chỉ số nước chốt</label>
                                <input 
                                    type="number"
                                    className="w-full bg-slate-950 border border-slate-700 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 hover:border-emerald-500/50 transition-colors font-mono"
                                    value={finalWaterReading}
                                    onChange={(e) => setFinalWaterReading(e.target.value === '' ? '' : Number(e.target.value))}
                                    disabled={mutation.isPending}
                                    placeholder="Nước cuối"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Tiền khấu trừ từ cọc (VNĐ)</label>
                            <input 
                                type="number"
                                className="w-full bg-slate-950 border border-slate-700 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 hover:border-emerald-500/50 transition-colors font-mono"
                                value={deductionAmount}
                                onChange={(e) => setDeductionAmount(e.target.value === '' ? '' : Number(e.target.value))}
                                disabled={mutation.isPending}
                                min="0"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                                Lý do khấu trừ {deduction > 0 && <span className="text-rose-500">*</span>}
                            </label>
                            <textarea 
                                className="w-full bg-slate-950 border border-slate-700 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 hover:border-emerald-500/50 transition-colors min-h-[80px]"
                                value={deductionReason}
                                onChange={(e) => setDeductionReason(e.target.value)}
                                disabled={mutation.isPending}
                                placeholder={deduction > 0 ? "Bắt buộc nhập lý do..." : "VD: Bồi thường hư hỏng..."}
                            />
                        </div>

                        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/50 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 text-sm">
                                    {refund >= 0 ? 'Hoàn trả khách thuê:' : 'Khách thuê cần đóng thêm:'}
                                </span>
                                <span className={`text-xl font-black tracking-tight ${refund >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {new Intl.NumberFormat('vi-VN').format(Math.abs(refund))}đ
                                </span>
                            </div>
                            {refund < 0 && (
                                <p className="text-[10px] text-rose-500/80 bg-rose-500/5 p-2 rounded-lg border border-rose-500/10 italic">
                                    * Số tiền khấu trừ vượt quá tiền cọc, khách hàng cần thanh toán thêm phần chênh lệch.
                                </p>
                            )}
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-slate-800 flex justify-end gap-3 bg-slate-900/50">
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
                        form="terminate-form"
                        disabled={mutation.isPending}
                        className="px-5 py-2.5 text-sm font-medium text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 shadow-[0_0_15px_rgba(225,29,72,0.3)]"
                    >
                        {mutation.isPending && <Loader2 size={16} className="animate-spin" />}
                        Chấp nhận Thanh lý
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
