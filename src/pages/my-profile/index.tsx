import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/auth';
import { ArrowLeft, User, Phone, Mail, LogOut, Shield, KeyRound, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import avatarImg from '../../assets/man-avatar-png-image_6514640.png';

export default function MyProfile() {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();

    // Modal States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPassModalOpen, setIsPassModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Edit Profile Form State
    const [profileForm, setProfileForm] = useState({
        fullName: user?.fullName || '',
        phoneNumber: user?.phoneNumber || '',
        email: user?.email || ''
    });

    // Change Pass Form State
    const [passForm, setPassForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    if (loading) {
        return <ProfileSkeleton />;
    }

    if (!user) {
        return null; // Let ProtectedRoute redirect
    }

    const handleOpenEdit = () => {
        setProfileForm({
            fullName: user.fullName || '',
            phoneNumber: user.phoneNumber || '',
            email: user.email || ''
        });
        setErrorMsg('');
        setSuccessMsg('');
        setIsEditModalOpen(true);
    };

    const handleOpenPass = () => {
        setPassForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setErrorMsg('');
        setSuccessMsg('');
        setIsPassModalOpen(true);
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        setErrorMsg('');
        try {
            await authService.updateProfile(profileForm);
            setSuccessMsg('Cập nhật thông tin thành công!');
            setTimeout(() => {
                setIsEditModalOpen(false);
                window.location.reload(); // Quick refresh to update useAuth context
            }, 1500);
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật.');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passForm.newPassword !== passForm.confirmPassword) {
            setErrorMsg('Mật khẩu mới không khớp!');
            return;
        }
        setIsUpdating(true);
        setErrorMsg('');
        try {
            await authService.changePassword({
                oldPassword: passForm.oldPassword,
                newPassword: passForm.newPassword
            });
            setSuccessMsg('Đổi mật khẩu thành công!');
            setTimeout(() => {
                setIsPassModalOpen(false);
            }, 1500);
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu.');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col relative">
            {/* Header */}
            <header className="h-16 border-b border-white/10 bg-neutral-900/80 backdrop-blur flex items-center px-6 sticky top-0 z-10">
                <button 
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                    <ArrowLeft size={18} />
                    <span>Trang chủ</span>
                </button>
                <div className="ml-auto text-xl font-bold tracking-tighter">
                    QL<span className="text-[#D4AF37]">KTX</span>
                </div>
            </header>

            <div className="flex-1 max-w-3xl w-full mx-auto p-6 py-12">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden backdrop-blur-sm">
                    {/* Decorative */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                        {/* Avatar */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-32 h-32 rounded-full border-4 border-[#D4AF37] p-1 overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                                <img src={avatarImg} alt="User Avatar" className="w-full h-full object-cover rounded-full" />
                            </div>
                            <div className="inline-flex flex-col items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
                                <Shield size={14} />
                                <span>{user.role?.replace('SCOPE_', '').replace('ROLE_', '') || 'TENANT'}</span>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 w-full space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold mb-1">{user.fullName || user.username || 'Người dùng'}</h1>
                                <p className="text-neutral-400">Quản lý thông tin cá nhân và tài khoản</p>
                            </div>

                            <div className="space-y-4 bg-black/20 p-6 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center shrink-0"><User size={18} /></div>
                                    <div><div className="text-sm text-neutral-500 mb-0.5">Tên tài khoản</div><div className="font-medium">{user.username}</div></div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center shrink-0"><Phone size={18} /></div>
                                    <div><div className="text-sm text-neutral-500 mb-0.5">Số điện thoại</div><div className="font-medium">{user.phoneNumber || 'Chưa cập nhật'}</div></div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center shrink-0"><Mail size={18} /></div>
                                    <div><div className="text-sm text-neutral-500 mb-0.5">Email</div><div className="font-medium">{user.email || 'Chưa cập nhật'}</div></div>
                                </div>
                            </div>

                            <div className="pt-4 flex flex-col sm:flex-row gap-3">
                                <button onClick={handleOpenEdit} className="flex-1 bg-[#D4AF37] text-neutral-900 py-3 px-4 rounded-xl font-bold hover:bg-yellow-500 transition-colors shadow-lg text-center">
                                    Chỉnh sửa hồ sơ
                                </button>
                                <button onClick={handleOpenPass} className="flex-1 border border-white/20 text-neutral-300 py-3 px-4 rounded-xl font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2 hidden lg:flex">
                                    <KeyRound size={18} /> Đổi mật khẩu
                                </button>
                                <button onClick={logout} className="sm:w-auto w-full px-6 border border-white/20 text-red-400 py-3 rounded-xl font-semibold hover:bg-red-500/10 hover:border-red-500/50 transition-all flex items-center justify-center gap-2">
                                    <LogOut size={18} /> Đăng xuất
                                </button>
                            </div>
                            {/* Mobile only password button */}
                            <div className="flex lg:hidden w-full">
                                <button onClick={handleOpenPass} className="w-full border border-white/20 text-neutral-300 py-3 px-4 rounded-xl font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                                    <KeyRound size={18} /> Đổi mật khẩu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-2xl font-bold mb-4 text-white">Chỉnh sửa hồ sơ</h2>
                        {errorMsg && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-4 text-sm">{errorMsg}</div>}
                        {successMsg && <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-3 rounded-lg mb-4 text-sm">{successMsg}</div>}
                        
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-1">Họ và tên</label>
                                <input type="text" value={profileForm.fullName} onChange={e => setProfileForm({...profileForm, fullName: e.target.value})} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]" placeholder="Nhập họ tên..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-1">Số điện thoại</label>
                                <input type="text" value={profileForm.phoneNumber} onChange={e => setProfileForm({...profileForm, phoneNumber: e.target.value})} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]" placeholder="Nhập SĐT..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-1">Email</label>
                                <input type="email" value={profileForm.email} onChange={e => setProfileForm({...profileForm, email: e.target.value})} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]" placeholder="Nhập email..." />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-2.5 rounded-lg font-semibold border border-neutral-600 hover:bg-neutral-700 transition-colors">Hủy</button>
                                <button type="submit" disabled={isUpdating} className="flex-1 bg-[#D4AF37] text-neutral-900 py-2.5 rounded-lg font-bold hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2">
                                    {isUpdating ? <Loader2 size={18} className="animate-spin" /> : 'Lưu lại'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {isPassModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-2xl font-bold mb-4 text-white">Đổi mật khẩu</h2>
                        {errorMsg && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-4 text-sm">{errorMsg}</div>}
                        {successMsg && <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-3 rounded-lg mb-4 text-sm">{successMsg}</div>}
                        
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-1">Mật khẩu hiện tại</label>
                                <input type="password" value={passForm.oldPassword} onChange={e => setPassForm({...passForm, oldPassword: e.target.value})} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-1">Mật khẩu mới</label>
                                <input type="password" value={passForm.newPassword} onChange={e => setPassForm({...passForm, newPassword: e.target.value})} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]" required minLength={6} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-1">Xác nhận mật khẩu mới</label>
                                <input type="password" value={passForm.confirmPassword} onChange={e => setPassForm({...passForm, confirmPassword: e.target.value})} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]" required minLength={6} />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setIsPassModalOpen(false)} className="flex-1 py-2.5 rounded-lg font-semibold border border-neutral-600 hover:bg-neutral-700 transition-colors">Hủy</button>
                                <button type="submit" disabled={isUpdating} className="flex-1 bg-[#D4AF37] text-neutral-900 py-2.5 rounded-lg font-bold hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2">
                                    {isUpdating ? <Loader2 size={18} className="animate-spin" /> : 'Xác nhận'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function ProfileSkeleton() {
    return (
        <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col relative">
            <header className="h-16 border-b border-white/10 bg-neutral-900/80 backdrop-blur flex items-center px-6 sticky top-0 z-10">
                <div className="w-24 h-6 bg-white/10 rounded-lg animate-pulse cursor-pointer"></div>
                <div className="ml-auto w-16 h-8 bg-white/10 rounded-lg animate-pulse"></div>
            </header>

            <div className="flex-1 max-w-3xl w-full mx-auto p-6 py-12">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                        {/* Avatar */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-32 h-32 rounded-full border-4 border-[#D4AF37]/20 bg-white/10 animate-pulse"></div>
                            <div className="w-20 h-6 rounded-full bg-white/10 animate-pulse"></div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 w-full space-y-6">
                            <div>
                                <div className="w-48 h-8 rounded-lg animate-pulse bg-white/10 mb-2"></div>
                                <div className="w-64 h-4 rounded-lg animate-pulse bg-white/10"></div>
                            </div>

                            <div className="space-y-4 bg-black/20 p-6 rounded-2xl border border-white/5">
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse shrink-0"></div>
                                        <div className="space-y-2">
                                            <div className="w-20 h-3 bg-white/10 rounded animate-pulse"></div>
                                            <div className="w-32 h-4 bg-white/10 rounded animate-pulse"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 flex flex-col sm:flex-row gap-3">
                                <div className="flex-1 h-12 bg-white/10 rounded-xl animate-pulse"></div>
                                <div className="flex-1 h-12 bg-white/10 rounded-xl animate-pulse"></div>
                                <div className="sm:w-32 w-full h-12 bg-white/10 rounded-xl animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
