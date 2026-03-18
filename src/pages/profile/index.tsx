import { useState } from 'react';
import { Layout } from '../../components/layout';
import { User as UserIcon, Shield, Mail, Phone, Save, KeyRound, AlertCircle } from 'lucide-react';

export default function Profile() {
    const [fullName, setFullName] = useState('Admin User');
    const [email, setEmail] = useState('admin@ktx.com');
    const [phone, setPhone] = useState('0912345678');
    
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSaveProfile = () => {
        // TBD handle save
    };

    const handleChangePassword = () => {
        // TBD handle change
    };

    const isPasswordMath = !newPassword || !confirmPassword || newPassword === confirmPassword;

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-100 mb-1">Hồ sơ cá nhân</h1>
                <p className="text-slate-400 text-sm">Quản lý thông tin liên hệ và bảo mật tài khoản cá nhân.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Cột 1: Thông tin chung */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden h-fit">
                    <div className="h-24 bg-gradient-to-r from-emerald-600 to-emerald-800 relative">
                        <div className="absolute -bottom-10 left-6 w-20 h-20 rounded-xl bg-slate-800 border-4 border-slate-900 flex items-center justify-center shadow-lg">
                            <span className="text-2xl font-bold text-emerald-500">AD</span>
                        </div>
                    </div>
                    <div className="pt-14 px-6 pb-6">
                        <h2 className="text-xl font-bold text-slate-100 mb-1">{fullName}</h2>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-slate-500 font-mono text-sm">@admin_sys</span>
                            <span className="flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-rose-500/10 text-rose-500 border border-rose-500/20">
                                <Shield size={10} /> Admin
                            </span>
                        </div>
                        
                        <div className="space-y-4 pt-4 border-t border-slate-800">
                            <div className="flex items-center gap-3 text-slate-400">
                                <Mail size={16} />
                                <span className="text-sm">{email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400">
                                <Phone size={16} />
                                <span className="text-sm">{phone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400">
                                <Shield size={16} />
                                <span className="text-sm">Tham gia: 15/06/2026</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cột 2 & 3: Cập nhật dữ liệu */}
                <div className="xl:col-span-2 space-y-6">
                    {/* Cập nhật thông tin */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg p-6">
                        <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
                            <UserIcon size={20} className="text-emerald-500" /> Cập nhật Thông tin
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1.5">Họ và tên</label>
                                <input 
                                    type="text" 
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1.5">Số điện thoại</label>
                                <input 
                                    type="text" 
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-400 mb-1.5">Email liên hệ</label>
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button 
                                onClick={handleSaveProfile}
                                className="bg-slate-800 hover:bg-emerald-600 border border-slate-700 hover:border-emerald-500 text-slate-200 hover:text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow-lg">
                                <Save size={16} /> Lưu Thông tin
                            </button>
                        </div>
                    </div>

                    {/* Đổi mật khẩu */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg p-6">
                        <h3 className="text-lg font-bold text-amber-500 mb-6 flex items-center gap-2">
                            <KeyRound size={20} /> Đổi Mật khẩu
                        </h3>
                        
                        <div className="space-y-4 mb-6 max-w-md">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1.5">Mật khẩu hiện tại</label>
                                <input 
                                    type="password" 
                                    value={currentPassword}
                                    onChange={e => setCurrentPassword(e.target.value)}
                                    placeholder="Nhập mật khẩu cũ..."
                                    className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1.5">Mật khẩu mới</label>
                                <input 
                                    type="password" 
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    placeholder="Ít nhất 8 ký tự..."
                                    className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1.5">Nhập lại mật khẩu mới</label>
                                <input 
                                    type="password" 
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    placeholder="Nhập lại mật khẩu mới..."
                                    className={`w-full bg-slate-800 border text-sm text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 transition-all font-mono ${!isPasswordMath ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700 focus:ring-emerald-500'}`}
                                />
                                {!isPasswordMath && (
                                    <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12}/> Mật khẩu xác nhận không khớp!</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end pt-5 border-t border-slate-800">
                            <button 
                                onClick={handleChangePassword}
                                disabled={!currentPassword || !newPassword || !isPasswordMath}
                                className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 border border-amber-500 disabled:border-transparent text-white disabled:cursor-not-allowed px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg flex items-center gap-2">
                                <KeyRound size={16} /> Cập nhật Mật khẩu
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
