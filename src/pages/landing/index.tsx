import React from 'react';
import { ArrowRight, Home, Shield, Wifi } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-neutral-900 text-neutral-100 font-sans selection:bg-yellow-500/30">
            {/* Navigation (Glassmorphism) */}
            <nav className="fixed top-0 w-full z-50 bg-neutral-900/60 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="text-2xl font-bold tracking-tighter text-white">
                        QL<span className="text-[#D4AF37]">KTX</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
                        <a href="#features" className="hover:text-[#D4AF37] transition-colors">Tiện ích</a>
                        <a href="/phong-tro" className="hover:text-[#D4AF37] transition-colors">Phòng trọ</a>
                        <a href="/login" className="bg-[#D4AF37] text-neutral-900 px-6 py-2.5 flex items-center gap-2 rounded-full hover:bg-yellow-500 transition-colors">
                            Đăng nhập <ArrowRight size={16} />
                        </a>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
                {/* Abstract shapes for background */}
                <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 -left-1/4 w-[600px] h-[600px] bg-neutral-800 rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
                        Không gian sống <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-yellow-600">
                            hiện đại & tiện nghi
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-neutral-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Hệ thống quản lý phòng trọ chuyên nghiệp, mang đến trải nghiệm sống thoải mái, an ninh tuyệt đối cho người thuê.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="/phong-tro" className="w-full sm:w-auto bg-[#D4AF37] text-neutral-900 px-8 py-4 rounded-full font-medium hover:bg-yellow-500 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] inline-block text-center">
                            Xem phòng ngay
                        </a>
                        <button className="w-full sm:w-auto bg-white/5 border border-white/10 backdrop-blur-sm px-8 py-4 rounded-full font-medium hover:bg-white/10 transition-colors">
                            Tìm hiểu thêm
                        </button>
                    </div>
                </div>
            </section>

            {/* Stats/Social Proof (Glass effect) */}
            <section className="px-6 pb-20">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-[#D4AF37] mb-2">50+</div>
                            <div className="text-sm text-neutral-400">Phòng cao cấp</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-[#D4AF37] mb-2">24/7</div>
                            <div className="text-sm text-neutral-400">An ninh giám sát</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-[#D4AF37] mb-2">100%</div>
                            <div className="text-sm text-neutral-400">Khách hài lòng</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-[#D4AF37] mb-2">3</div>
                            <div className="text-sm text-neutral-400">Cơ sở trung tâm</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-24 px-6 bg-neutral-950">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16 md:text-center">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Tiện ích trọn vẹn</h2>
                        <p className="text-neutral-400 max-w-2xl mx-auto">Mọi nhu cầu sinh hoạt của bạn đều được đáp ứng với chất lượng dịch vụ tốt nhất.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={<Shield size={24} className="text-[#D4AF37]" />}
                            title="An ninh 24/7"
                            desc="Hệ thống camera an ninh các tầng. Ra vào cửa bằng vân tay kết hợp thẻ từ riêng tư."
                        />
                        <FeatureCard
                            icon={<Wifi size={24} className="text-[#D4AF37]" />}
                            title="Internet tốc độ cao"
                            desc="Hệ thống Wifi Mesh chuyên dụng đảm bảo kết nối mượt mà cho công việc và giải trí."
                        />
                        <FeatureCard
                            icon={<Home size={24} className="text-[#D4AF37]" />}
                            title="Full nội thất"
                            desc="Giường nệm cao cấp, tủ lạnh, máy lạnh, tủ quần áo cá nhân, máy giặt dùng chung."
                        />
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-32 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[#D4AF37]/5" />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl font-bold mb-8">Bạn cần tìm phòng trọ ưng ý?</h2>
                    <button className="bg-white text-neutral-900 px-8 py-4 rounded-full font-medium hover:bg-neutral-200 transition-colors">
                        Liên hệ ngay với chúng tôi
                    </button>
                </div>
            </section>

            {/* Minimal Footer */}
            <footer className="border-t border-white/10 py-12 px-6 text-sm text-neutral-500">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>© 2026 QLKTX. All rights reserved.</div>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Quy định</a>
                        <a href="#" className="hover:text-white transition-colors">Bảo mật</a>
                        <a href="#" className="hover:text-white transition-colors">Hỗ trợ</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="p-8 bg-neutral-900 border border-neutral-800 rounded-2xl hover:border-neutral-700 transition-colors group cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-xl font-semibold mb-3">{title}</h3>
            <p className="text-neutral-400 leading-relaxed">{desc}</p>
        </div>
    );
}
