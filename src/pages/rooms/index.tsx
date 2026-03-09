import React, { useState } from 'react';
import { Layout } from '../../components/layout';
import { Search, Filter, Plus, Home, Users, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

// Giả lập dữ liệu phòng
const mockRooms = Array.from({ length: 12 }).map((_, i) => ({
    id: `P${(i + 1).toString().padStart(3, '0')}`,
    name: `Phòng ${101 + i}`,
    type: i % 3 === 0 ? 'VIP' : (i % 2 === 0 ? 'Studio' : 'Tiêu chuẩn'),
    price: i % 3 === 0 ? 5500000 : (i % 2 === 0 ? 4500000 : 3500000),
    capacity: i % 3 === 0 ? 4 : 2,
    currentTenants: i % 4 === 0 ? 0 : (i % 3 === 0 ? 4 : 1),
    status: i % 4 === 0 ? 'Trống' : (i % 7 === 0 ? 'Bảo trì' : 'Đang thuê'),
    building: i < 6 ? 'Cơ sở 1' : 'Cơ sở 2',
}));

export default function Rooms() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('Tất cả');

    return (
        <Layout>
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100 mb-1">Quản lý phòng trọ</h1>
                    <p className="text-slate-400 text-sm">Xem và quản lý thông tin trạng thái các phòng trong hệ thống.</p>
                </div>
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                    <Plus size={18} /> Thêm phòng mới
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo mã phòng, tên phòng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-500"
                    />
                </div>

                <div className="flex gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                    <FilterButton active={filterStatus === 'Tất cả'} onClick={() => setFilterStatus('Tất cả')}>Tất cả</FilterButton>
                    <FilterButton active={filterStatus === 'Trống'} onClick={() => setFilterStatus('Trống')}>Trống</FilterButton>
                    <FilterButton active={filterStatus === 'Đang thuê'} onClick={() => setFilterStatus('Đang thuê')}>Đang thuê</FilterButton>
                    <FilterButton active={filterStatus === 'Bảo trì'} onClick={() => setFilterStatus('Bảo trì')}>Bảo trì</FilterButton>
                    <button className="flex items-center gap-2 text-slate-400 hover:text-white px-3 py-2 rounded-lg text-sm transition-colors border border-slate-700 hover:border-slate-500 whitespace-nowrap">
                        <Filter size={16} /> Bộ lọc khác
                    </button>
                </div>
            </div>

            {/* Room Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mockRooms.map((room) => (
                    <RoomCard key={room.id} room={room} />
                ))}
            </div>
        </Layout>
    );
}

function FilterButton({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${active
                    ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border border-transparent hover:text-slate-200 hover:bg-slate-700'
                }`}
        >
            {children}
        </button>
    );
}

function RoomCard({ room }: { room: any }) {
    const isAvailable = room.status === 'Trống';
    const isMaintenance = room.status === 'Bảo trì';

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] group cursor-pointer relative">
            <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="text-xs text-slate-500 font-medium mb-1">{room.building}</div>
                        <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                            <Home size={18} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                            {room.name}
                        </h3>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${isAvailable
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                            : isMaintenance
                                ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                        }`}>
                        {room.status}
                    </span>
                </div>

                <div className="space-y-3 mb-5">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Loại phòng:</span>
                        <span className="text-slate-100 font-medium">{room.type}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Khách thuê:</span>
                        <span className="text-slate-100 flex items-center gap-1.5">
                            <Users size={14} className="text-slate-500" />
                            {room.currentTenants}/{room.capacity}
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Giá thuê:</span>
                        <span className="text-emerald-400 font-semibold">
                            {new Intl.NumberFormat('vi-VN').format(room.price)}đ
                        </span>
                    </div>
                </div>

                {/* Action Button Area */}
                <div className="pt-4 border-t border-slate-800 flex gap-2">
                    {isAvailable ? (
                        <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg py-2 text-sm font-medium transition-colors flex justify-center items-center gap-2 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                            <CheckCircle2 size={16} /> Xếp phòng
                        </button>
                    ) : isMaintenance ? (
                        <button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg py-2 text-sm font-medium transition-colors flex justify-center items-center gap-2">
                            <Clock size={16} /> Đang sửa chữa
                        </button>
                    ) : (
                        <button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg py-2 text-sm font-medium transition-colors flex justify-center items-center gap-2 border border-slate-700">
                            <AlertCircle size={16} /> Xem chi tiết
                        </button>
                    )}
                </div>
            </div>

            {/* Decorative Capacity Bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-slate-800 w-full">
                <div
                    className={`h-full transition-all duration-500 ${room.currentTenants === room.capacity ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                    style={{ width: `${(room.currentTenants / room.capacity) * 100}%` }}
                />
            </div>
        </div>
    );
}
