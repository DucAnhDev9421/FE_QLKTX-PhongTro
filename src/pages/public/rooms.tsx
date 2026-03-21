import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Home, MapPin, Shield, Users, Wifi, Sun, Moon, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import demoImg from '../../assets/demo.jpg';
import { useTheme } from '../../contexts/ThemeContext';
import { buildingService } from '../../services/building';
import { roomService } from '../../services/room';

export default function PublicRooms() {
    const { theme, toggleTheme } = useTheme();
    
    // Filter State
    const [filterBuilding, setFilterBuilding] = useState<string | 'ALL'>('ALL');
    const [filterType, setFilterType] = useState<number | 'ALL'>('ALL');
    const [filterStatus, setFilterStatus] = useState<'ALL' | 'AVAILABLE'>('AVAILABLE');
    const [filterPrice, setFilterPrice] = useState<'ALL' | 'UNDER_4M' | '4M_TO_6M' | 'OVER_6M'>('ALL');

    // Fetch Buildings
    const { data: buildingsData, isLoading: isLoadingBuildings } = useQuery({
        queryKey: ['buildings'],
        queryFn: () => buildingService.getBuildings()
    });
    // Sort buildings alphabetically
    const buildings = useMemo(() => {
        const raw = buildingsData?.result || [];
        return [...raw].sort((a: any, b: any) => a.buildingName.localeCompare(b.buildingName));
    }, [buildingsData]);

    // Fetch Room Types
    const { data: roomTypesData, isLoading: isLoadingTypes } = useQuery({
        queryKey: ['roomTypes'],
        queryFn: () => roomService.getRoomTypes()
    });
    // Sort types by name
    const roomTypes = useMemo(() => {
        const raw = roomTypesData?.result || [];
        return [...raw].sort((a: any, b: any) => a.typeName.localeCompare(b.typeName));
    }, [roomTypesData]);

    // Fetch Rooms
    const { data: roomsData, isLoading: isLoadingRooms } = useQuery({
        queryKey: ['publicRooms'],
        queryFn: () => roomService.getRooms()
    });
    const rooms = roomsData?.result || [];

    const isLoading = isLoadingBuildings || isLoadingTypes || isLoadingRooms;

    // Lọc danh sách phòng
    const filteredRooms = useMemo(() => {
        return rooms.filter((room: any) => {
            const buildingName = room.buildingName;
            const roomTypeId = room.roomTypeId;
            const currentStatus = room.currentStatus;
            const price = room.price;

            if (filterBuilding !== 'ALL' && buildingName !== filterBuilding) return false;
            if (filterType !== 'ALL' && roomTypeId !== filterType) return false;
            if (filterStatus !== 'ALL' && currentStatus !== filterStatus) return false;

            if (filterPrice !== 'ALL') {
                if (filterPrice === 'UNDER_4M' && price >= 4000000) return false;
                if (filterPrice === '4M_TO_6M' && (price < 4000000 || price > 6000000)) return false;
                if (filterPrice === 'OVER_6M' && price <= 6000000) return false;
            }

            return true;
        });
    }, [rooms, filterBuilding, filterType, filterStatus, filterPrice]);

    return (
        <div className={`min-h-screen font-sans selection:bg-yellow-500/30 pb-20 transition-colors duration-300 ${theme === 'dark' ? 'bg-neutral-900 text-neutral-100' : 'bg-neutral-50 text-neutral-900'
            }`}>
            {/* Minimal Header */}
            <nav className={`fixed top-0 w-full z-50 backdrop-blur-md border-b transition-colors duration-300 ${theme === 'dark' ? 'bg-neutral-900/80 border-white/10' : 'bg-white/80 border-black/10'
                }`}>
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <a href="/" className={`flex items-center gap-2 transition-colors ${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
                        }`}>
                        <ArrowLeft size={20} />
                        <span className="font-medium">Về trang chủ</span>
                    </a>
                    <div className="text-xl font-bold tracking-tighter">
                        QL<span className="text-[#D4AF37]">KTX</span>
                    </div>
                    <div className="w-[100px] flex justify-end">
                        {/* Theme Toggle Button */}
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

            <div className="max-w-7xl mx-auto px-6 pt-32">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Danh sách <span className="text-[#D4AF37]">Phòng trọ</span>
                    </h1>
                    <p className={`max-w-2xl text-lg transition-colors ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                        }`}>
                        Khám phá các không gian sống tiện nghi, an ninh và hiện đại trong hệ thống của chúng tôi.
                    </p>
                </div>

                {/* Filters */}
                <div className={`border rounded-2xl p-6 mb-12 backdrop-blur-sm transition-colors ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/80 border-neutral-200 shadow-sm'
                    }`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Khu vực */}
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>Cơ sở / Tòa nhà</label>
                            <select
                                className={`w-full rounded-lg px-4 py-3 focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all appearance-none ${theme === 'dark' ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-neutral-900'
                                    }`}
                                value={filterBuilding}
                                onChange={(e) => setFilterBuilding(e.target.value)}
                            >
                                <option value="ALL">Tất cả cơ sở</option>
                                {buildings.map((b: any) => (
                                    <option key={b.buildingId} value={b.buildingName}>{b.buildingName}</option>
                                ))}
                            </select>
                        </div>

                        {/* Loại phòng */}
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>Loại phòng</label>
                            <select
                                className={`w-full rounded-lg px-4 py-3 focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all appearance-none ${theme === 'dark' ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-neutral-900'
                                    }`}
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
                            >
                                <option value="ALL">Tất cả loại phòng</option>
                                {roomTypes.map((t: any) => (
                                    <option key={t.roomTypeId} value={t.roomTypeId}>{t.typeName}</option>
                                ))}
                            </select>
                        </div>

                        {/* Mức giá */}
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>Mức giá</label>
                            <select
                                className={`w-full rounded-lg px-4 py-3 focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all appearance-none ${theme === 'dark' ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-neutral-900'
                                    }`}
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
                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>Trạng thái</label>
                            <select
                                className={`w-full rounded-lg px-4 py-3 focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all appearance-none ${theme === 'dark' ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-neutral-900'
                                    }`}
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
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 size={48} className={`animate-spin ${theme === 'dark' ? 'text-[#D4AF37]' : 'text-yellow-600'}`} />
                    </div>
                ) : filteredRooms.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredRooms.map((room: any) => (
                            <RoomCard key={room.roomId} room={room} theme={theme} />
                        ))}
                    </div>
                ) : (
                    <div className={`text-center py-20 border rounded-2xl ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-neutral-200'
                        }`}>
                        <div className={`mb-4 ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}`}>
                            <Home size={48} className="mx-auto opacity-50" />
                        </div>
                        <h3 className={`text-xl font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>Không tìm thấy phòng phù hợp</h3>
                        <p className={theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}>Vui lòng thử thay đổi các tiêu chí tìm kiếm của bạn.</p>
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

function RoomCard({ room, theme }: { room: any, theme: string }) {
    const isAvailable = room.currentStatus === 'AVAILABLE';
    const isMaintenance = room.currentStatus === 'MAINTENANCE';

    // Get the first image or fallback to demo
    const imageSrc = room.imageUrls && room.imageUrls.length > 0 ? room.imageUrls[0] : demoImg;

    return (
        <div className="group bg-neutral-800/50 border border-neutral-700/50 rounded-2xl overflow-hidden hover:border-[#D4AF37]/50 transition-all hover:shadow-[0_8px_30px_rgba(212,175,55,0.15)] flex flex-col">
            {/* Image Placeholder */}
            <div className="h-48 bg-neutral-800 relative overflow-hidden">
                <img
                    src={imageSrc}
                    alt={`Phòng ${room.roomNumber}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 to-transparent"></div>

                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-10">
                    <span className={`px-3 py-1.5 text-[11px] font-bold rounded-lg shadow-lg uppercase tracking-wider backdrop-blur-sm ${isAvailable
                        ? 'bg-emerald-600/90 text-white border-emerald-400/30'
                        : isMaintenance
                            ? 'bg-amber-500/90 text-white border-amber-400/30'
                            : 'bg-rose-600/90 text-white border-rose-400/30'
                        }`}>
                        {isAvailable ? 'Đang trống' : isMaintenance ? 'Bảo trì' : 'Đã thuê'}
                    </span>
                </div>

                <div className="absolute bottom-4 left-4 z-10">
                    <div className="bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20 text-white font-bold tracking-wider">
                        Phòng {room.roomNumber}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-[#D4AF37] mb-1">{room.roomTypeName || 'Phòng Thường'}</h3>
                        <p className={`text-sm flex items-center gap-1.5 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
                            <MapPin size={14} />
                            {room.buildingName} - {room.floorName}
                        </p>
                    </div>
                </div>

                <div className={`grid grid-cols-2 gap-y-4 gap-x-2 text-sm mb-6 flex-1 ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-600'}`}>
                    <div className="flex items-center gap-2">
                        <Users className={theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'} size={16} />
                        <span>Ký túc xá / Trọ</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Shield className={theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'} size={16} />
                        <span>An ninh 24/7</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Wifi className={theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'} size={16} />
                        <span>Wifi Miễn phí</span>
                    </div>
                </div>

                <div className={`pt-4 border-t flex items-end justify-between mt-auto ${theme === 'dark' ? 'border-neutral-700/50' : 'border-neutral-200'}`}>
                    <div>
                        <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>Giá thuê từ</p>
                        <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
                            {new Intl.NumberFormat('vi-VN').format(room.price)}
                            <span className={`text-sm font-normal ml-1 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>đ/tháng</span>
                        </div>
                    </div>

                    {isAvailable ? (
                        <Link to={`/phong-tro/${room.roomId}`} className="px-5 py-2.5 rounded-xl font-medium transition-all bg-[#D4AF37] hover:bg-yellow-500 text-neutral-900 shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] block text-center min-w-[150px]">
                            Xem chi tiết
                        </Link>
                    ) : (
                        <button className={`px-5 py-2.5 rounded-xl font-medium transition-all cursor-not-allowed border min-w-[150px] ${theme === 'dark' ? 'bg-neutral-800 text-neutral-400 border-neutral-700' : 'bg-neutral-100 text-neutral-400 border-neutral-200'
                            }`} disabled>
                            Hết phòng
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
