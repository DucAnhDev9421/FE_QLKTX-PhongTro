import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, User, Phone, Mail, MapPin, CreditCard, Upload } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantService } from '../../../services/tenant';
import Alert from '../../../components/ui/Alert';
import { useAdministrativeUnits } from '../../../hooks/useAdministrativeUnits';

interface Props {
    tenant: any | null;
    onClose: () => void;
}

export default function TenantModal({ tenant, onClose }: Props) {
    const isEdit = !!tenant;
    const queryClient = useQueryClient();
    const { provinces } = useAdministrativeUnits();

    const [formData, setFormData] = useState({
        fullName: tenant?.fullName || '',
        phoneNumber: tenant?.phoneNumber || '',
        email: tenant?.email || '',
        hometown: tenant?.hometown || '',
        identityCardNumber: tenant?.identityCardNumber || ''
    });

    const [files, setFiles] = useState<{front?: File, back?: File}>({});
    const [previews, setPreviews] = useState<{front?: string, back?: string}>({
        front: tenant?.identityCardImageFront,
        back: tenant?.identityCardImageBack
    });

    const [errorMsg, setErrorMsg] = useState('');

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            let result;
            if (isEdit) {
                result = await tenantService.updateTenant(tenant.tenantId, data);
            } else {
                result = await tenantService.createTenant(data);
            }

            // Upload images sequentially if files were selected
            const tenantId = result.result?.tenantId || tenant?.tenantId;
            if (tenantId && (files.front || files.back)) {
                await tenantService.uploadCCCD(tenantId, files.front, files.back);
            }

            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tenants'] });
            onClose();
        },
        onError: (err: any) => {
            setErrorMsg(err.response?.data?.message || 'Có lỗi xảy ra khi lưu thông tin người thuê.');
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
        const file = e.target.files?.[0];
        if (file) {
            setFiles(prev => ({ ...prev, [side]: file }));
            // Create object URL for immediate preview
            const objectUrl = URL.createObjectURL(file);
            setPreviews(prev => ({ ...prev, [side]: objectUrl }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        if (!formData.fullName || !formData.phoneNumber || !formData.identityCardNumber) {
            setErrorMsg('Vui lòng điền các thông tin bắt buộc (*).');
            return;
        }

        mutation.mutate(formData);
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
            
            <div className="relative bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transform transition-all">
                <div className="flex items-center justify-between p-5 border-b border-white/5 shrink-0 bg-slate-900">
                    <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                        <User size={18} className="text-emerald-500" />
                        {isEdit ? 'Chỉnh sửa Người thuê' : 'Thêm Người thuê mới'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-200 transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-lg border border-white/5">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-5 overflow-y-auto space-y-5">
                    {errorMsg && <Alert type="error" message={errorMsg} />}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                        {/* Cột thông tin chữ */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">Họ & Tên <span className="text-rose-500">*</span></label>
                                <input 
                                    type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                                    placeholder="VD: Nguyễn Văn A"
                                    className="w-full bg-black/40 border border-white/10 text-sm text-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-1.5"><CreditCard size={14}/> Số CMND/CCCD <span className="text-rose-500">*</span></label>
                                <input 
                                    type="text" name="identityCardNumber" value={formData.identityCardNumber} onChange={handleChange}
                                    placeholder="079099..."
                                    className="w-full bg-black/40 border border-white/10 text-sm text-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-mono placeholder:text-slate-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-1.5"><Phone size={14}/> Số điện thoại <span className="text-rose-500">*</span></label>
                                <input 
                                    type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
                                    placeholder="0987..."
                                    className="w-full bg-black/40 border border-white/10 text-sm text-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-mono placeholder:text-slate-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-1.5"><Mail size={14}/> Email</label>
                                <input 
                                    type="email" name="email" value={formData.email} onChange={handleChange}
                                    placeholder="Email liên lạc..."
                                    className="w-full bg-black/40 border border-white/10 text-sm text-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-1.5"><MapPin size={14}/> Quê quán (Tỉnh/Thành)</label>
                                <select 
                                    name="hometown" value={formData.hometown} onChange={handleChange}
                                    className="w-full bg-black/40 border border-white/10 text-sm text-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all appearance-none"
                                >
                                    <option value="" className="bg-slate-900">Chọn Tỉnh/Thành phố</option>
                                    {provinces.map(p => (
                                        <option key={p.id} value={p.name} className="bg-slate-900">
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Cột ảnh CCCD */}
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Ảnh mặt trước CCCD</label>
                            <label className="cursor-pointer flex flex-col items-center justify-center w-full h-32 border-2 border-slate-700 border-dashed rounded-xl hover:bg-slate-800/50 hover:border-emerald-500/50 transition-all group overflow-hidden relative bg-black/40">
                                {previews.front ? (
                                    <img src={previews.front} className="absolute inset-0 w-full h-full object-cover" alt="Mặt trước" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-2 text-slate-500 group-hover:text-emerald-500 transition-colors" />
                                        <p className="text-xs text-slate-400">Tải ảnh mặt trước</p>
                                    </div>
                                )}
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'front')} />
                            </label>

                            <label className="block text-sm font-medium text-slate-400 mb-1.5 mt-4">Ảnh mặt sau CCCD</label>
                            <label className="cursor-pointer flex flex-col items-center justify-center w-full h-32 border-2 border-slate-700 border-dashed rounded-xl hover:bg-slate-800/50 hover:border-emerald-500/50 transition-all group overflow-hidden relative bg-black/40">
                                {previews.back ? (
                                    <img src={previews.back} className="absolute inset-0 w-full h-full object-cover" alt="Mặt sau" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-2 text-slate-500 group-hover:text-emerald-500 transition-colors" />
                                        <p className="text-xs text-slate-400">Tải ảnh mặt sau</p>
                                    </div>
                                )}
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'back')} />
                            </label>
                            <p className="text-[10px] text-amber-500 text-center mt-2">Lưu ý: Ảnh CCCD sẽ được nén và tải lên hệ thống tự động.</p>
                        </div>
                    </div>
                </div>

                <div className="p-5 border-t border-white/5 flex justify-end gap-3 bg-slate-900 shrink-0">
                    <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all">
                        Hủy bỏ
                    </button>
                    <button onClick={handleSubmit} disabled={mutation.isPending} className="px-5 py-2.5 flex items-center gap-2 text-sm font-semibold text-emerald-950 bg-emerald-500 hover:bg-emerald-400 rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] disabled:opacity-70 disabled:cursor-not-allowed">
                        {mutation.isPending ? <Loader2 size={16} className="animate-spin" /> : isEdit ? 'Lưu thay đổi' : 'Lưu khách thuê'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
