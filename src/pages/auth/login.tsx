import React, { useState } from 'react';
import { ArrowRight, Lock, User, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { authService, decodeToken } from '../../services/auth';

export default function Login() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await authService.login({ username, password });
            // Handle different token path depending on API response wrapper
            const token = response?.data?.token || response?.token || response?.result?.token;
            if (token) {
                localStorage.setItem('token', token);
                queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
            }

            // Giải mã token để lấy role điều hướng
            if (token) {
                const decoded = decodeToken(token);
                const role = (decoded?.scope || '').toUpperCase().replace('SCOPE_', '').replace('ROLE_', '');

                if (role === 'TENANT') {
                    navigate('/');
                } else {
                    navigate('/manage/dashboard');
                }
            } else {
                navigate('/');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-6 selection:bg-yellow-500/30">
            {/* Background elements */}
            <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-neutral-800 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10">
                    <div className="text-3xl font-bold tracking-tighter text-white mb-2">
                        QL<span className="text-[#D4AF37]">KTX</span>
                    </div>
                    <h1 className="text-2xl font-semibold text-white mb-2">Chào mừng trở lại</h1>
                    <p className="text-neutral-400">Đăng nhập để quản lý hệ thống</p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl flex items-center gap-2 text-sm">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-2">Tên đăng nhập</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User size={18} className="text-neutral-500" />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="w-full bg-neutral-900/50 border border-neutral-700 text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all placeholder:text-neutral-600"
                                    placeholder="Tên đăng nhập"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-neutral-300">Mật khẩu</label>
                                <a href="#" className="text-sm text-[#D4AF37] hover:text-yellow-500 transition-colors">Quên mật khẩu?</a>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock size={18} className="text-neutral-500" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-neutral-900/50 border border-neutral-700 text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all placeholder:text-neutral-600"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#D4AF37] text-neutral-900 py-3.5 rounded-xl font-semibold hover:bg-yellow-500 transition-all flex items-center justify-center gap-2 group shadow-[0_4px_14px_0_rgba(212,175,55,0.2)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.3)] disabled:opacity-50"
                        >
                            {loading ? 'Đang đăng nhập...' : (
                                <>Đăng nhập <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-neutral-400">
                        Chưa có tài khoản?{' '}
                        <a href="/register" className="text-[#D4AF37] font-medium hover:text-yellow-500 transition-colors">
                            Đăng ký ngay
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
