import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Check, Compass, Home, MapPin, Shield, Wifi, Sun, Moon, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import demoImg from '../../assets/demo.jpg';
import { useTheme } from '../../contexts/ThemeContext';
import { roomService } from '../../services/room';

export default function RoomDetail() {
    const { id } = useParams();
    const { theme, toggleTheme } = useTheme();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const { data: roomData, isLoading } = useQuery({
        queryKey: ['roomDetail', id],
        queryFn: () => roomService.getRoomDetail(Number(id)),
        enabled: !!id
    });

    const room = roomData?.result;

    if (isLoading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-neutral-900' : 'bg-neutral-50'}`}>
                <Loader2 size={48} className="animate-spin text-[#D4AF37]" />
            </div>
        );
    }

    if (!room) {
        return (
            <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${theme === 'dark' ? 'bg-neutral-900 text-neutral-100' : 'bg-neutral-50 text-neutral-900'
                }`}>
                <h1 className="text-3xl font-bold mb-4">Không tìm thấy phòng</h1>
                <Link to="/phong-tro" className="text-[#D4AF37] hover:underline flex items-center gap-2">
                    <ArrowLeft size={20} /> Quay lại danh sách phòng
                </Link>
            </div>
        );
    }

    const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN').format(price);
    const isAvailable = room.currentStatus === 'AVAILABLE';
    const isMaintenance = room.currentStatus === 'MAINTENANCE';

    const images = room.imageUrls && room.imageUrls.length > 0 ? room.imageUrls : [demoImg];

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    return (
        <div className={`min-h-screen font-sans selection:bg-yellow-500/30 pb-20 transition-colors duration-300 ${theme === 'dark' ? 'bg-neutral-900 text-neutral-100' : 'bg-neutral-50 text-neutral-900'
            }`}>
            {/* Header Navbar */}
            <nav className={`fixed top-0 w-full z-50 backdrop-blur-md border-b transition-colors duration-300 ${theme === 'dark' ? 'bg-neutral-900/80 border-white/10' : 'bg-white/80 border-black/10'
                }`}>
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/phong-tro" className={`flex items-center gap-2 transition-colors ${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
                        }`}>
                        <ArrowLeft size={20} />
                        <span className="font-medium hidden sm:inline">Quay lại danh sách</span>
                    </Link>
                    <div className="text-xl font-bold tracking-tighter">
                        QL<span className="text-[#D4AF37]">KTX</span>
                    </div>
                    <div className="w-[100px] sm:w-[150px] flex justify-end">
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-neutral-800 text-yellow-400' : 'hover:bg-neutral-200 text-slate-700'
                                }`}
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Carousel Header Area */}
            <div className="max-w-7xl mx-auto px-6 pt-24 md:pt-28 pb-6">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className={`px-4 py-1.5 text-sm font-semibold rounded-full border backdrop-blur-md ${isAvailable
                        ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30'
                        : isMaintenance
                            ? 'bg-amber-500/20 text-amber-500 border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-500 border-rose-500/30'
                        }`}>
                        {isAvailable ? 'Đang trống' : isMaintenance ? 'Đang bảo trì' : 'Đã cho thuê'}
                    </span>
                    <span className={`border px-4 py-1.5 rounded-full text-sm font-medium ${theme === 'dark' ? 'bg-neutral-800 border-neutral-700 text-neutral-300' : 'bg-white border-neutral-300 text-neutral-600'}`}>
                        {room.roomTypeName || 'Phòng Thường'}
                    </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center gap-4">
                    Phòng {room.roomNumber}
                </h1>
                <p className={`text-lg md:text-xl flex items-center gap-2 mb-8 ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-600'}`}>
                    <MapPin className="text-[#D4AF37]" size={24} />
                    {room.buildingName} - {room.floorName}
                </p>

                {/* Main Slider Carousel */}
                <div className="relative group rounded-3xl overflow-hidden shadow-2xl bg-black aspect-[16/9] md:aspect-[21/9]">
                    <img
                        src={images[currentImageIndex]}
                        alt={`Phòng ${room.roomNumber} - Ảnh ${currentImageIndex + 1}`}
                        className="w-full h-full object-contain md:object-cover transition-opacity duration-500"
                    />

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                            >
                                <ChevronLeft size={28} />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                            >
                                <ChevronRight size={28} />
                            </button>
                        </>
                    )}
                    
                    {/* Counter Badge */}
                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-sm font-medium border border-white/20">
                        {currentImageIndex + 1} / {images.length}
                    </div>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                    <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                        {images.map((img: string, idx: number) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentImageIndex(idx)}
                                className={`flex-shrink-0 w-24 h-24 md:w-32 md:h-24 rounded-xl overflow-hidden border-2 transition-all ${
                                    currentImageIndex === idx ? 'border-[#D4AF37] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                                }`}
                            >
                                <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Content Container */}
            <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Left Column: Details & Description */}
                <div className="lg:col-span-2 space-y-12">

                    {/* Key Attributes Overview */}
                    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border rounded-2xl backdrop-blur-sm transition-colors ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/80 border-neutral-200 shadow-sm'
                        }`}>
                        <div className="flex flex-col gap-1">
                            <span className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>Loại phòng</span>
                            <span className="text-xl font-semibold flex items-center gap-2"><Home size={18} className="text-[#D4AF37]" /> Ký túc xá</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>Tầng</span>
                            <span className="text-xl font-semibold flex items-center gap-2"><Compass size={18} className="text-[#D4AF37]" /> {room.floorName}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>An ninh</span>
                            <span className="text-xl font-semibold flex items-center gap-2"><Shield size={18} className="text-[#D4AF37]" /> 24/7</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>Tình trạng</span>
                            <span className={`text-xl font-semibold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-500'}`}>Mới 100%</span>
                        </div>
                    </div>

                    {/* Description */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <Home className="text-[#D4AF37]" /> Thông tin mô tả
                        </h2>
                        <div className={`leading-relaxed space-y-4 ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-600'}`}>
                            <p>Phòng trọ thuộc {room.buildingName}, loại {room.roomTypeName}.</p>
                            <p>Được thiết kế hiện đại, tối ưu không gian ánh sáng tự nhiên. Trang bị hệ thống chiếu sáng thông minh và hạ tầng mạng tốt nhất.</p>
                            <p>Không gian sống an ninh, yên tĩnh, phù hợp cho sinh viên và người đi làm. Khu vực tiện ích cung cấp đầy đủ các dịch vụ cơ bản.</p>
                        </div>
                    </section>

                    {/* Amenities list */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <Check className="text-[#D4AF37]" /> Tiện ích đi kèm
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className={`p-4 rounded-xl border flex items-center gap-4 transition-colors ${theme === 'dark' ? 'bg-neutral-800/50 border-neutral-700' : 'bg-white border-neutral-200 shadow-sm'
                                }`}>
                                <div className={`p-3 rounded-lg text-[#D4AF37] ${theme === 'dark' ? 'bg-neutral-900' : 'bg-neutral-50'}`}><Wifi size={24} /></div>
                                <div>
                                    <div className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>Wifi Tốc Độ Cao</div>
                                    <div className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>Hạ tầng viễn thông riêng biệt</div>
                                </div>
                            </div>
                            <div className={`p-4 rounded-xl border flex items-center gap-4 transition-colors ${theme === 'dark' ? 'bg-neutral-800/50 border-neutral-700' : 'bg-white border-neutral-200 shadow-sm'
                                }`}>
                                <div className={`p-3 rounded-lg text-[#D4AF37] ${theme === 'dark' ? 'bg-neutral-900' : 'bg-neutral-50'}`}><Shield size={24} /></div>
                                <div>
                                    <div className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>An Ninh Đảm Bảo</div>
                                    <div className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>Hệ thống camera an ninh 24/7</div>
                                </div>
                            </div>
                            <div className={`p-4 rounded-xl border flex items-center gap-4 transition-colors ${theme === 'dark' ? 'bg-neutral-800/50 border-neutral-700' : 'bg-white border-neutral-200 shadow-sm'
                                }`}>
                                <div className={`p-3 rounded-lg text-[#D4AF37] ${theme === 'dark' ? 'bg-neutral-900' : 'bg-neutral-50'}`}><Home size={24} /></div>
                                <div>
                                    <div className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>Tiêu chuẩn sạch sẽ</div>
                                    <div className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>Được dọn dẹp vệ sinh khu vực chung</div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Pricing & CTA */}
                <div>
                    <div className={`sticky top-32 border rounded-3xl p-8 transition-colors ${theme === 'dark' ? 'bg-neutral-800/50 border-neutral-700 shadow-[0_8px_30px_rgba(0,0,0,0.5)]' : 'bg-white border-neutral-200 shadow-lg'
                        }`}>
                        <div className="mb-6">
                            <div className={`text-sm mb-2 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>Giá thuê niêm yết</div>
                            <div className={`text-4xl font-bold flex items-end gap-2 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
                                {formatPrice(room.price)}
                                <span className={`text-lg font-normal mb-1 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>đ/tháng</span>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm">
                                <span className={theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}>Cọc đảm bảo</span>
                                <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>1 tháng tiền phòng</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className={theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}>Điện sinh hoạt</span>
                                <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>3.800đ / kWh</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className={theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}>Nước sinh hoạt</span>
                                <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>100.000đ / người</span>
                            </div>
                        </div>

                        <button
                            disabled={!isAvailable}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all mb-4 ${isAvailable
                                ? 'bg-[#D4AF37] hover:bg-yellow-500 text-neutral-900 shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)]'
                                : theme === 'dark' ? 'bg-neutral-700 text-neutral-500 cursor-not-allowed' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                                }`}
                        >
                            {isAvailable ? 'ĐĂNG KÝ XEM PHÒNG' : 'PHÒNG ĐÃ CÓ NGƯỜI THUÊ'}
                        </button>

                        {/* Note about contact info based on API data */}
                        <div className="text-center mt-4 pt-4 border-t border-neutral-700/50">
                            <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
                                Liên hệ admin/quản lý để làm thủ tục.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
