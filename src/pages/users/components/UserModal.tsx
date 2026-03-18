import { createPortal } from 'react-dom';
import { X, ShieldCheck, KeyRound } from 'lucide-react';
import { User } from '../../../types/user';

interface Props {
    user: User | null;
    onClose: () => void;
}

export default function UserModal({ user, onClose }: Props) {
    const isEdit = !!user;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            
            <div className="relative bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0 bg-slate-900">
                    <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                        {isEdit ? 'Hồ sơ Nhân sự' : 'Cấp tài khoản mới'}
                        {isEdit && <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-mono">{user.id}</span>}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-200 transition-colors bg-slate-800 hover:bg-slate-700 p-1.5 rounded-lg border border-slate-700">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-5 overflow-y-auto space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1.5">Họ và tên <span className="text-rose-500">*</span></label>
                                <input 
                                    type="text" 
                                    defaultValue={user?.fullName || ''}
                                    placeholder="Điền họ tên người dùng..."
                                    className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1.5">Email liên hệ <span className="text-rose-500">*</span></label>
                                <input 
                                    type="email" 
                                    defaultValue={user?.email || ''}
                                    placeholder="email@example.com"
                                    className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1.5">Số điện thoại <span className="text-rose-500">*</span></label>
                                <input 
                                    type="tel" 
                                    defaultValue={user?.phone || ''}
                                    placeholder="09xx..."
                                    className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-500 font-mono"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1.5 text-emerald-500 flex items-center gap-1.5"><ShieldCheck size={16}/> Nhóm quyền (Role) <span className="text-rose-500">*</span></label>
                                <select 
                                    defaultValue={user?.role || 'STAFF'}
                                    className="w-full bg-slate-800 text-emerald-400 border border-emerald-500/30 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-medium uppercase"
                                >
                                    <option value="OWNER" className="bg-slate-900 text-slate-200">Owner (Chủ hệ thống)</option>
                                    <option value="ADMIN" className="bg-slate-900 text-slate-200">Admin (Quản trị viên)</option>
                                    <option value="STAFF" className="bg-slate-900 text-slate-200">Staff (Nhân viên)</option>
                                    <option value="USER" className="bg-slate-900 text-slate-200">User (Người thuê trọ)</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1.5">Trạng thái</label>
                                <select 
                                    defaultValue={user?.status || 'ACTIVE'}
                                    className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                                >
                                    <option value="ACTIVE" className="bg-slate-900 text-white">Kích hoạt (Hoạt động)</option>
                                    <option value="INACTIVE" className="bg-slate-900 text-white">Khóa tài khoản</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="border border-slate-800 rounded-xl p-4 bg-slate-900 shadow-inner">
                        <label className="block text-sm font-medium text-amber-500 mb-3 flex items-center gap-1.5"><KeyRound size={16}/> Thông tin Tín thức (Đăng nhập)</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">Tên đăng nhập (Username)</label>
                                <input 
                                    type="text" 
                                    disabled={isEdit}
                                    autoComplete="off"
                                    defaultValue={user?.username || ''}
                                    className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-mono disabled:opacity-50 disabled:cursor-not-allowed [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_30px_#1e293b_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                                />
                                {isEdit && <span className="text-[10px] text-slate-500 mt-1">Không thể đổi username.</span>}
                            </div>
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">{isEdit ? 'Đổi mật khẩu mới' : 'Mật khẩu khởi tạo'}</label>
                                <input 
                                    type="password" 
                                    autoComplete="new-password"
                                    placeholder={isEdit ? 'Bỏ trống nếu không đổi' : 'Nhập mật khẩu...'}
                                    className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-mono [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_30px_#1e293b_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-5 border-t border-slate-800 flex justify-end gap-3 bg-slate-900 shrink-0">
                    <button 
                        onClick={onClose}
                        className="px-5 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors">
                        Đóng
                    </button>
                    <button className="px-5 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                        {isEdit ? 'Cập nhật Hệ thống' : 'Tạo Tài khoản'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
