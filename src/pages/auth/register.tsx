import React from 'react';
import { ArrowRight, Lock, Mail, User, Phone } from 'lucide-react';

export default function Register() {
    return (
        <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-6 py-12 selection:bg-yellow-500/30">
            {/* Background elements */}
            <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-neutral-800 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <div className="text-3xl font-bold tracking-tighter text-white mb-2">
                        QL<span className="text-[#D4AF37]">KTX</span>
                    </div>
                    <h1 className="text-2xl font-semibold text-white mb-2">Tạo tài khoản mới</h1>
                    <p className="text-neutral-400">Đăng ký để trải nghiệm dịch vụ của chúng tôi</p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
                    <form className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-2">Họ và tên</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User size={18} className="text-neutral-500" />
                                </div>
                                <input
                                    type="text"
                                    className="w-full bg-neutral-900/50 border border-neutral-700 text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all placeholder:text-neutral-600"
                                    placeholder="Nguyễn Văn A"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-2">Số điện thoại</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Phone size={18} className="text-neutral-500" />
                                </div>
                                <input
                                    type="text"
                                    className="w-full bg-neutral-900/50 border border-neutral-700 text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all placeholder:text-neutral-600"
                                    placeholder="09xx xxx xxx"
                                />
                            </div>
                        </div>

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
                            <label className="block text-sm font-medium text-neutral-300 mb-2">Mật khẩu</label>
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
                            className="w-full bg-[#D4AF37] text-neutral-900 py-3.5 rounded-xl font-semibold hover:bg-yellow-500 transition-all flex items-center justify-center gap-2 group shadow-[0_4px_14px_0_rgba(212,175,55,0.2)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.3)] mt-2"
                        >
                            Tạo tài khoản <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        <p className="text-xs text-center text-neutral-500 mt-4">
                            Bằng việc đăng ký, bạn đồng ý với <a href="#" className="underline">Điều khoản dịch vụ</a> và <a href="#" className="underline">Chính sách bảo mật</a> của chúng tôi.
                        </p>
                    </form>

                    <div className="mt-8 text-center text-sm text-neutral-400">
                        Đã có tài khoản?{' '}
                        <a href="/login" className="text-[#D4AF37] font-medium hover:text-yellow-500 transition-colors">
                            Đăng nhập
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
