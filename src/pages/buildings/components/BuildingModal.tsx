import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, Building, MapPin, Layers, UserCog } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { buildingService } from '../../../services/building';
import { userService } from '../../../services/user';
import Alert from '../../../components/ui/Alert';

interface Props {
    building: any | null;
    onClose: () => void;
}

export default function BuildingModal({ building, onClose }: Props) {
    const isEdit = !!building;
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        buildingName: building?.buildingName || '',
        address: building?.address || '',
        totalFloors: building?.totalFloors || '',
        managerId: building?.managerId || ''
    });

    const [errorMsg, setErrorMsg] = useState('');

    // Fetch managers (users with STAFF, ADMIN, OWNER)
    const { data: usersData, isLoading: isLoadingUsers } = useQuery({
        queryKey: ['users'],
        queryFn: () => userService.getUsers()
    });

    const managers = (usersData?.result || []).filter((u: any) => {
        const rName = (u.roleName || u.role?.roleName || '').toUpperCase();
        return rName === 'ADMIN' || rName === 'SCOPE_ADMIN' || 
               rName === 'OWNER' || rName === 'SCOPE_OWNER' || 
               rName === 'STAFF' || rName === 'SCOPE_STAFF';
    });

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            if (isEdit) {
                return buildingService.updateBuilding(building.buildingId, data);
            } else {
                const bRes = await buildingService.createBuilding(data);
                const buildingId = bRes.result?.buildingId;
                const totalFloors = Number(data.totalFloors) || 0;

                // Auto create floors if totalFloors is set
                if (buildingId && totalFloors > 0) {
                    const floorPromises = [];
                    for (let i = 1; i <= totalFloors; i++) {
                        floorPromises.push(
                            buildingService.createFloor({
                                buildingId,
                                floorName: `Tầng ${i}`
                            })
                        );
                    }
                    try {
                        await Promise.all(floorPromises);
                    } catch (e) {
                        console.error("Failed to auto-create some floors", e);
                        // We still return bRes because building was created successfully
                    }
                }
                
                return bRes;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['buildings'] });
            onClose();
        },
        onError: (err: any) => {
            setErrorMsg(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật tòa nhà.');
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: name === 'totalFloors' || name === 'managerId' ? Number(value) : value 
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        if (!formData.buildingName || !formData.address || !formData.totalFloors) {
            setErrorMsg('Vui lòng điền đầy đủ các thông tin bắt buộc.');
            return;
        }

        mutation.mutate(formData);
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transform transition-all">
                <div className="flex items-center justify-between p-5 border-b border-white/5 shrink-0 bg-slate-900">
                    <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                        {isEdit ? 'Chỉnh sửa Cơ sở' : 'Thêm Tòa nhà mới'}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-200 transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-lg border border-white/5">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-5 overflow-y-auto space-y-5">
                    {errorMsg && (
                        <Alert type="error" message={errorMsg} />
                    )}

                    <div className="space-y-4 text-left">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-1.5"><Building size={16}/> Tên tòa nhà <span className="text-rose-500">*</span></label>
                            <input 
                                type="text" 
                                name="buildingName"
                                value={formData.buildingName}
                                onChange={handleChange}
                                placeholder="VD: Tòa nhà A1, Block B..."
                                className="w-full bg-black/40 border border-white/10 text-sm text-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-1.5"><MapPin size={16}/> Địa chỉ <span className="text-rose-500">*</span></label>
                            <input 
                                type="text" 
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Nhập địa chỉ đầy đủ..."
                                className="w-full bg-black/40 border border-white/10 text-sm text-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600"
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-1.5"><Layers size={16}/> Số lượng tầng <span className="text-rose-500">*</span></label>
                                <input 
                                    type="number" 
                                    name="totalFloors"
                                    value={formData.totalFloors}
                                    onChange={handleChange}
                                    placeholder="0"
                                    min="1"
                                    className="w-full bg-black/40 border border-white/10 text-sm text-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600 font-mono"
                                />
                                {isEdit && <span className="text-[10px] text-amber-500 leading-tight block mt-1">Lưu ý: Đổi số tầng có thể ảnh hưởng đến kết cấu dữ liệu nếu nhỏ hơn thực tế.</span>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-1.5"><UserCog size={16}/> Người Quản lý</label>
                                <select 
                                    name="managerId"
                                    value={formData.managerId}
                                    onChange={handleChange}
                                    className="w-full bg-black/40 text-slate-200 border border-white/10 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all appearance-none"
                                >
                                    <option value="" className="bg-slate-900 text-slate-500">-- Chưa phân bổ --</option>
                                    {!isLoadingUsers && managers.map((m: any) => (
                                        <option key={m.userId} value={m.userId} className="bg-slate-900 text-slate-200">
                                            {m.fullName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-5 border-t border-white/5 flex justify-end gap-3 bg-slate-900 shrink-0">
                    <button 
                        onClick={onClose}
                        type="button"
                        className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all">
                        Hủy bỏ
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={mutation.isPending}
                        className="px-5 py-2.5 flex items-center gap-2 text-sm font-semibold text-emerald-950 bg-emerald-500 hover:bg-emerald-400 rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] disabled:opacity-70 disabled:cursor-not-allowed">
                        {mutation.isPending ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            isEdit ? 'Lưu thay đổi' : 'Tạo Tòa nhà'
                        )}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
