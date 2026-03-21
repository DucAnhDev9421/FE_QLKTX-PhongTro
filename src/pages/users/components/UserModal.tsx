import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ShieldCheck, KeyRound, Loader2, AlertCircle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../../../services/user';

interface Props {
    user: any;
    onClose: () => void;
}

export default function UserModal({ user, onClose }: Props) {
    const isEdit = !!user;
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        username: user?.username || '',
        password: '',
        fullName: user?.fullName || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        roleName: user?.roleName || user?.role?.roleName || user?.role || 'STAFF'
    });

    const [errorMsg, setErrorMsg] = useState('');

    const createMutation = useMutation({
        mutationFn: (data: any) => userService.createUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            onClose();
        },
        onError: (err: any) => {
            setErrorMsg(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật người dùng.');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        
        if (isEdit) {
            // Because the backend doesn't support full PUT yet, we just close it for now.
            // When PUT is supported, we would call updateMutation here.
            onClose();
            return;
        }

        if (!formData.username || !formData.password || !formData.fullName) {
            setErrorMsg('Vui lòng điền đầy đủ các trường bắt buộc (*).');
            return;
        }

        createMutation.mutate(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            
            <div className="relative bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transform transition-all">
                <div className="flex items-center justify-between p-5 border-b border-white/5 shrink-0 bg-slate-900">
                    <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                        {isEdit ? 'Hồ sơ Nhân sự' : 'Cấp tài khoản mới'}
                        {isEdit && <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">ID: {user.userId}</span>}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-200 transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-lg border border-white/5">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-5 overflow-y-auto space-y-6">
                    {errorMsg && (
                        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
                            <AlertCircle size={18} className="shrink-0" />
                            <p>{errorMsg}</p>
                        </div>
                    )}

                    {isEdit && (
                        <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-3 rounded-xl text-sm flex items-center justify-between">
                            <span>Chức năng sửa thông tin hiện đang ở dạng xem trước.</span>
                        </div>
                    )}

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1.5">Họ và tên <span className="text-rose-500">*</span></label>
                                <input 
                                    type="text" 
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    readOnly={isEdit}
                                    placeholder="Điền họ tên người dùng..."
                                    className="w-full bg-black/40 border border-white/10 text-sm text-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600 readOnly:opacity-70"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1.5">Email liên hệ</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    readOnly={isEdit}
                                    placeholder="email@example.com"
                                    className="w-full bg-black/40 border border-white/10 text-sm text-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600 readOnly:opacity-70"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1.5">Số điện thoại</label>
                                <input 
                                    type="tel" 
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    readOnly={isEdit}
                                    placeholder="09xx..."
                                    className="w-full bg-black/40 border border-white/10 text-sm text-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600 font-mono readOnly:opacity-70"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-emerald-400 mb-1.5 flex items-center gap-1.5"><ShieldCheck size={16}/> Nhóm quyền (Role) <span className="text-rose-500">*</span></label>
                                <select 
                                    name="roleName"
                                    value={formData.roleName}
                                    onChange={handleChange}
                                    disabled={isEdit}
                                    className="w-full bg-black/40 focus:bg-slate-900 text-emerald-400 border border-emerald-500/30 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-semibold uppercase disabled:opacity-70 disabled:cursor-not-allowed appearance-none"
                                >
                                    <option value="OWNER" className="bg-slate-900 text-slate-200">Owner (Chủ hệ thống)</option>
                                    <option value="ADMIN" className="bg-slate-900 text-slate-200">Admin (Quản trị viên)</option>
                                    <option value="STAFF" className="bg-slate-900 text-slate-200">Staff (Nhân viên)</option>
                                    <option value="TENANT" className="bg-slate-900 text-slate-200">Tenant (Người thuê trọ)</option>
                                    <option value="USER" className="bg-slate-900 text-slate-200">User (Khách)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="border border-white/5 rounded-2xl p-5 bg-black/20 shadow-inner">
                        <label className="block text-sm font-medium text-amber-500 mb-3 flex items-center gap-1.5 text-left"><KeyRound size={16}/> Thông tin Tín thức (Đăng nhập)</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">Tên đăng nhập (Username) <span className="text-rose-500">*</span></label>
                                <input 
                                    type="text" 
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    disabled={isEdit}
                                    autoComplete="off"
                                    placeholder="Ví dụ: admin_123"
                                    className="w-full bg-slate-900/50 border border-white/10 text-sm text-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-mono disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-slate-600 [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_30px_#0f172a_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                                />
                                {isEdit && <span className="text-[10px] text-slate-500 mt-1 block">Tên đăng nhập là định danh, không thể thay đổi.</span>}
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">{isEdit ? 'Mật khẩu' : 'Mật khẩu khởi tạo'} {(!isEdit) && <span className="text-rose-500">*</span>}</label>
                                <input 
                                    type="password" 
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={isEdit}
                                    autoComplete="new-password"
                                    placeholder={isEdit ? 'Đã thiết lập (Ẩn)' : 'Nhập mật khẩu...'}
                                    className="w-full bg-slate-900/50 border border-white/10 text-sm text-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-mono placeholder:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_30px_#0f172a_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-5 border-t border-white/5 flex justify-end gap-3 bg-slate-900 shrink-0">
                    <button 
                        onClick={onClose}
                        type="button"
                        className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all">
                        Đóng
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={createMutation.isPending}
                        className="px-5 py-2.5 flex items-center gap-2 text-sm font-semibold text-emerald-950 bg-emerald-500 hover:bg-emerald-400 rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] disabled:opacity-70 disabled:cursor-not-allowed">
                        {createMutation.isPending ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Đang xử lý...
                            </>
                        ) : (
                            isEdit ? 'Đóng (Chỉ xem)' : 'Tạo Tài khoản'
                        )}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
