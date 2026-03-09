import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, Compass, Home, MapPin, Maximize, Shield, Users, Wifi } from 'lucide-react';
import { mockRooms } from '../../mock/data';

export default function RoomDetail() {
    const { id } = useParams();
    const room = mockRooms.find(r => r.roomId === Number(id));

    if (!room) {
        return (
            <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold mb-4">Không tìm thấy phòng</h1>
                <Link to="/phong-tro" className="text-[#D4AF37] hover:underline flex items-center gap-2">
                    <ArrowLeft size={20} /> Quay lại danh sách phòng
                </Link>
            </div>
        );
    }

    const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN').format(price);
    const isAvailable = room.currentStatus === 'AVAILABLE';

    return (
        <div className="min-h-screen bg-neutral-900 text-neutral-100 font-sans selection:bg-yellow-500/30 pb-20">
            {/* Header Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-neutral-900/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/phong-tro" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                        <span className="font-medium hidden sm:inline">Quay lại danh sách</span>
                    </Link>
                    <div className="text-xl font-bold tracking-tighter text-white">
                        QL<span className="text-[#D4AF37]">KTX</span>
                    </div>
                    <div className="w-[100px] sm:w-[150px]"></div> {/* Spacer */}
                </div>
            </nav>

            {/* Hero Image / Map Header */}
            <div className="w-full h-[400px] md:h-[500px] mt-20 relative bg-neutral-800 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent z-10" />
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-600 via-neutral-800 to-neutral-900" />

                <div className="absolute bottom-0 left-0 w-full z-20 p-6 md:p-12">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className={`px-4 py-1.5 text-sm font-semibold rounded-full border backdrop-blur-md ${isAvailable
                                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                    : room.currentStatus === 'MAINTENANCE'
                                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                        : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                                }`}>
                                {isAvailable ? 'Đang trống' : room.currentStatus === 'MAINTENANCE' ? 'Đang bảo trì' : 'Đã cho thuê'}
                            </span>
                            <span className="bg-white/10 border border-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-sm text-neutral-300">
                                {room.roomType.typeName}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">
                            Phòng {room.roomNumber}
                        </h1>
                        <p className="text-xl md:text-2xl text-neutral-300 flex items-center gap-2">
                            <MapPin className="text-[#D4AF37]" />
                            {room.floor.building.buildingName} - {room.floor.floorName}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Left Column: Details & Description */}
                <div className="lg:col-span-2 space-y-12">

                    {/* Key Attributes Overview */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                        <div className="flex flex-col gap-1">
                            <span className="text-neutral-400 text-sm">Diện tích</span>
                            <span className="text-xl font-semibold flex items-center gap-2"><Maximize size={18} className="text-[#D4AF37]" /> {room.roomType.area} m²</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-neutral-400 text-sm">Sức chứa</span>
                            <span className="text-xl font-semibold flex items-center gap-2"><Users size={18} className="text-[#D4AF37]" /> {room.roomType.maxOccupancy} ng</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-neutral-400 text-sm">Hướng</span>
                            <span className="text-xl font-semibold flex items-center gap-2"><Compass size={18} className="text-[#D4AF37]" /> Đông Nam</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-neutral-400 text-sm">Tình trạng</span>
                            <span className="text-xl font-semibold text-emerald-400">Mới 100%</span>
                        </div>
                    </div>

                    {/* Description */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <Home className="text-[#D4AF37]" /> Thông tin mô tả
                        </h2>
                        <div className="text-neutral-300 leading-relaxed space-y-4">
                            <p>{room.roomType.description}</p>
                            <p>Phòng trọ được thiết kế hiện đại, tối ưu không gian ánh sáng tự nhiên. Trang bị sẵn giường nệm cao cấp, tủ quần áo cá nhân, bàn làm việc và hệ thống chiếu sáng thông minh.</p>
                            <p>Không gian sống an ninh, yên tĩnh, phù hợp cho sinh viên và người đi làm. Khu vực bếp và sinh hoạt chung rộng rãi, được dọn dẹp thường xuyên.</p>
                        </div>
                    </section>

                    {/* Amenities list */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <Check className="text-[#D4AF37]" /> Tiện ích đi kèm
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-700 flex items-center gap-4">
                                <div className="p-3 bg-neutral-900 rounded-lg text-[#D4AF37]"><Wifi size={24} /></div>
                                <div>
                                    <div className="font-semibold text-white">Wifi Tốc Độ Cao</div>
                                    <div className="text-sm text-neutral-400">Cáp quang 1Gbps, router riêng mỗi tầng</div>
                                </div>
                            </div>
                            <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-700 flex items-center gap-4">
                                <div className="p-3 bg-neutral-900 rounded-lg text-[#D4AF37]"><Shield size={24} /></div>
                                <div>
                                    <div className="font-semibold text-white">An Ninh 24/7</div>
                                    <div className="text-sm text-neutral-400">Camera giám sát, khóa vân tay 2 lớp</div>
                                </div>
                            </div>
                            <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-700 flex items-center gap-4">
                                <div className="p-3 bg-neutral-900 rounded-lg text-[#D4AF37]"><Home size={24} /></div>
                                <div>
                                    <div className="font-semibold text-white">Nội Thất Tiêu Chuẩn</div>
                                    <div className="text-sm text-neutral-400">Giường nệm cao cấp, tủ đồ cá nhân khóa riêng</div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Pricing & CTA */}
                <div>
                    <div className="sticky top-32 bg-neutral-800/50 border border-neutral-700 rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                        <div className="mb-6">
                            <div className="text-sm text-neutral-400 mb-2">Giá thuê niêm yết</div>
                            <div className="text-4xl font-bold text-white flex items-end gap-2">
                                {formatPrice(room.roomType.basePrice)}
                                <span className="text-lg font-normal text-neutral-400 mb-1">đ/tháng</span>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-400">Cọc đảm bảo</span>
                                <span className="text-white font-medium">1 tháng tiền phòng</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-400">Điện sinh hoạt</span>
                                <span className="text-white font-medium">3.800đ / kWh</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-400">Nước sinh hoạt</span>
                                <span className="text-white font-medium">100.000đ / người</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-400">Dịch vụ (Mạng, Rác...)</span>
                                <span className="text-white font-medium">150.000đ / phòng</span>
                            </div>
                        </div>

                        <button
                            disabled={!isAvailable}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all mb-4 ${isAvailable
                                    ? 'bg-[#D4AF37] hover:bg-yellow-500 text-neutral-900 shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)]'
                                    : 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
                                }`}
                        >
                            {isAvailable ? 'ĐĂNG KÝ XEM PHÒNG' : 'PHÒNG ĐÃ CÓ NGƯỜI THUÊ'}
                        </button>

                        <div className="text-center">
                            <p className="text-sm text-neutral-400 mb-2">Hoặc liên hệ quản lý cơ sở</p>
                            <p className="text-xl font-semibold text-[#D4AF37]">{room.floor.building.manager.phoneNumber}</p>
                            <p className="text-sm text-neutral-400 mt-1">{room.floor.building.manager.fullName}</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
