import { useState, FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, Info } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assetService } from '../../../services/asset';
import { roomService } from '../../../services/room';
import Alert from '../../../components/ui/Alert';

interface Props {
    buildingId: number;
    mode?: 'ASSIGN' | 'REMOVE';
    onClose: () => void;
}

export default function BulkRoomAssetModal({ buildingId, mode = 'ASSIGN', onClose }: Props) {
    const queryClient = useQueryClient();

    const [assetId, setAssetId] = useState<number | ''>('');
    const [roomTypeId, setRoomTypeId] = useState<number | ''>('');
    const [quantity, setQuantity] = useState<number | ''>(1);
    const [conditionStatus, setConditionStatus] = useState('GOOD');
    const [errorMsg, setErrorMsg] = useState('');

    // Fetch Global Assets
    const { data: assetsData, isLoading: isLoadingAssets } = useQuery({
        queryKey: ['assets'],
        queryFn: () => assetService.getAllAssets()
    });
    const globalAssets = assetsData?.result || [];

    // Fetch Room Types
    const { data: roomTypesData, isLoading: isLoadingRoomTypes } = useQuery({
        queryKey: ['room-types'],
        queryFn: () => roomService.getRoomTypes()
    });
    const roomTypes = roomTypesData?.result || [];

    const mutation = useMutation({
        mutationFn: (payload: any) => {
            if (mode === 'REMOVE') {
                return assetService.bulkRemoveAssets(payload);
            }
            return assetService.bulkAssignAssets(payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['room-assets'] });
            onClose();
        },
        onError: (err: any) => {
            setErrorMsg(err.response?.data?.message || 'Có lỗi xảy ra khi gán tài sản hàng loạt.');
        }
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        if (!assetId) { setErrorMsg('Vui lòng chọn tài sản chung'); return; }
        if (!quantity || quantity < 1) { setErrorMsg('Số lượng không hợp lệ'); return; }

        mutation.mutate({
            buildingId,
            assetId: Number(assetId),
            roomTypeId: roomTypeId ? Number(roomTypeId) : undefined,
            quantity: Number(quantity),
            conditionStatus
        });
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans bg-slate-900/80 backdrop-blur-sm">
            <div 
                className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        {mode === 'REMOVE' ? 'Gỡ Tài Sản Hàng Loạt' : 'Gán Tài Sản Hàng Loạt'}
                    </h2>
                    <button 
                        onClick={onClose}
                        disabled={mutation.isPending}
                        className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-5 overflow-y-auto">
                    <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${mode === 'REMOVE' ? 'bg-rose-500/10 border border-rose-500/20' : 'bg-emerald-500/10 border border-emerald-500/20'}`}>
                        <Info className={`${mode === 'REMOVE' ? 'text-rose-500' : 'text-emerald-500'} shrink-0 mt-0.5`} size={18} />
                        <div className="text-sm text-slate-300 leading-relaxed">
                            {mode === 'REMOVE' 
                                ? 'Tính năng này sẽ gỡ bỏ tài sản được chọn khỏi tất cả các phòng thuộc tòa nhà hiện tại.'
                                : 'Tính năng này sẽ gán tài sản được chọn vào tất cả các phòng thuộc tòa nhà hiện tại. Bạn có thể lọc theo loại phòng nếu cần.'
                            }
                        </div>
                    </div>

                    {errorMsg && <Alert type="error" message={errorMsg} className="mb-4" />}

                    <form id="bulk-room-asset-form" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Tài sản <span className="text-rose-500">*</span></label>
                            <select 
                                className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
                                value={assetId}
                                onChange={(e) => setAssetId(Number(e.target.value))}
                                disabled={mutation.isPending || isLoadingAssets}
                            >
                                <option value="">-- Chọn danh mục tài sản --</option>
                                {globalAssets.map((a: any) => (
                                    <option key={a.assetId} value={a.assetId}>
                                        {a.assetName} {a.assetCode ? `(${a.assetCode})` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Loại phòng (Tùy chọn)</label>
                            <select 
                                className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
                                value={roomTypeId}
                                onChange={(e) => setRoomTypeId(e.target.value ? Number(e.target.value) : '')}
                                disabled={mutation.isPending || isLoadingRoomTypes}
                            >
                                <option value="">-- Tất cả loại phòng --</option>
                                {roomTypes.map((rt: any) => (
                                    <option key={rt.roomTypeId} value={rt.roomTypeId}>{rt.typeName}</option>
                                ))}
                            </select>
                        </div>
                        
                        {mode === 'ASSIGN' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Số lượng <span className="text-rose-500">*</span></label>
                                    <input 
                                        type="number"
                                        min="1"
                                        className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 font-mono"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        disabled={mutation.isPending}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Tình trạng <span className="text-rose-500">*</span></label>
                                    <select 
                                        className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
                                        value={conditionStatus}
                                        onChange={(e) => setConditionStatus(e.target.value)}
                                        disabled={mutation.isPending}
                                    >
                                        <option value="GOOD">Sử dụng tốt (GOOD)</option>
                                        <option value="MAINTENANCE">Đang bảo trì (MAINTENANCE)</option>
                                        <option value="BROKEN">Hỏng hóc (BROKEN)</option>
                                        <option value="LOST">Thất lạc (LOST)</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                <div className="p-5 border-t border-slate-800 flex justify-end gap-3 bg-slate-900/50 rounded-b-2xl shrink-0">
                    <button 
                        type="button"
                        onClick={onClose}
                        disabled={mutation.isPending}
                        className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors disabled:opacity-50"
                    >
                        Hủy
                    </button>
                    <button 
                        type="submit"
                        form="bulk-room-asset-form"
                        disabled={mutation.isPending || (mode === 'ASSIGN' && !quantity)}
                        className={`px-5 py-2.5 text-sm font-medium text-white rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg ${
                            mode === 'REMOVE' 
                                ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/20' 
                                : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20'
                        }`}
                    >
                        {mutation.isPending && <Loader2 size={16} className="animate-spin" />}
                        {mode === 'REMOVE' ? 'Gỡ Hàng Loạt' : 'Gán Hàng Loạt'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
