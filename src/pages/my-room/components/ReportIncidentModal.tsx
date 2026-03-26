import React, { useState } from 'react';
import { X, Send, AlertTriangle, Loader2, CheckCircle2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { incidentService } from '../../../services/incidentService';

interface ReportIncidentModalProps {
    isOpen: boolean;
    onClose: () => void;
    roomId: number;
    tenantId: number;
}

export default function ReportIncidentModal({ isOpen, onClose, roomId, tenantId }: ReportIncidentModalProps) {
    const [description, setDescription] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: { roomId: number, tenantId: number, description: string }) => 
            incidentService.createIncident(data),
        onSuccess: () => {
            setIsSuccess(true);
            queryClient.invalidateQueries({ queryKey: ['incidents'] });
            // Close after 2 seconds
            setTimeout(() => {
                handleClose();
            }, 2000);
        },
        onError: (err: any) => {
            alert(err.response?.data?.message || 'Có lỗi xảy ra khi gửi báo cáo.');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description.trim()) return;
        mutation.mutate({ roomId, tenantId, description });
    };

    const handleClose = () => {
        setDescription('');
        setIsSuccess(false);
        mutation.reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center border border-orange-500/20">
                            <AlertTriangle size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Báo cáo sự cố</h2>
                    </div>
                    <button 
                        onClick={handleClose}
                        className="p-2 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {isSuccess ? (
                    <div className="flex flex-col items-center text-center py-8">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4 border border-emerald-500/20">
                            <CheckCircle2 size={32} className="animate-in zoom-in duration-300" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Đã gửi báo cáo!</h3>
                        <p className="text-slate-400 text-sm">
                            Quản lý đã nhận được thông tin và sẽ phản hồi sớm nhất.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">
                                Mô tả chi tiết sự cố
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Hãy mô tả vấn đề bạn đang gặp phải (VD: Vòi nước bị rò rỉ, điều hòa không lạnh...)"
                                className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 min-h-[120px] transition-all resize-none placeholder:text-slate-600"
                                required
                            />
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex gap-3 text-left">
                            <div className="mt-0.5">
                                <CheckCircle2 size={14} className="text-emerald-500" />
                            </div>
                            <p className="text-[12px] text-slate-400 leading-snug">
                                Báo cáo sẽ được gửi kèm thông tin phòng của bạn để quản lý dễ dàng tra cứu.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={mutation.isPending || !description.trim()}
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 text-sm mt-4"
                        >
                            {mutation.isPending ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <><Send size={18} /> Gửi báo cáo</>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
