import { useState } from 'react';
import { ArrowLeft, Home, MapPin, Maximize, Shield, Users, Wifi } from 'lucide-react';
import { Room, RoomType, Floor, Building } from '../../types';

// Mock Data
const mockBuildings: Building[] = [
    {
        buildingId: 1,
        buildingName: 'QLKTX - Cơ sở Quận 1',
        address: '123 Nguyễn Thị Minh Khai, Q1, TP.HCM',
        manager: { userId: 1, username: 'admin1', fullName: 'Nguyễn Văn A', email: 'a@qlktx.com', phoneNumber: '0901234567', role: null, isActive: true },
        totalFloors: 5
    },
    {
        buildingId: 2,
        buildingName: 'QLKTX - Cơ sở Quận 7',
        address: '456 Nguyễn Văn Linh, Q7, TP.HCM',
        manager: { userId: 2, username: 'admin2', fullName: 'Trần Thị B', email: 'b@qlktx.com', phoneNumber: '0909876543', role: null, isActive: true },
        totalFloors: 7
    }
];

const mockFloors: Floor[] = [
    { floorId: 1, floorName: 'Tầng 1', building: mockBuildings[0] },
    { floorId: 2, floorName: 'Tầng 2', building: mockBuildings[0] },
    { floorId: 3, floorName: 'Tầng 1', building: mockBuildings[1] },
];

const mockRoomTypes: RoomType[] = [
    { roomTypeId: 1, typeName: 'Phòng Tiêu Chuẩn', basePrice: 3500000, area: 20, maxOccupancy: 2, description: 'Phòng tiêu chuẩn đầy đủ nội thất cơ bản.' },
    { roomTypeId: 2, typeName: 'Phòng Studio', basePrice: 4500000, area: 25, maxOccupancy: 2, description: 'Phòng studio rộng rãi có bếp riêng.' },
    { roomTypeId: 3, typeName: 'Phòng VIP', basePrice: 6000000, area: 35, maxOccupancy: 4, description: 'Phòng VIP diện tích lớn, nội thất cao cấp.' },
];

const mockRooms: Room[] = Array.from({ length: 12 }).map((_, i) => ({
    roomId: i + 1,
    roomNumber: `${i < 6 ? '1' : '2'}0${(i % 6) + 1}`,
    floor: mockFloors[i % 3], // Giả lập tầng
    roomType: mockRoomTypes[i % 3], // Phân bổ loại phòng
    currentStatus: i % 4 === 0 ? 'AVAILABLE' : (i % 5 === 0 ? 'MAINTENANCE' : 'OCCUPIED'),
}));

export default function PublicRooms() {
    const [filterBuilding, setFilterBuilding] = useState<number | 'ALL'>('ALL');
    const [filterType, setFilterType] = useState<number | 'ALL'>('ALL');
    const [filterStatus, setFilterStatus] = useState<'ALL' | 'AVAILABLE'>('AVAILABLE');
    const [filterPrice, setFilterPrice] = useState<'ALL' | 'UNDER_4M' | '4M_TO_6M' | 'OVER_6M'>('ALL');

    // Lọc danh sách phòng
    const filteredRooms = mockRooms.filter(room => {
        if (filterBuilding !== 'ALL' && room.floor.building.buildingId !== filterBuilding) return false;
        if (filterType !== 'ALL' && room.roomType.roomTypeId !== filterType) return false;
        if (filterStatus !== 'ALL' && room.currentStatus !== filterStatus) return false;

        if (filterPrice !== 'ALL') {
            const price = room.roomType.basePrice;
            if (filterPrice === 'UNDER_4M' && price >= 4000000) return false;
            if (filterPrice === '4M_TO_6M' && (price < 4000000 || price > 6000000)) return false;
            if (filterPrice === 'OVER_6M' && price <= 6000000) return false;
        }

        return true;
    });

    return (
        <div className="min-h-screen bg-neutral-900 text-neutral-100 font-sans selection:bg-yellow-500/30 pb-20">
            {/* Minimal Header */}
            <nav className="fixed top-0 w-full z-50 bg-neutral-900/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                        <span className="font-medium">Về trang chủ</span>
                    </a>
                    <div className="text-xl font-bold tracking-tighter text-white">
                        QL<span className="text-[#D4AF37]">KTX</span>
                    </div>
                    <div className="w-[100px]"></div> {/* Cân bằng flex */}
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 pt-32">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Danh sách <span className="text-[#D4AF37]">Phòng trọ</span>
                    </h1>
                    <p className="text-neutral-400 max-w-2xl text-lg">
                        Khám phá các không gian sống tiện nghi, an ninh và hiện đại trong hệ thống của chúng tôi.
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-12 backdrop-blur-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Khu vực */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-400 mb-2">Cơ sở / Tòa nhà</label>
                            <select
                                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all appearance-none"
                                value={filterBuilding}
                                onChange={(e) => setFilterBuilding(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
                            >
                                <option value="ALL">Tất cả cơ sở</option>
                                {mockBuildings.map(b => (
                                    <option key={b.buildingId} value={b.buildingId}>{b.buildingName}</option>
                                ))}
                            </select>
                        </div>

                        {/* Loại phòng */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-400 mb-2">Loại phòng</label>
                            <select
                                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all appearance-none"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
                            >
                                <option value="ALL">Tất cả loại phòng</option>
                                {mockRoomTypes.map(t => (
                                    <option key={t.roomTypeId} value={t.roomTypeId}>{t.typeName}</option>
                                ))}
                            </select>
                        </div>

                        {/* Mức giá */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-400 mb-2">Mức giá</label>
                            <select
                                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all appearance-none"
                                value={filterPrice}
                                onChange={(e) => setFilterPrice(e.target.value as any)}
                            >
                                <option value="ALL">Tất cả mức giá</option>
                                <option value="UNDER_4M">Dưới 4 triệu</option>
                                <option value="4M_TO_6M">Từ 4 - 6 triệu</option>
                                <option value="OVER_6M">Trên 6 triệu</option>
                            </select>
                        </div>

                        {/* Trạng thái */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-400 mb-2">Trạng thái</label>
                            <select
                                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all appearance-none"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as any)}
                            >
                                <option value="ALL">Hiển thị tất cả</option>
                                <option value="AVAILABLE">Chỉ phòng đang trống</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Rooms Grid */}
                {filteredRooms.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredRooms.map(room => (
                            <RoomCard key={room.roomId} room={room} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
                        <div className="text-neutral-500 mb-4">
                            <Home size={48} className="mx-auto opacity-50" />
                        </div>
                        <h3 className="text-xl font-medium text-white mb-2">Không tìm thấy phòng phù hợp</h3>
                        <p className="text-neutral-400">Vui lòng thử thay đổi các tiêu chí tìm kiếm của bạn.</p>
                        <button
                            onClick={() => {
                                setFilterBuilding('ALL');
                                setFilterType('ALL');
                                setFilterStatus('ALL');
                                setFilterPrice('ALL');
                            }}
                            className="mt-6 text-[#D4AF37] hover:text-yellow-400 font-medium"
                        >
                            Xóa bộ lọc
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function RoomCard({ room }: { room: Room }) {
    const isAvailable = room.currentStatus === 'AVAILABLE';
    const isMaintenance = room.currentStatus === 'MAINTENANCE';

    return (
        <div className="group bg-neutral-800/50 border border-neutral-700/50 rounded-2xl overflow-hidden hover:border-[#D4AF37]/50 transition-all hover:shadow-[0_8px_30px_rgba(212,175,55,0.15)] flex flex-col">
            {/* Image Placeholder */}
            <div className="h-48 bg-neutral-800 relative overflow-hidden">
                {/* Randomly generated abstract pattern for placeholder */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-500 via-neutral-800 to-neutral-900 group-hover:scale-110 transition-transform duration-700"></div>

                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-10">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-md ${isAvailable
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : isMaintenance
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                        }`}>
                        {isAvailable ? 'Đang trống' : isMaintenance ? 'Bảo trì' : 'Đã thuê'}
                    </span>
                </div>

                <div className="absolute bottom-4 left-4 z-10">
                    <div className="bg-neutral-900/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 text-white font-bold tracking-wider">
                        Phòng {room.roomNumber}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-[#D4AF37] mb-1">{room.roomType.typeName}</h3>
                        <p className="text-sm text-neutral-400 flex items-center gap-1.5">
                            <MapPin size={14} />
                            {room.floor.building.buildingName} - {room.floor.floorName}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm text-neutral-300 mb-6 flex-1">
                    <div className="flex items-center gap-2">
                        <Maximize className="text-neutral-500" size={16} />
                        <span>{room.roomType.area} m²</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="text-neutral-500" size={16} />
                        <span>Tối đa {room.roomType.maxOccupancy} người</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Shield className="text-neutral-500" size={16} />
                        <span>An ninh 24/7</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Wifi className="text-neutral-500" size={16} />
                        <span>Wifi Miễn phí</span>
                    </div>
                </div>

                <div className="pt-4 border-t border-neutral-700/50 flex items-end justify-between mt-auto">
                    <div>
                        <p className="text-xs text-neutral-400 mb-1">Giá thuê từ</p>
                        <div className="text-2xl font-bold text-white">
                            {new Intl.NumberFormat('vi-VN').format(room.roomType.basePrice)}
                            <span className="text-sm font-normal text-neutral-400 ml-1">đ/tháng</span>
                        </div>
                    </div>

                    <button className={`px-5 py-2.5 rounded-xl font-medium transition-all ${isAvailable
                        ? 'bg-[#D4AF37] hover:bg-yellow-500 text-neutral-900 shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_20px_rgba(212,175,55,0.5)]'
                        : 'bg-neutral-800 text-neutral-400 cursor-not-allowed border border-neutral-700'
                        }`} disabled={!isAvailable}>
                        {isAvailable ? 'Liên hệ xem phòng' : 'Hết phòng'}
                    </button>
                </div>
            </div>
        </div>
    );
}
