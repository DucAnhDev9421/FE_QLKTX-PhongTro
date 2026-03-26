import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PackageOpen, Box, Calendar, DollarSign, Plus, Edit, Trash2, Search, Loader2, Building, Home, Layers, Layers2 } from 'lucide-react';
import { Layout } from '../../components/layout';
import AssetModal from './components/AssetModal';
import RoomAssetModal from './components/RoomAssetModal';
import BulkRoomAssetModal from './components/BulkRoomAssetModal';
import { assetService } from '../../services/asset';
import { buildingService } from '../../services/building';
import { roomService } from '../../services/room';
import ConfirmModal from '../../components/ui/ConfirmModal';

export default function Assets() {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<'global' | 'room'>('global');
    const [searchTerm, setSearchTerm] = useState('');

    // Modal states
    const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState<any>(null);
    const [isRoomAssetModalOpen, setIsRoomAssetModalOpen] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [isBulkRemoveModalOpen, setIsBulkRemoveModalOpen] = useState(false);
    const [editingRoomAsset, setEditingRoomAsset] = useState<any>(null);

    // Filter states for Room Assets tab
    const [selectedBuildingId, setSelectedBuildingId] = useState<number | ''>('');
    const [selectedFloorId, setSelectedFloorId] = useState<number | ''>('');
    const [selectedRoomId, setSelectedRoomId] = useState<number | ''>('');
    
    // Confirm Dialog states
    const [confirmId, setConfirmId] = useState<number | null>(null);
    const [confirmType, setConfirmType] = useState<'global' | 'room' | null>(null);

    // Fetch Global Assets
    const { data: globalAssetsData, isLoading: isLoadingGlobal } = useQuery({
        queryKey: ['assets'],
        queryFn: () => assetService.getAllAssets()
    });
    const globalAssets = globalAssetsData?.result || [];

    // Fetch Buildings for Room filter
    const { data: buildingsData } = useQuery({
        queryKey: ['buildings'],
        queryFn: () => buildingService.getBuildings()
    });
    const buildings = buildingsData?.result || [];

    // Fetch Floors based on selected building
    const { data: floorsData } = useQuery({
        queryKey: ['floors', selectedBuildingId],
        queryFn: () => buildingService.getFloorsByBuilding(Number(selectedBuildingId)),
        enabled: !!selectedBuildingId
    });
    const floors = floorsData?.result || [];

    // Fetch All Rooms (already fetched as allRooms)
    const { data: allRoomsData } = useQuery({
        queryKey: ['rooms'],
        queryFn: () => roomService.getRooms()
    });
    const allRooms = allRoomsData?.result || [];

    // Filter rooms by selected building and floor
    const selectedBuilding = buildings.find((b: any) => b.buildingId === selectedBuildingId);
    const selectedFloor = floors.find((f: any) => f.floorId === selectedFloorId);
    
    const rooms = selectedBuilding 
        ? allRooms.filter((r: any) => {
            const matchBuilding = r.buildingName === selectedBuilding.buildingName;
            const matchFloor = selectedFloor ? r.floorName === selectedFloor.floorName : true;
            return matchBuilding && matchFloor;
        })
        : [];

    // Fetch Room Assets based on selected room
    const { data: roomAssetsData, isLoading: isLoadingRoomAssets } = useQuery({
        queryKey: ['room-assets', selectedRoomId],
        queryFn: () => assetService.getAssetsByRoom(Number(selectedRoomId)),
        enabled: !!selectedRoomId
    });
    const roomAssets = roomAssetsData?.result || [];

    // Mutations
    const removeRoomAssetMutation = useMutation({
        mutationFn: (id: number) => assetService.removeRoomAsset(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['room-assets', selectedRoomId] });
            setConfirmId(null);
            setConfirmType(null);
        }
    });

    const deleteAssetMutation = useMutation({
        mutationFn: (id: number) => assetService.deleteAsset(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assets'] });
            setConfirmId(null);
            setConfirmType(null);
        },
        onError: (err: any) => {
            alert(err.response?.data?.message || 'Không thể xóa tài sản. Có thể tài sản đang được sử dụng.');
            setConfirmId(null);
            setConfirmType(null);
        }
    });

    // Formatting
    const formatCurrency = (amount?: number) => {
        if (!amount) return '0 đ';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '---';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    const getConditionBadge = (status: string) => {
        switch (status) {
            case 'GOOD': return <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-medium border border-emerald-500/20">Sử dụng tốt</span>;
            case 'MAINTENANCE': return <span className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-medium border border-amber-500/20">Bảo trì</span>;
            case 'BROKEN': return <span className="px-3 py-1 bg-rose-500/10 text-rose-500 rounded-full text-xs font-medium border border-rose-500/20">Hỏng hóc</span>;
            case 'LOST': return <span className="px-3 py-1 bg-slate-500/10 text-slate-500 rounded-full text-xs font-medium border border-slate-500/20">Thất lạc</span>;
            default: return <span className="px-3 py-1 bg-slate-800 text-slate-400 rounded-full text-xs font-medium">{status}</span>;
        }
    };

    const filteredGlobalAssets = globalAssets.filter((a: any) => 
        a.assetName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (a.assetCode && a.assetCode.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <Layout>
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                            <Box className="text-emerald-500" size={32} />
                            Quản lý Tài sản
                        </h1>
                        <p className="text-slate-400 mt-2">Nắm bắt thông tin, tình trạng vật tư thiết bị trong tòa nhà và từng phòng.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {activeTab === 'global' ? (
                            <button 
                                onClick={() => setIsAssetModalOpen(true)}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-emerald-900/20 flex items-center gap-2"
                            >
                                <Plus size={18} /> Nhập tài sản mới
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setIsBulkModalOpen(true)}
                                    disabled={!selectedBuildingId}
                                    className="bg-slate-800 hover:bg-slate-700 disabled:bg-slate-800 disabled:text-slate-600 text-emerald-400 border border-slate-700 px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2"
                                >
                                    <Layers size={18} /> Gán hàng loạt
                                </button>
                                <button 
                                    onClick={() => setIsBulkRemoveModalOpen(true)}
                                    disabled={!selectedBuildingId}
                                    className="bg-slate-800 hover:bg-slate-700 disabled:bg-slate-800 disabled:text-slate-600 text-rose-400 border border-slate-700 px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2"
                                >
                                    <Layers2 size={18} /> Gỡ hàng loạt
                                </button>
                                <button 
                                    onClick={() => setIsRoomAssetModalOpen(true)}
                                    disabled={!selectedRoomId}
                                    className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-emerald-900/20 flex items-center gap-2"
                                >
                                    <Plus size={18} /> Gán vào phòng
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-4 bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800 w-max backdrop-blur-sm">
                    <button
                        onClick={() => setActiveTab('global')}
                        className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                            activeTab === 'global' ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <PackageOpen size={18} /> Kho Tài sản Chung
                    </button>
                    <button
                        onClick={() => setActiveTab('room')}
                        className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                            activeTab === 'room' ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <Home size={18} /> Phân bổ theo Phòng
                    </button>
                </div>

                {/* Tab content */}
                {activeTab === 'global' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {/* Global Filters */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
                            <div className="relative max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                <input 
                                    type="text"
                                    placeholder="Tìm kiếm tên, mã tài sản..."
                                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Global Table */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
                            {isLoadingGlobal ? (
                                <div className="h-64 flex flex-col items-center justify-center text-slate-500 gap-3">
                                    <Loader2 className="animate-spin text-emerald-500" size={32} />
                                    <p>Đang tải danh mục tài sản...</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-950/50 border-b border-slate-800 text-slate-400 text-sm">
                                                <th className="p-4 font-medium">Mã code</th>
                                                <th className="p-4 font-medium">Tên tài sản</th>
                                                <th className="p-4 font-medium">Ngày mua</th>
                                                <th className="p-4 font-medium text-right">Đơn giá nhập</th>
                                                <th className="p-4 font-medium text-right">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800">
                                            {filteredGlobalAssets.length === 0 ? (
                                                <tr>
                                                    <td colSpan={4} className="p-8 text-center text-slate-500">
                                                        <Box size={48} className="mx-auto mb-3 opacity-20" />
                                                        Chưa có tài sản nào trong kho.
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredGlobalAssets.map((asset: any) => (
                                                    <tr key={asset.assetId} className="hover:bg-slate-800/50 transition-colors group">
                                                        <td className="p-4 text-emerald-400 font-mono text-sm">{asset.assetCode || '---'}</td>
                                                        <td className="p-4 text-slate-200 font-medium">{asset.assetName}</td>
                                                        <td className="p-4 text-slate-400 text-sm">
                                                            <div className="flex items-center gap-1.5"><Calendar size={14}/> {formatDate(asset.purchaseDate)}</div>
                                                        </td>
                                                        <td className="p-4 font-mono text-emerald-400 text-right">
                                                            <div className="flex items-center justify-end gap-1.5"><DollarSign size={14}/> {formatCurrency(asset.purchasePrice)}</div>
                                                        </td>
                                                        <td className="p-4 text-right">
                                                            <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button 
                                                                    onClick={() => {
                                                                        setEditingAsset(asset);
                                                                        setIsAssetModalOpen(true);
                                                                    }}
                                                                    className="p-2 bg-slate-800 text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                                                >
                                                                    <Edit size={16} />
                                                                </button>
                                                                <button 
                                                                    onClick={() => {
                                                                        setConfirmId(asset.assetId);
                                                                        setConfirmType('global');
                                                                    }}
                                                                    disabled={deleteAssetMutation.isPending}
                                                                    className="p-2 bg-slate-800 text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors disabled:opacity-50"
                                                                >
                                                                    {deleteAssetMutation.isPending && deleteAssetMutation.variables === asset.assetId ? 
                                                                        <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />
                                                                    }
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'room' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {/* Selector Area */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
                            <div className="flex flex-col md:flex-row gap-4 items-end">
                                <div className="w-full md:w-64">
                                    <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                                        <Building size={16} /> Cơ sở / Tòa nhà
                                    </label>
                                    <select 
                                        className="w-full bg-slate-900 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer"
                                        value={selectedBuildingId}
                                        onChange={(e) => {
                                            setSelectedBuildingId(e.target.value ? Number(e.target.value) : '');
                                            setSelectedFloorId(''); // Reset floor
                                            setSelectedRoomId(''); // Reset room
                                        }}
                                    >
                                        <option value="">-- Tất cả cơ sở --</option>
                                        {buildings.map((b: any) => (
                                            <option key={b.buildingId} value={b.buildingId}>{b.buildingName}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="w-full md:w-64">
                                    <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                                        <Layers size={16} /> Tầng
                                    </label>
                                    <select 
                                        className="w-full bg-slate-900 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer disabled:opacity-50"
                                        value={selectedFloorId}
                                        onChange={(e) => {
                                            setSelectedFloorId(e.target.value ? Number(e.target.value) : '');
                                            setSelectedRoomId(''); // Reset room
                                        }}
                                        disabled={!selectedBuildingId}
                                    >
                                        <option value="">-- Tất cả tầng --</option>
                                        {floors.map((f: any) => (
                                            <option key={f.floorId} value={f.floorId}>{f.floorName}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="w-full md:w-64">
                                    <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                                        <Home size={16} /> Phòng
                                    </label>
                                    <select 
                                        className="w-full bg-slate-900 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer disabled:opacity-50"
                                        value={selectedRoomId}
                                        onChange={(e) => setSelectedRoomId(e.target.value ? Number(e.target.value) : '')}
                                        disabled={!selectedBuildingId}
                                    >
                                        <option value="">-- Chọn phòng --</option>
                                        {rooms.map((r: any) => (
                                            <option key={r.roomId} value={r.roomId}>
                                                Phòng {r.roomNumber} ({r.floorName})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Room Assets Table */}
                        {selectedRoomId ? (
                             <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
                             {isLoadingRoomAssets ? (
                                 <div className="h-64 flex flex-col items-center justify-center text-slate-500 gap-3">
                                     <Loader2 className="animate-spin text-emerald-500" size={32} />
                                     <p>Đang tải tài sản phòng...</p>
                                 </div>
                             ) : (
                                 <div className="overflow-x-auto">
                                     <table className="w-full text-left border-collapse">
                                         <thead>
                                             <tr className="bg-slate-950/50 border-b border-slate-800 text-slate-400 text-sm">
                                                 <th className="p-4 font-medium">Số Phòng</th>
                                                 <th className="p-4 font-medium">Tên Tài sản</th>
                                                 <th className="p-4 font-medium">Số lượng</th>
                                                 <th className="p-4 font-medium">Tình trạng</th>
                                                 <th className="p-4 font-medium text-right">Thao tác</th>
                                             </tr>
                                         </thead>
                                         <tbody className="divide-y divide-slate-800">
                                             {roomAssets.length === 0 ? (
                                                 <tr>
                                                     <td colSpan={5} className="p-8 text-center text-slate-500">
                                                         Phòng này hiện chưa ghi nhận tài sản nào.
                                                     </td>
                                                 </tr>
                                             ) : (
                                                 roomAssets.map((ra: any) => (
                                                     <tr key={ra.roomAssetId} className="hover:bg-slate-800/50 transition-colors group">
                                                         <td className="p-4 text-emerald-400 font-mono">P.{ra.roomNumber}</td>
                                                         <td className="p-4 text-slate-200 font-medium">{ra.assetName}</td>
                                                         <td className="p-4 text-slate-200">
                                                             <div className="bg-slate-950 px-3 py-1 rounded inline-block">x{ra.quantity}</div>
                                                         </td>
                                                         <td className="p-4">
                                                             {getConditionBadge(ra.conditionStatus)}
                                                         </td>
                                                         <td className="p-4 text-right">
                                                            <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button 
                                                                    onClick={() => {
                                                                        setEditingRoomAsset(ra);
                                                                        setIsRoomAssetModalOpen(true);
                                                                    }}
                                                                    className="p-2 bg-slate-800 text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                                                >
                                                                    <Edit size={16} />
                                                                </button>
                                                                <button 
                                                                    onClick={() => {
                                                                        setConfirmId(ra.roomAssetId);
                                                                        setConfirmType('room');
                                                                    }}
                                                                    disabled={removeRoomAssetMutation.isPending}
                                                                    className="p-2 bg-slate-800 text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors disabled:opacity-50"
                                                                >
                                                                    {removeRoomAssetMutation.isPending && removeRoomAssetMutation.variables === ra.roomAssetId ? 
                                                                        <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />
                                                                    }
                                                                </button>
                                                            </div>
                                                         </td>
                                                     </tr>
                                                 ))
                                             )}
                                         </tbody>
                                     </table>
                                 </div>
                             )}
                         </div>
                        ) : (
                            <div className="bg-slate-900 border border-slate-800 border-dashed rounded-2xl p-12 text-center text-slate-500 backdrop-blur-sm">
                                <Box size={48} className="mx-auto mb-4 opacity-20" />
                                <h3 className="text-lg font-medium text-slate-400 mb-1">Vui lòng chọn Phòng</h3>
                                <p>Sử dụng bộ lọc ở trên để chọn Tòa nhà và Phòng cần xem tài sản.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modals */}
            {isAssetModalOpen && (
                <AssetModal 
                    assetToEdit={editingAsset} 
                    onClose={() => {
                        setIsAssetModalOpen(false);
                        setEditingAsset(null);
                    }} 
                />
            )}

            {isRoomAssetModalOpen && selectedRoomId && (
                <RoomAssetModal 
                    roomId={Number(selectedRoomId)} 
                    roomAssetToEdit={editingRoomAsset}
                    onClose={() => {
                        setIsRoomAssetModalOpen(false);
                        setEditingRoomAsset(null);
                    }} 
                />
            )}

            {isBulkModalOpen && selectedBuildingId && (
                <BulkRoomAssetModal 
                    buildingId={Number(selectedBuildingId)}
                    mode="ASSIGN"
                    onClose={() => setIsBulkModalOpen(false)}
                />
            )}

            {isBulkRemoveModalOpen && selectedBuildingId && (
                <BulkRoomAssetModal 
                    buildingId={Number(selectedBuildingId)}
                    mode="REMOVE"
                    onClose={() => setIsBulkRemoveModalOpen(false)}
                />
            )}

            {/* Confirm Modal */}
            <ConfirmModal 
                isOpen={!!confirmId}
                onClose={() => {
                    setConfirmId(null);
                    setConfirmType(null);
                }}
                onConfirm={() => {
                    if (confirmType === 'global' && confirmId) deleteAssetMutation.mutate(confirmId);
                    if (confirmType === 'room' && confirmId) removeRoomAssetMutation.mutate(confirmId);
                }}
                title={confirmType === 'global' ? 'Xóa tài sản khỏi danh mục' : 'Gỡ tài sản khỏi phòng'}
                message={confirmType === 'global' 
                    ? 'Bạn có chắc chắn muốn xóa tài sản này? Hành động này không thể hoàn tác nếu tài sản chưa được sử dụng.' 
                    : 'Bạn có chắc chắn muốn gỡ tài sản này khỏi phòng?'}
                isLoading={deleteAssetMutation.isPending || removeRoomAssetMutation.isPending}
                confirmText="Xác nhận xóa"
                type="danger"
            />
        </Layout>
    );
}
