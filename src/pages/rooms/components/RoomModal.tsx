import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, Home, MapPin, Layers, Tag, Plus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roomService } from '../../../services/room';
import { buildingService } from '../../../services/building';
import Alert from '../../../components/ui/Alert';
import RoomTypeModal from './RoomTypeModal';

interface Props {
    room: any | null;
    onClose: () => void;
}

export default function RoomModal({ room, onClose }: Props) {
    const isEdit = !!room;
    const queryClient = useQueryClient();

    const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);

    // Initial state setup is a bit tricky for nested selects (Building -> Floor) if editing
    // If editing, we know floorId. We'll need to fetch buildings to find which building has this floorId.
    // However, BE doesn't give building list easily from floorId. But room object has buildingName.
    // For now, let's just allow editing the floor directly if needed, relying on UI flow.
    
    // Actually, BE room response has `floorId` but NOT buildingId. 
    // To simplifiy, when creating, we select Building -> Floor.
    // Admin needs to select building first.
    
    const [selectedBuildingId, setSelectedBuildingId] = useState<number | ''>('');
    
    const [formData, setFormData] = useState({
        roomNumber: room?.roomNumber || '',
        floorId: room?.floorId || '',
        roomTypeId: room?.roomTypeId || '',
        currentStatus: room?.currentStatus || 'AVAILABLE'
    });

    const [errorMsg, setErrorMsg] = useState('');

    // Fetch Room Types
    const { data: roomTypesData } = useQuery({
        queryKey: ['roomTypes'],
        queryFn: () => roomService.getRoomTypes()
    });
    const roomTypes = roomTypesData?.result || [];

    // Fetch Buildings for selection
    const { data: buildingsData } = useQuery({
        queryKey: ['buildings'],
        queryFn: () => buildingService.getBuildings()
    });
    const buildings = buildingsData?.result || [];

    // Fetch Floors based on selected building
    // Note: If Edit mode, we might not have selectedBuildingId unless we force them to select it again to change floor.
    // If we just want to keep the current floorId, we can show it as pre-selected if we don't change building.
    const { data: floorsData } = useQuery({
        queryKey: ['floors', selectedBuildingId],
        queryFn: () => buildingService.getFloorsByBuilding(selectedBuildingId as number),
        enabled: !!selectedBuildingId
    });
    const floors = floorsData?.result || [];

    const mutation = useMutation({
        mutationFn: (data: any) => isEdit 
            ? roomService.updateRoom(room.roomId, data)
            : roomService.createRoom(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
            onClose();
        },
        onError: (err: any) => {
            setErrorMsg(err.response?.data?.message || 'Có lỗi xảy ra khi lưu phòng.');
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: ['floorId', 'roomTypeId'].includes(name) ? Number(value) : value 
        }));
    };

    const handleBuildingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const bId = Number(e.target.value);
        setSelectedBuildingId(bId);
        setFormData(prev => ({ ...prev, floorId: '' })); // Reset floor when building changes
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        if (!formData.roomNumber || !formData.floorId || !formData.roomTypeId) {
            setErrorMsg('Vui lòng điền các thông tin bắt buộc (*).');
            return;
        }

        mutation.mutate(formData);
    };

    return (
        <>
            {createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
                    
                    <div className="relative bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transform transition-all">
                        <div className="flex items-center justify-between p-5 border-b border-white/5 shrink-0 bg-slate-900">
                            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                                <Home size={18} className="text-emerald-500" />
                                {isEdit ? 'Chỉnh sửa Phòng' : 'Thêm Phòng mới'}
                            </h2>
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-200 transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-lg border border-white/5">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-5 overflow-y-auto space-y-5">
                            {errorMsg && <Alert type="error" message={errorMsg} />}

                            <div className="space-y-4 text-left">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">Mã/Tên phòng <span className="text-rose-500">*</span></label>
                                    <input 
                                        type="text" 
                                        name="roomNumber"
                                        value={formData.roomNumber}
                                        onChange={handleChange}
                                        placeholder="VD: P.101, 202A..."
                                        className="w-full bg-black/40 border border-white/10 text-sm text-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Building Select - Only strictly required for creating flows, or if they want to change building */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-1.5"><MapPin size={16}/> Cơ sở/Tòa nhà {!isEdit && <span className="text-rose-500">*</span>}</label>
                                        <select 
                                            value={selectedBuildingId}
                                            onChange={handleBuildingChange}
                                            className="w-full bg-black/40 text-slate-200 border border-white/10 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all appearance-none"
                                        >
                                            <option value="" className="bg-slate-900 text-slate-500">-- Chọn Cơ sở --</option>
                                            {buildings.map((b: any) => (
                                                <option key={b.buildingId} value={b.buildingId} className="bg-slate-900 text-slate-200">{b.buildingName}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-1.5"><Layers size={16}/> Tầng <span className="text-rose-500">*</span></label>
                                        <select 
                                            name="floorId"
                                            value={formData.floorId}
                                            onChange={handleChange}
                                            className="w-full bg-black/40 text-slate-200 border border-white/10 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all appearance-none"
                                        >
                                            <option value="" className="bg-slate-900 text-slate-500">-- Chọn Tầng --</option>
                                            {/* If Editing and they haven't picked a building, show existing floor. If they pick building, show new floors. */}
                                            {isEdit && !selectedBuildingId && room.floorId && (
                                                <option value={room.floorId} className="bg-slate-900 text-slate-200">{room.floorName} ({room.buildingName})</option>
                                            )}
                                            {floors.map((f: any) => (
                                                <option key={f.floorId} value={f.floorId} className="bg-slate-900 text-slate-200">{f.floorName}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <label className="text-sm font-medium text-slate-400 flex items-center gap-1.5"><Tag size={16}/> Loại phòng <span className="text-rose-500">*</span></label>
                                        <button 
                                            type="button" 
                                            onClick={() => setIsTypeModalOpen(true)}
                                            className="text-xs text-emerald-500 hover:text-emerald-400 font-medium flex items-center transition-colors">
                                            <Plus size={12} className="mr-0.5"/> Tạo loại mới
                                        </button>
                                    </div>
                                    <select 
                                        name="roomTypeId"
                                        value={formData.roomTypeId}
                                        onChange={handleChange}
                                        className="w-full bg-black/40 text-slate-200 border border-white/10 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all appearance-none"
                                    >
                                        <option value="" className="bg-slate-900 text-slate-500">-- Chọn Loại Phòng --</option>
                                        {roomTypes.map((rt: any) => (
                                            <option key={rt.roomTypeId} value={rt.roomTypeId} className="bg-slate-900 text-slate-200">
                                                {rt.typeName} - {new Intl.NumberFormat('vi-VN').format(rt.basePrice)}đ
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {isEdit && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1.5">Trạng thái phòng</label>
                                        <select 
                                            name="currentStatus"
                                            value={formData.currentStatus}
                                            onChange={handleChange}
                                            className="w-full bg-black/40 text-slate-200 border border-white/10 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all appearance-none"
                                        >
                                            <option value="AVAILABLE" className="bg-slate-900">Trống</option>
                                            <option value="OCCUPIED" className="bg-slate-900">Đang thuê</option>
                                            <option value="MAINTENANCE" className="bg-slate-900">Bảo trì</option>
                                            <option value="BOOKED" className="bg-slate-900">Đã đặt cọc</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-5 border-t border-white/5 flex justify-end gap-3 bg-slate-900 shrink-0">
                            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all">
                                Hủy bỏ
                            </button>
                            <button onClick={handleSubmit} disabled={mutation.isPending} className="px-5 py-2.5 flex items-center gap-2 text-sm font-semibold text-emerald-950 bg-emerald-500 hover:bg-emerald-400 rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] disabled:opacity-70 disabled:cursor-not-allowed">
                                {mutation.isPending ? <Loader2 size={16} className="animate-spin" /> : isEdit ? 'Lưu thay đổi' : 'Tạo Phòng'}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {isTypeModalOpen && (
                <RoomTypeModal 
                    onClose={() => setIsTypeModalOpen(false)} 
                    onSuccess={(newType) => {
                        setFormData(prev => ({ ...prev, roomTypeId: newType.roomTypeId }));
                    }}
                />
            )}
        </>
    );
}
