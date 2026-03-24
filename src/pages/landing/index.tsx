import React from 'react';
import { ArrowRight, Home, Shield, Sun, Moon, Maximize, Users, Star, CheckCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { mockRooms } from '../../mock/data';
import demoImg from '../../assets/demo.jpg';
import avatarImg from '../../assets/man-avatar-png-image_6514640.png';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { contractService } from '../../services';

export default function LandingPage() {
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();
    const { data: myRoomData } = useQuery({
        queryKey: ['myRoom'],
        queryFn: () => contractService.getMyRoom(),
        enabled: !!user,
    });

    const hasRoom = !!(myRoomData?.room);

    const isAdminOrOwner = React.useMemo(() => {
        if (!user) return false;
        const roleStr = (user.role || '').toUpperCase();
        const roleArray = Array.isArray(user.roles) ? user.roles : [];
        return roleStr.includes('ADMIN') || roleStr.includes('OWNER') || 
               roleArray.some(r => r.toUpperCase().includes('ADMIN') || r.toUpperCase().includes('OWNER'));
    }, [user]);

    // Lấy 3 phòng đang trống để hiển thị ở mục Tour
    const availableRooms = mockRooms.filter(r => r.currentStatus === 'AVAILABLE').slice(0, 3);
    const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN').format(price);

    return (
        <div className={`min-h-screen font-sans selection:bg-[#D4AF37]/30 transition-colors duration-500 ${theme === 'dark' ? 'bg-neutral-900 text-neutral-100' : 'bg-[#FAFAFA] text-neutral-900'
            }`}>
            {/* Navigation (Glassmorphism) */}
            <nav className={`fixed top-0 w-full z-50 backdrop-blur-xl border-b transition-colors duration-500 ${theme === 'dark' ? 'bg-neutral-900/70 border-white/10' : 'bg-white/70 border-black/5 shadow-sm'
                }`}>
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="text-2xl font-bold tracking-tighter">
                        QL<span className="text-[#D4AF37]">KTX</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
                        <a href="#tour" className={`transition-colors ${theme === 'dark' ? 'hover:text-[#D4AF37]' : 'hover:text-[#D4AF37] text-neutral-600'}`}>Xem Tour</a>
                        <a href="#features" className={`transition-colors ${theme === 'dark' ? 'hover:text-[#D4AF37]' : 'hover:text-[#D4AF37] text-neutral-600'}`}>Dịch vụ</a>
                        <Link to="/phong-tro" className={`transition-colors ${theme === 'dark' ? 'hover:text-[#D4AF37]' : 'hover:text-[#D4AF37] text-neutral-600'}`}>Tất cả phòng</Link>

                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-neutral-800 text-yellow-400' : 'hover:bg-neutral-200 text-slate-700'
                                }`}
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {user && hasRoom && (
                            <Link 
                                to="/my-room" 
                                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all font-semibold text-sm ${
                                    theme === 'dark' 
                                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20' 
                                    : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                                }`}
                            >
                                <Home size={16} />
                                Phòng của tôi
                            </Link>
                        )}

                        {isAdminOrOwner && (
                            <Link 
                                to="/manage" 
                                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all font-semibold text-sm ${
                                    theme === 'dark' 
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' 
                                    : 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'
                                }`}
                            >
                                <Shield size={16} />
                                Quản lý
                            </Link>
                        )}

                        {user ? (
                            <Link to="/my-profile" className="flex items-center gap-3">
                                <img src={avatarImg} alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-[#D4AF37] shadow-lg hover:scale-105 transition-transform" />
                            </Link>
                        ) : (
                            <Link to="/login" className="bg-[#D4AF37] text-neutral-900 px-6 py-2.5 flex items-center gap-2 rounded-full hover:bg-yellow-500 transition-colors shadow-lg hover:shadow-xl font-semibold">
                                Cổng cư dân <ArrowRight size={16} />
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 md:pt-[22vh] md:pb-[15vh] px-6 overflow-hidden min-h-[90vh]">
                <div className="absolute inset-0 z-0">
                    <img src={demoImg} alt="Dormitory Background" className="w-full h-full object-cover scale-105" />
                    <div className={`absolute inset-0 transition-colors duration-500 ${theme === 'dark'
                            ? 'bg-gradient-to-r from-neutral-900/95 via-neutral-900/80 to-neutral-900/30'
                            : 'bg-gradient-to-r from-white/95 via-white/85 to-white/30'
                        }`} />
                </div>

                <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                    <div className="max-w-2xl">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border mb-6 text-sm font-medium ${theme === 'dark' ? 'bg-white/5 border-white/10 text-neutral-300' : 'bg-black/5 border-black/10 text-neutral-700'
                            }`}>
                            <Star size={16} className="text-[#D4AF37] fill-[#D4AF37]" /> Tiêu chuẩn sống cao cấp
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
                            Định chuẩn <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-yellow-600">
                                không gian sống
                            </span>
                        </h1>
                        <p className={`text-lg md:text-xl mb-12 leading-relaxed ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                            Hệ thống căn hộ dịch vụ và ký túc xá cao cấp. Tận hưởng môi trường sống văn minh, an toàn tuyệt đối cùng hệ sinh thái tiện ích đẳng cấp.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <Link to="/phong-tro" className="w-full sm:w-auto bg-[#D4AF37] text-neutral-900 px-8 py-4 rounded-full font-bold hover:bg-yellow-500 transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] text-center flex items-center justify-center gap-2">
                                ĐẶT PHÒNG NGAY <ArrowRight size={18} />
                            </Link>
                            <a href="#tour" className={`w-full sm:w-auto border backdrop-blur-md px-8 py-4 rounded-full font-semibold transition-colors text-center ${theme === 'dark' ? 'bg-white/5 border-white/20 hover:bg-white/10 text-white' : 'bg-black/5 border-black/20 hover:bg-black/10 text-neutral-900'
                                }`}>
                                Xem Tour Ảnh
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust/Stats Section (Glassmorphism overlap) */}
            <section className="px-6 relative z-20 -mt-16 mb-24">
                <div className="max-w-6xl mx-auto">
                    <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 p-8 md:p-12 backdrop-blur-xl border rounded-[2rem] shadow-2xl transition-colors ${theme === 'dark' ? 'bg-neutral-800/40 border-white/10' : 'bg-white/60 border-white shadow-neutral-200/50'
                        }`}>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-2">100%</div>
                            <div className={`text-sm font-medium ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>Phòng có cửa sổ</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-2">24/7</div>
                            <div className={`text-sm font-medium ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>Camera An ninh & Cửa từ</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-2">Free</div>
                            <div className={`text-sm font-medium ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>Dọn phòng hàng tuần</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-2">5+</div>
                            <div className={`text-sm font-medium ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>Tòa nhà trung tâm</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Room Tour Section */}
            <section id="tour" className="py-24 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div>
                            <div className="flex items-center gap-2 text-[#D4AF37] font-semibold tracking-wider text-sm mb-3 uppercase">
                                <Sparkles /> Không gian thực tế
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold">Góc sống <span className="text-[#D4AF37]">trang nhã</span></h2>
                            <p className={`mt-4 max-w-xl text-lg ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                                Dạo một vòng qua các căn phòng đang sẵn sàng chào đón bạn. Thiết kế tối giản, tinh tế nhưng vẫn đầy đủ công năng.
                            </p>
                        </div>
                        <Link to="/phong-tro" className={`inline-flex items-center gap-2 font-semibold pb-1 border-b-2 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors ${theme === 'dark' ? 'border-neutral-700 text-neutral-300' : 'border-neutral-300 text-neutral-600'}`}>
                            Xem toàn bộ phòng <ArrowRight size={18} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {availableRooms.map((room) => (
                            <Link to={`/phong-tro/${room.roomId}`} key={room.roomId} className="group cursor-pointer">
                                <div className={`relative h-[300px] rounded-[2rem] overflow-hidden mb-6 border transition-all ${theme === 'dark' ? 'border-white/10' : 'border-neutral-200'
                                    }`}>
                                    <img src={demoImg} alt="Room preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                                    <div className="absolute top-4 right-4">
                                        <div className="backdrop-blur-md bg-white/20 border border-white/30 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                                            Phòng {room.roomNumber}
                                        </div>
                                    </div>

                                    <div className="absolute bottom-0 left-0 w-full p-6">
                                        <div className="flex items-end justify-between">
                                            <div>
                                                <h3 className="text-2xl font-bold text-white mb-2">{room.roomType.typeName}</h3>
                                                <div className="flex items-center gap-4 text-white/80 text-sm">
                                                    <span className="flex items-center gap-1.5"><Maximize size={16} /> {room.roomType.area}m²</span>
                                                    <span className="flex items-center gap-1.5"><Users size={16} /> {room.roomType.maxOccupancy} ng</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-2">
                                    <div className={`text-sm mb-1 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>Chỉ từ</div>
                                    <div className="text-2xl font-bold text-[#D4AF37]">
                                        {formatPrice(room.roomType.basePrice)} <span className={`text-base font-normal ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>đ/tháng</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features (Guarantees) */}
            <section id="features" className={`py-32 px-6 transition-colors duration-300 ${theme === 'dark' ? 'bg-neutral-950' : 'bg-white'
                }`}>
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Trải nghiệm sống <span className="text-[#D4AF37]">Premium</span></h2>
                        <p className={`max-w-2xl mx-auto text-lg ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                            }`}>Góp phần xây dựng lối sống văn minh, chúng tôi cam kết chất lượng dịch vụ ở mức cao nhất.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            theme={theme}
                            icon={<Shield size={28} className="text-[#D4AF37]" />}
                            title="An Ninh Chuyên Nghiệp"
                            desc="Hệ thống camera giám sát thông minh 24/7. Kiểm soát ra vào bằng công nghệ sinh trắc học và thẻ từ độc lập cho mỗi cư dân."
                        />
                        <FeatureCard
                            theme={theme}
                            icon={<Home size={28} className="text-[#D4AF37]" />}
                            title="Kiến Trúc Tinh Tế"
                            desc="Thiết kế hiện đại, tận dụng tối đa ánh sáng tự nhiên. Trang bị sẵn giường nệm cao cấp, tủ âm tường và bàn làm việc thái công học."
                        />
                        <FeatureCard
                            theme={theme}
                            icon={<CheckCircle size={28} className="text-[#D4AF37]" />}
                            title="Dịch Vụ Vượt Trội"
                            desc="Đội ngũ bảo trì tận tâm phản hồi trong 2h. Dịch vụ dọn vệ sinh định kỳ giúp duy trì không gian sống luôn tươi mới."
                        />
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src={demoImg} alt="CTA Background" className="w-full h-full object-cover blur-sm opacity-30" />
                    <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-neutral-900/90' : 'bg-neutral-50/90'}`} />
                </div>
                <div className="max-w-4xl mx-auto text-center relative z-10 p-12 backdrop-blur-md border rounded-[2rem] shadow-2xl ${
                    theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/40 border-white'
                }">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8">Sẵn sàng để dọn vào?</h2>
                    <p className={`text-lg mb-10 max-w-2xl mx-auto ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        Hãy ghé thăm trực tiếp để tự mình cảm nhận không gian và chất lượng dịch vụ của chúng tôi.
                    </p>
                    <Link to="/phong-tro" className="bg-[#D4AF37] text-neutral-900 px-10 py-5 rounded-full font-bold hover:bg-yellow-500 transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] text-lg inline-block">
                        CHỌN PHÒNG CHO BẠN
                    </Link>
                </div>
            </section>

            {/* Premium Footer */}
            <footer className={`border-t py-12 px-6 text-sm transition-colors ${theme === 'dark' ? 'border-white/10 text-neutral-500 bg-neutral-950' : 'border-black/5 text-neutral-500 bg-neutral-100'
                }`}>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-lg font-bold tracking-tighter text-neutral-400">
                        QL<span className="text-[#D4AF37]">KTX</span>
                    </div>
                    <div>© 2026 QLKTX Premium Dormitory. All rights reserved.</div>
                    <div className="flex gap-6">
                        <a href="#" className={`transition-colors ${theme === 'dark' ? 'hover:text-white' : 'hover:text-neutral-900'}`}>Nội quy</a>
                        <a href="#" className={`transition-colors ${theme === 'dark' ? 'hover:text-white' : 'hover:text-neutral-900'}`}>Bảo mật</a>
                        <a href="#" className={`transition-colors ${theme === 'dark' ? 'hover:text-white' : 'hover:text-neutral-900'}`}>Hỗ trợ</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, desc, theme }: { icon: React.ReactNode, title: string, desc: string, theme: string }) {
    return (
        <div className={`p-10 border rounded-[2rem] transition-all duration-300 hover:-translate-y-2 ${theme === 'dark'
                ? 'bg-neutral-900/50 backdrop-blur-md border-neutral-800 hover:border-[#D4AF37]/50 hover:shadow-[0_8px_30px_rgba(212,175,55,0.1)]'
                : 'bg-white/80 backdrop-blur-md border-neutral-100 hover:border-[#D4AF37]/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)]'
            }`}>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${theme === 'dark' ? 'bg-neutral-800' : 'bg-neutral-50'
                }`}>
                {icon}
            </div>
            <h3 className="text-2xl font-bold mb-4">{title}</h3>
            <p className={`leading-relaxed text-lg ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>{desc}</p>
        </div>
    );
}

function Sparkles() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#D4AF37]">
            <path d="M10 1L12.596 8.40398L20 11L12.596 13.596L10 21L7.40398 13.596L0 11L7.40398 8.40398L10 1Z" fill="currentColor" />
            <path d="M20.5 16L21.538 18.962L24.5 20L21.538 21.038L20.5 24L19.462 21.038L16.5 20L19.462 18.962L20.5 16Z" fill="currentColor" />
            <path d="M19 3L19.7785 5.22153L22 6L19.7785 6.77847L19 9L18.2215 6.77847L16 6L18.2215 5.22153L19 3Z" fill="currentColor" />
        </svg>
    );
}
