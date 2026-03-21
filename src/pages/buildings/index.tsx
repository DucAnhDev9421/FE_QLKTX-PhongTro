import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Layout } from '../../components/layout';
import { Search, Filter, Plus, Building, MapPin, Edit, Trash2, Layers, UserCog, Loader2, ListTree } from 'lucide-react';
import BuildingModal from './components/BuildingModal';
import FloorManagementModal from './components/FloorManagementModal';
import { buildingService } from '../../services/building';
import ConfirmModal from '../../components/ui/ConfirmModal';

export default function Buildings() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBuilding, setSelectedBuilding] = useState<any | null>(null);
    const [managingFloorsBuilding, setManagingFloorsBuilding] = useState<any | null>(null);
    const queryClient = useQueryClient();

    const [confirmDialog, setConfirmDialog] = useState<{isOpen: boolean, config: any}>({
        isOpen: false,
        config: null
    });

    const { data: responseData, isLoading } = useQuery({
        queryKey: ['buildings'],
        queryFn: () => buildingService.getBuildings()
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => buildingService.deleteBuilding(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['buildings'] });
            setConfirmDialog({ isOpen: false, config: null });
        }
    });

    const buildings = responseData?.result || [];

    const filteredBuildings = buildings.filter((b: any) => 
        (b.buildingName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.address || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (building: any) => {
        setSelectedBuilding(building);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedBuilding(null);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number, name: string) => {
        setConfirmDialog({
            isOpen: true,
            config: {
                title: 'Xóa tòa nhà',
                message: `Bạn có chắc chắn muốn xóa "${name}"? Tất cả các tầng, phòng và hợp đồng thuộc tòa nhà này có thể bị ảnh hưởng nghiêm trọng.`,
                type: 'danger',
                confirmText: 'Xóa Tòa nhà',
                onConfirm: () => deleteMutation.mutate(id)
            }
        });
    };

    return (
        <Layout>
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100 mb-1">Quản lý cơ sở vật chất</h1>
                    <p className="text-slate-400 text-sm">Xem và quản lý thông tin các phòng trọ, tòa nhà trong hệ thống.</p>
                </div>
                <button 
                    onClick={handleCreate}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.4)] transform hover:-translate-y-0.5">
                    <Plus size={18} /> Thêm tòa nhà
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-2xl shadow-xl p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, địa chỉ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 text-slate-200 rounded-xl pl-11 pr-4 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-sm placeholder:text-slate-500"
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    <button className="flex items-center gap-2 bg-black/40 border border-white/10 hover:border-white/20 hover:bg-white/5 text-slate-300 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap">
                        <Filter size={16} /> Lọc kết quả
                    </button>
                </div>
            </div>

            {/* Buildings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative">
                {isLoading ? (
                    Array.from({ length: 6 }).map((_, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-5 animate-pulse flex flex-col gap-4">
                            <div className="flex gap-4 items-center">
                                <div className="w-12 h-12 bg-white/10 rounded-xl shrink-0"></div>
                                <div className="space-y-2 flex-1">
                                    <div className="h-5 bg-white/10 rounded-md w-3/4"></div>
                                    <div className="h-3 bg-white/10 rounded-md w-1/4"></div>
                                </div>
                            </div>
                            <div className="space-y-2 mt-2">
                                <div className="h-4 bg-white/10 rounded-md w-full"></div>
                                <div className="h-4 bg-white/10 rounded-md w-full"></div>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <div className="h-10 bg-white/10 rounded-xl w-full"></div>
                                <div className="h-10 bg-white/10 rounded-xl w-12 shrink-0"></div>
                            </div>
                        </div>
                    ))
                ) : filteredBuildings.length === 0 ? (
                    <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-500 border border-dashed border-white/10 bg-white/[0.02] rounded-2xl">
                        <Building size={48} className="mb-4 opacity-20" />
                        <p className="text-lg font-medium">Không tìm thấy tòa nhà nào</p>
                        <p className="text-sm">Hãy thử thay đổi từ khóa tìm kiếm hoặc tạo mới.</p>
                    </div>
                ) : (
                    filteredBuildings.map((building: any) => (
                        <div key={building.buildingId} className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)] group flex flex-col">
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-5">
                                    <div className="flex items-center gap-3.5">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
                                            <Building size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-1" title={building.buildingName}>{building.buildingName}</h3>
                                            <div className="text-xs text-slate-500 font-mono mt-0.5 opacity-70">ID: {building.buildingId}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6 flex-1">
                                    <div className="flex items-start gap-2.5 text-sm">
                                        <MapPin size={16} className="text-slate-500 mt-0.5 shrink-0" />
                                        <span className="text-slate-300 line-clamp-2" title={building.address}>{building.address || 'Chưa cập nhật địa chỉ'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm bg-black/20 p-3 rounded-xl border border-white/5">
                                        <div className="flex items-center gap-2">
                                            <Layers size={16} className="text-emerald-500/70" />
                                            <span className="text-slate-400">Số lượng Tầng:</span>
                                        </div>
                                        <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">{building.totalFloors || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm items-center gap-2 px-1">
                                        <span className="text-slate-500 flex items-center gap-2"><UserCog size={15} /> Quản lý:</span>
                                        <span className="text-slate-300 font-medium truncate">{building.managerName || 'Chưa phân công'}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-auto">
                                    <button 
                                        onClick={() => setManagingFloorsBuilding(building)}
                                        className="flex-1 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white rounded-xl py-2.5 text-sm font-semibold transition-all border border-blue-500/20 flex justify-center items-center gap-2 group/floor">
                                        <ListTree size={16} className="group-hover/floor:scale-110 transition-transform" /> Xem tầng
                                    </button>
                                    <button 
                                        onClick={() => handleEdit(building)}
                                        title="Chỉnh sửa thông tin"
                                        className="w-12 shrink-0 bg-white/5 hover:bg-emerald-500 hover:text-emerald-950 text-slate-300 rounded-xl py-2.5 transition-all border border-white/10 hover:border-emerald-400 flex justify-center items-center">
                                        <Edit size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(building.buildingId, building.buildingName)}
                                        disabled={deleteMutation.isPending && confirmDialog.config?.onConfirm}
                                        title="Xóa cơ sở"
                                        className="w-12 shrink-0 bg-white/5 hover:bg-rose-500 text-slate-400 hover:text-white rounded-xl flex justify-center items-center transition-all border border-white/10 hover:border-rose-400 disabled:opacity-50">
                                        {deleteMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {isModalOpen && (
                <BuildingModal 
                    building={selectedBuilding} 
                    onClose={() => setIsModalOpen(false)} 
                />
            )}

            {managingFloorsBuilding && (
                <FloorManagementModal 
                    building={managingFloorsBuilding}
                    onClose={() => setManagingFloorsBuilding(null)}
                />
            )}

            <ConfirmModal 
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog(prev => ({...prev, isOpen: false}))}
                onConfirm={confirmDialog.config?.onConfirm || (() => {})}
                title={confirmDialog.config?.title || ''}
                message={confirmDialog.config?.message || ''}
                type={confirmDialog.config?.type || 'danger'}
                confirmText={confirmDialog.config?.confirmText}
                isLoading={deleteMutation.isPending}
            />
        </Layout>
    );
}
