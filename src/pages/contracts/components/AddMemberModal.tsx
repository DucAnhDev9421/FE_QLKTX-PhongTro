import { useState, FormEvent, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, UserPlus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contractService } from '../../../services/contract';
import { tenantService } from '../../../services/tenant';
import Alert from '../../../components/ui/Alert';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    contractId: number | null;
}

export default function AddMemberModal({ isOpen, onClose, contractId }: Props) {
    const queryClient = useQueryClient();

    const [tenantId, setTenantId] = useState<number | ''>('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (isOpen) {
            setTenantId('');
            setErrorMsg('');
        }
    }, [isOpen]);

    // Lấy danh sách Tenant để chọn
    const { data: tenantsData, isLoading } = useQuery({
        queryKey: ['tenants'],
        queryFn: () => tenantService.getTenants(),
        enabled: isOpen
    });
    const tenants = tenantsData?.result || [];

    const mutation = useMutation({
        mutationFn: async (payload: any) => contractService.addMember(contractId!, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contracts'] });
            onClose();
        },
        onError: (err: any) => {
            setErrorMsg(err.response?.data?.message || err.message || 'Có lỗi xảy ra.');
        }
    });

    if (!isOpen || !contractId) return null;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        if (!tenantId) {
            setErrorMsg('Vui lòng chọn khách thuê.');
            return;
        }

        mutation.mutate({ tenantId: Number(tenantId) });
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans bg-slate-900/80 backdrop-blur-sm">
            <div 
                className="bg-slate-900 border border-emerald-900/30 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-emerald-900/20 bg-emerald-950/10 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                            <UserPlus size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-emerald-50">Thêm Thành viên</h2>
                    </div>
                    <button 
                        disabled={mutation.isPending}
                        onClick={onClose}
                        className="p-2 text-emerald-400 hover:text-emerald-50 rounded-lg hover:bg-emerald-900/30 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5">
                    {errorMsg && <Alert type="error" message={errorMsg} className="mb-4" />}

                    <form id="add-member-form" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Chọn Khách thuê từ Hệ thống</label>
                            {isLoading ? (
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Loader2 size={16} className="animate-spin" /> Đang tải dữ liệu...
                                </div>
                            ) : (
                                <select 
                                    className="w-full bg-slate-950 border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
                                    value={tenantId}
                                    onChange={(e) => setTenantId(Number(e.target.value))}
                                    disabled={mutation.isPending}
                                >
                                    <option value="">-- Chọn khách thuê chưa có phòng --</option>
                                    {tenants.map((t: any) => (
                                        <option key={t.tenantId} value={t.tenantId}>
                                            {t.fullName} - {t.identityCardNumber} ({t.phoneNumber})
                                        </option>
                                    ))}
                                </select>
                            )}
                            <p className="text-xs text-slate-500 mt-2">
                                Lưu ý: Khách thuê phải được tạo hồ sơ trước trong menu Quản lý Người Thuê. Hệ thống sẽ tự động chặn nếu người này đã ở trong hợp đồng rồi.
                            </p>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-slate-800 flex justify-end gap-3 bg-slate-900/50 rounded-b-2xl">
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
                        form="add-member-form"
                        disabled={mutation.isPending || !tenantId}
                        className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                    >
                        {mutation.isPending && <Loader2 size={16} className="animate-spin" />}
                        Thêm vào phòng
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
