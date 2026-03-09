import React from 'react';
import { ArrowRight, Lock, Mail } from 'lucide-react';

export default function Login() {
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
                    <p className="text-neutral-400">Đăng nhập để quản lý phòng của bạn</p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-2">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail size={18} className="text-neutral-500" />
                                </div>
                                <input
                                    type="email"
                                    className="w-full bg-neutral-900/50 border border-neutral-700 text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all placeholder:text-neutral-600"
                                    placeholder="name@example.com"
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
                                    className="w-full bg-neutral-900/50 border border-neutral-700 text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all placeholder:text-neutral-600"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            className="w-full bg-[#D4AF37] text-neutral-900 py-3.5 rounded-xl font-semibold hover:bg-yellow-500 transition-all flex items-center justify-center gap-2 group shadow-[0_4px_14px_0_rgba(212,175,55,0.2)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.3)]"
                        >
                            Đăng nhập <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
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
