import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Layout } from '../../components/layout';
import { Search, Plus, Home, Users, CheckCircle2, Clock, Loader2, Edit, ImagePlus, Camera } from 'lucide-react';
import { roomService } from '../../services/room';
import { buildingService } from '../../services/building';
import RoomModal from './components/RoomModal';
import ImageUploadModal from './components/ImageUploadModal';

export default function Rooms() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterBuildingId, setFilterBuildingId] = useState<number | ''>('');
    const [filterFloorId, setFilterFloorId] = useState<number | ''>('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
    const [imageModalRoom, setImageModalRoom] = useState<any | null>(null);

    const queryClient = useQueryClient();

    // Fetch Buildings for filtering
    const { data: buildingsData } = useQuery({
        queryKey: ['buildings'],
        queryFn: () => buildingService.getBuildings()
    });
    const buildings = buildingsData?.result || [];

    // Fetch Floors for filtering (based on selected building)
    const { data: floorsData } = useQuery({
        queryKey: ['floors', filterBuildingId],
        queryFn: () => buildingService.getFloorsByBuilding(filterBuildingId as number),
        enabled: !!filterBuildingId
    });
    const rawFloors = floorsData?.result || [];

    // Sort floors numerically
    const floors = [...rawFloors].sort((a: any, b: any) => {
        const numA = parseInt(a.floorName.replace(/\D/g, '')) || 0;
        const numB = parseInt(b.floorName.replace(/\D/g, '')) || 0;
        return numA - numB;
    });

    // Fetch Rooms
    const { data: roomsData, isLoading } = useQuery({
        queryKey: ['rooms', filterFloorId, filterStatus],
        queryFn: () => roomService.getRooms({ 
            floorId: filterFloorId ? Number(filterFloorId) : undefined,
            status: filterStatus || undefined
        })
    });
    
    const rooms = roomsData?.result || [];

    const handleCreate = () => {
        setSelectedRoom(null);
        setIsModalOpen(true);
    };

    const handleEdit = (room: any) => {
        setSelectedRoom(room);
        setIsModalOpen(true);
    };

    // Fast-Patch Mutation for changing status directly from Card
    const statusMutation = useMutation({
        mutationFn: ({ id, status }: { id: number, status: string }) => roomService.updateRoomStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
        }
    });

    // Frontend Text Filter
    const filteredRooms = rooms.filter((room: any) => 
        (room.roomNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (room.buildingName || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout>
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100 mb-1">Quản lý phòng trọ</h1>
                    <p className="text-slate-400 text-sm">Xem và quản lý thông tin trạng thái các phòng trong hệ thống.</p>
                </div>
                <button 
                    onClick={handleCreate}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                    <Plus size={18} /> Thêm phòng mới
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-1/3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo mã phòng, cơ sở..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-500"
                    />
                </div>

                <div className="flex gap-3 w-full sm:w-2/3 overflow-x-auto pb-2 sm:pb-0 items-center">
                    <select 
                        className="bg-slate-800 border border-slate-700 text-sm text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 min-w-[140px]"
                        value={filterBuildingId}
                        onChange={(e) => {
                            setFilterBuildingId(e.target.value ? Number(e.target.value) : '');
                            setFilterFloorId('');
                        }}
                    >
                        <option value="">Tất cả Cơ sở</option>
                        {buildings.map((b: any) => (
                            <option key={b.buildingId} value={b.buildingId}>{b.buildingName}</option>
                        ))}
                    </select>

                    <select 
                        className="bg-slate-800 border border-slate-700 text-sm text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 min-w-[120px]"
                        value={filterFloorId}
                        onChange={(e) => setFilterFloorId(e.target.value ? Number(e.target.value) : '')}
                        disabled={!filterBuildingId}
                    >
                        <option value="">Tất cả Tầng</option>
                        {floors.map((f: any) => (
                            <option key={f.floorId} value={f.floorId}>{f.floorName}</option>
                        ))}
                    </select>

                    <div className="h-6 w-px bg-slate-700 mx-1"></div>

                    <FilterButton active={filterStatus === ''} onClick={() => setFilterStatus('')}>Tất cả</FilterButton>
                    <FilterButton active={filterStatus === 'AVAILABLE'} onClick={() => setFilterStatus('AVAILABLE')}>Trống</FilterButton>
                    <FilterButton active={filterStatus === 'OCCUPIED'} onClick={() => setFilterStatus('OCCUPIED')}>Đang thuê</FilterButton>
                    <FilterButton active={filterStatus === 'MAINTENANCE'} onClick={() => setFilterStatus('MAINTENANCE')}>Bảo trì</FilterButton>
                    <FilterButton active={filterStatus === 'BOOKED'} onClick={() => setFilterStatus('BOOKED')}>Đã cọc</FilterButton>
                </div>
            </div>

            {/* Room Grid */}
            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 size={32} className="animate-spin text-emerald-500" />
                </div>
            ) : filteredRooms.length === 0 ? (
                <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-xl">
                    <Home size={48} className="mx-auto text-slate-600 mb-4" />
                    <h3 className="text-lg font-medium text-slate-300 mb-1">Không tìm thấy phòng nào</h3>
                    <p className="text-slate-500">Thử thay đổi bộ lọc hoặc thêm phòng mới.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredRooms.map((room: any) => (
                        <RoomCard 
                            key={room.roomId} 
                            room={room} 
                            onEdit={() => handleEdit(room)}
                            onChangeStatus={(status) => statusMutation.mutate({ id: room.roomId, status })}
                            onOpenImages={() => setImageModalRoom(room)}
                        />
                    ))}
                </div>
            )}

            {isModalOpen && (
                <RoomModal 
                    room={selectedRoom}
                    onClose={() => setIsModalOpen(false)}
                />
            )}

            {imageModalRoom && (
                <ImageUploadModal
                    room={imageModalRoom}
                    onClose={() => setImageModalRoom(null)}
                />
            )}
        </Layout>
    );
}

function FilterButton({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            className={`px-3 py-2 rounded-lg text-[13px] font-medium transition-colors whitespace-nowrap ${active
                    ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border border-transparent hover:text-slate-200 hover:bg-slate-700'
                }`}
        >
            {children}
        </button>
    );
}

function RoomCard({ room, onEdit, onChangeStatus, onOpenImages }: { room: any, onEdit: () => void, onChangeStatus: (status: string) => void, onOpenImages: () => void }) {
    const isAvailable = room.currentStatus === 'AVAILABLE';
    const isMaintenance = room.currentStatus === 'MAINTENANCE';
    const isBooked = room.currentStatus === 'BOOKED';

    const hasImages = room.imageUrls && room.imageUrls.length > 0;

    const getStatusText = (status: string) => {
        switch(status) {
            case 'AVAILABLE': return 'Trống';
            case 'OCCUPIED': return 'Đang thuê';
            case 'MAINTENANCE': return 'Bảo trì';
            case 'BOOKED': return 'Đã cọc';
            default: return status;
        }
    };

    const statusBadgeClasses: Record<string, string> = {
        'AVAILABLE': 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30',
        'OCCUPIED': 'bg-blue-500/20 text-blue-500 border-blue-500/30',
        'MAINTENANCE': 'bg-amber-500/20 text-amber-500 border-amber-500/30',
        'BOOKED': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    };

    const statusIconColor: Record<string, string> = {
        'AVAILABLE': 'text-emerald-500',
        'OCCUPIED': 'text-blue-500',
        'MAINTENANCE': 'text-amber-500',
        'BOOKED': 'text-purple-500',
    };

    const statusBarColor: Record<string, string> = {
        'AVAILABLE': 'bg-emerald-500',
        'OCCUPIED': 'bg-blue-500',
        'MAINTENANCE': 'bg-amber-500',
        'BOOKED': 'bg-purple-500',
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] group relative flex flex-col h-full">
            {/* Image Thumbnail */}
            <div className="relative h-36 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
                {hasImages ? (
                    <img 
                        src={room.imageUrls[0]} 
                        alt={room.roomNumber} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-600">
                        <Home size={32} className="mb-1" />
                        <span className="text-xs">Chưa có ảnh</span>
                    </div>
                )}
                {/* Image Count Badge */}
                {hasImages && (
                    <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 backdrop-blur-sm">
                        <Camera size={10} /> {room.imageUrls.length}
                    </span>
                )}
                {/* Status Badge over image */}
                <span className={`absolute top-2 right-2 text-xs font-medium px-2.5 py-1 rounded-full border backdrop-blur-sm ${statusBadgeClasses[room.currentStatus] || statusBadgeClasses['AVAILABLE']}`}>
                    {getStatusText(room.currentStatus)}
                </span>
            </div>

            <div className="p-4 flex-1">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <div className="text-xs text-slate-500 font-medium mb-0.5">{room.buildingName} • {room.floorName}</div>
                        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                            <Home size={16} className={statusIconColor[room.currentStatus] || 'text-emerald-500'} />
                            {room.roomNumber}
                        </h3>
                    </div>
                </div>

                <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Loại phòng:</span>
                        <span className="text-slate-200 font-medium truncate max-w-[120px]" title={room.roomTypeName}>{room.roomTypeName}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Giá thuê:</span>
                        <span className="text-emerald-400 font-semibold">
                            {new Intl.NumberFormat('vi-VN').format(room.price)}đ
                        </span>
                    </div>
                </div>
            </div>

            {/* Action Button Area */}
            <div className="p-4 pt-0 mt-auto flex gap-2">
                <button 
                    onClick={onEdit}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg py-2 text-sm font-medium transition-colors flex justify-center items-center gap-1.5 border border-slate-700"
                >
                    <Edit size={14} /> Sửa
                </button>
                <button 
                    onClick={onOpenImages}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg py-2 px-3 text-sm font-medium transition-colors flex justify-center items-center gap-1.5 border border-slate-700"
                    title="Quản lý ảnh phòng"
                >
                    <ImagePlus size={14} />
                </button>
                
                {isAvailable ? (
                    <button 
                        onClick={() => onChangeStatus('MAINTENANCE')}
                        className="flex-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded-lg py-2 text-sm font-medium transition-colors flex justify-center items-center gap-1.5 border border-amber-500/20"
                    >
                        <Clock size={14} /> Bảo trì
                    </button>
                ) : isMaintenance ? (
                    <button 
                        onClick={() => onChangeStatus('AVAILABLE')}
                        className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-lg py-2 text-sm font-medium transition-colors flex justify-center items-center gap-1.5 border border-emerald-500/20"
                    >
                        <CheckCircle2 size={14} /> Xong BT
                    </button>
                ) : isBooked ? (
                    <button 
                        onClick={() => onChangeStatus('AVAILABLE')}
                        className="flex-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg py-2 text-sm font-medium transition-colors flex justify-center items-center gap-1.5 border border-purple-500/20"
                    >
                        <CheckCircle2 size={14} /> Hủy cọc
                    </button>
                ) : (
                    <button className="flex-1 bg-blue-500/10 text-blue-500 rounded-lg py-2 text-sm font-medium flex justify-center items-center gap-1.5 border border-blue-500/20 opacity-70 cursor-not-allowed" title="Đang có người thuê">
                        <Users size={14} /> Đang ở
                    </button>
                )}
            </div>

            {/* Decorative Cap Bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-slate-800 w-full">
                <div
                    className={`h-full transition-all duration-500 ${statusBarColor[room.currentStatus] || 'bg-emerald-500'}`}
                    style={{ width: '100%' }}
                />
            </div>
        </div>
    );
}
