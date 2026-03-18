import { useState } from 'react';
import { Layout } from '../../components/layout';
import { Search, Filter, Plus, Building, MapPin, Edit, Trash2 } from 'lucide-react';
import BuildingModal from './components/BuildingModal';
import { Building as BuildingType } from '../../types/building';

const mockBuildings: BuildingType[] = Array.from({ length: 5 }).map((_, i) => ({
    id: `B${(i + 1).toString().padStart(3, '0')}`,
    name: `Tòa nhà Cơ sở ${i + 1}`,
    address: `${100 + i * 15} Đường ABC, Quận XYZ, TP.HCM`,
    numberOfFloors: 5 + i,
    totalRooms: 20 + i * 10,
    status: i === 4 ? 'MAINTENANCE' : 'ACTIVE',
    createdAt: new Date().toISOString()
}));

export default function Buildings() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBuilding, setSelectedBuilding] = useState<BuildingType | null>(null);

    const handleEdit = (building: BuildingType) => {
        setSelectedBuilding(building);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedBuilding(null);
        setIsModalOpen(true);
    };

    return (
        <Layout>
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100 mb-1">Quản lý tòa nhà</h1>
                    <p className="text-slate-400 text-sm">Xem và quản lý thông tin các cơ sở, tòa nhà trong hệ thống.</p>
                </div>
                <button 
                    onClick={handleCreate}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                    <Plus size={18} /> Thêm tòa nhà
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg mb-8 flex gap-4 items-center">
                <div className="relative flex-1 sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, địa chỉ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-500"
                    />
                </div>
                <button className="flex items-center gap-2 text-slate-400 hover:text-white px-3 py-2 rounded-lg text-sm transition-colors border border-slate-700 hover:border-slate-500 whitespace-nowrap">
                    <Filter size={16} /> Bộ lọc
                </button>
            </div>

            {/* Buildings Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {mockBuildings.map((building) => (
                    <div key={building.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] group">
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                        <Building size={20} />
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 font-medium mb-0.5">ID: {building.id}</div>
                                        <h3 className="text-lg font-bold text-slate-100">{building.name}</h3>
                                    </div>
                                </div>
                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                                    building.status === 'ACTIVE'
                                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                        : building.status === 'MAINTENANCE'
                                            ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                            : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                }`}>
                                    {building.status === 'ACTIVE' ? 'Hoạt động' : building.status === 'MAINTENANCE' ? 'Bảo trì' : 'Không HĐ'}
                                </span>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-start gap-2 text-sm">
                                    <MapPin size={16} className="text-slate-500 mt-0.5 shrink-0" />
                                    <span className="text-slate-300">{building.address}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-t border-slate-800/50 pt-3 mt-3">
                                    <span className="text-slate-400">Số tầng:</span>
                                    <span className="text-slate-200 font-medium">{building.numberOfFloors}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Tổng số phòng:</span>
                                    <span className="text-slate-200 font-medium">{building.totalRooms}</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handleEdit(building)}
                                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg py-2 text-sm font-medium transition-colors border border-slate-700 flex justify-center items-center gap-2">
                                    <Edit size={16} /> Chỉnh sửa
                                </button>
                                <button className="w-10 flex-shrink-0 bg-slate-800 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 text-slate-400 rounded-lg flex justify-center items-center transition-colors border border-slate-700">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <BuildingModal 
                    building={selectedBuilding} 
                    onClose={() => setIsModalOpen(false)} 
                />
            )}
        </Layout>
    );
}
