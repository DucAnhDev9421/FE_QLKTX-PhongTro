import { useState, useEffect } from 'react';
import { Layout } from '../../components/layout';
import { User as UserIcon, Shield, Mail, Phone, Save, KeyRound, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/auth';
import Alert from '../../components/ui/Alert';
import avatarImg from '../../assets/man-avatar-png-image_6514640.png';

export default function Profile() {
    const { user, loading: authLoading } = useAuth();
    
    // Profile State
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    
    // Password State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // UI Status
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Sync user data when loaded
    useEffect(() => {
        if (user) {
            setFullName(user.fullName || '');
            setEmail(user.email || '');
            setPhone(user.phoneNumber || '');
        }
    }, [user]);

    const handleSaveProfile = async () => {
        setNotification(null);
        setIsUpdatingProfile(true);
        try {
            await authService.updateProfile({
                fullName,
                email,
                phoneNumber: phone
            });
            setNotification({ type: 'success', message: 'Cập nhật thông tin cá nhân thành công!' });
            // Optional: refresh page or useAuth context
        } catch (error: any) {
            setNotification({ 
                type: 'error', 
                message: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật hồ sơ.' 
            });
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) return;
        
        setNotification(null);
        setIsUpdatingPassword(true);
        try {
            await authService.changePassword({
                oldPassword: currentPassword,
                newPassword: newPassword
            });
            setNotification({ type: 'success', message: 'Đổi mật khẩu thành công!' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            setNotification({ 
                type: 'error', 
                message: error.response?.data?.message || 'Mật khẩu hiện tại không chính xác hoặc có lỗi xảy ra.' 
            });
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    const isPasswordMatch = !newPassword || !confirmPassword || newPassword === confirmPassword;

    if (authLoading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin text-emerald-500" size={32} />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-100 mb-1">Hồ sơ cá nhân</h1>
                <p className="text-slate-400 text-sm">Quản lý thông tin liên hệ và bảo mật tài khoản cá nhân.</p>
            </div>

            {notification && (
                <div className="mb-6">
                    <Alert 
                        type={notification.type} 
                        message={notification.message} 
                        onClose={() => setNotification(null)} 
                    />
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Cột 1: Thông tin chung */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden h-fit">
                    <div className="p-6 pb-0 flex justify-center">
                        <div className="w-24 h-24 rounded-2xl bg-slate-800 border-4 border-slate-900 overflow-hidden shadow-2xl skew-y-0 transform transition-transform hover:scale-105">
                            <img src={avatarImg} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                    </div>
                    <div className="pt-6 px-6 pb-6 text-center">
                        <h2 className="text-xl font-bold text-slate-100 mb-1">{user?.fullName || user?.username}</h2>
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <span className="text-slate-500 font-mono text-sm">@{user?.username}</span>
                            <span className="flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                <Shield size={10} /> {user?.role?.replace('SCOPE_', '') || 'User'}
                            </span>
                        </div>
                        
                        <div className="space-y-4 pt-4 border-t border-slate-800 text-left">
                            <div className="flex items-center gap-3 text-slate-400">
                                <Mail size={16} className="shrink-0" />
                                <span className="text-sm truncate">{user?.email || 'Chưa cập nhật email'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400">
                                <Phone size={16} className="shrink-0" />
                                <span className="text-sm">{user?.phoneNumber || 'Chưa cập nhật SĐT'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400">
                                <Shield size={16} className="shrink-0" />
                                <span className="text-sm">Ngày tham gia: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
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
                                disabled={isUpdatingProfile}
                                className="bg-slate-800 hover:bg-emerald-600 border border-slate-700 hover:border-emerald-500 text-slate-200 hover:text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                                {isUpdatingProfile ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
                                Lưu Thông tin
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
                                    placeholder="Ít nhất 6 ký tự..."
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
                                    className={`w-full bg-slate-800 border text-sm text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 transition-all font-mono ${!isPasswordMatch ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700 focus:ring-emerald-500'}`}
                                />
                                {!isPasswordMatch && (
                                    <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12}/> Mật khẩu xác nhận không khớp!</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end pt-5 border-t border-slate-800">
                            <button 
                                onClick={handleChangePassword}
                                disabled={isUpdatingPassword || !currentPassword || !newPassword || !isPasswordMatch}
                                className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 border border-amber-500 disabled:border-transparent text-white disabled:cursor-not-allowed px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg flex items-center gap-2">
                                {isUpdatingPassword ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />} 
                                Cập nhật Mật khẩu
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
