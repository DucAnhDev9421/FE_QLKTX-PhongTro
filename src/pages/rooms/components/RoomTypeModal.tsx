import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, Tag, DollarSign, Maximize, Users, Check } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { roomService } from '../../../services/room';
import Alert from '../../../components/ui/Alert';

const AMENITIES = [
    'Điều hòa / Wi-Fi',
    'Tủ lạnh mini',
    'Tủ lạnh dung tích lớn',
    'Khu vực bếp nấu',
    'Lò vi sóng / Máy hút mùi',
    'Bàn ăn riêng biệt',
    'Sofa / Khu tiếp khách',
    'Bồn tắm nằm',
    'Máy pha cà phê',
    'Két sắt an toàn',
    'Ban công riêng',
    'Hệ thống Smart Home'
];

interface Props {
    roomType?: any | null;
    onClose: () => void;
    onSuccess?: (roomType: any) => void;
}

export default function RoomTypeModal({ roomType, onClose, onSuccess }: Props) {
    const isEdit = !!roomType;
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        typeName: roomType?.typeName || '',
        basePrice: roomType?.basePrice || '',
        area: roomType?.area || '',
        maxOccupancy: roomType?.maxOccupancy || '',
    });

    const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
        roomType?.description ? roomType.description.split(', ').filter(Boolean) : []
    );

    const [errorMsg, setErrorMsg] = useState('');

    const toggleAmenity = (amenity: string) => {
        setSelectedAmenities(prev => 
            prev.includes(amenity) 
                ? prev.filter(a => a !== amenity) 
                : [...prev, amenity]
        );
    };

    const mutation = useMutation({
        mutationFn: (data: any) => isEdit 
            ? roomService.updateRoomType(roomType.roomTypeId, data)
            : roomService.createRoomType(data),
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['roomTypes'] });
            if (onSuccess) onSuccess(res.result);
            onClose();
        },
        onError: (err: any) => {
            setErrorMsg(err.response?.data?.message || `Có lỗi xảy ra khi ${isEdit ? 'cập nhật' : 'tạo'} Loại phòng.`);
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: ['basePrice', 'area', 'maxOccupancy'].includes(name) ? (value === '' ? '' : Number(value)) : value 
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        if (!formData.typeName || formData.basePrice === '' || formData.maxOccupancy === '') {
            setErrorMsg('Vui lòng điền các thông tin bắt buộc (*).');
            return;
        }

        mutation.mutate({
            ...formData,
            description: selectedAmenities.join(', ')
        });
    };

    return createPortal(
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 font-sans text-left">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-slate-900 border border-emerald-500/20 rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transform transition-all">
                <div className="flex items-center justify-between p-5 border-b border-white/5 shrink-0 bg-slate-800/50">
                    <h2 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
                        <Tag size={18} /> {isEdit ? 'Chỉnh sửa Loại Phòng' : 'Thêm Loại Phòng Mới'}
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
                            <label className="block text-sm font-medium text-slate-400 mb-1.5 font-sans">Tên Loại Phòng <span className="text-rose-500">*</span></label>
                            <input 
                                type="text" 
                                name="typeName"
                                value={formData.typeName}
                                onChange={handleChange}
                                placeholder="VD: Phòng Đơn, Studio VIP..."
                                className="w-full bg-black/40 border border-white/10 text-sm text-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600 font-sans"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-1.5 font-sans"><DollarSign size={14}/> Giá thuê (VNĐ) <span className="text-rose-500">*</span></label>
                                <input 
                                    type="number" 
                                    name="basePrice"
                                    value={formData.basePrice}
                                    onChange={handleChange}
                                    placeholder="4000000"
                                    className="w-full bg-black/40 border border-white/10 text-sm text-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-mono placeholder:text-slate-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-1.5 font-sans"><Users size={14}/> Số người tối đa <span className="text-rose-500">*</span></label>
                                <input 
                                    type="number" 
                                    name="maxOccupancy"
                                    value={formData.maxOccupancy}
                                    onChange={handleChange}
                                    placeholder="2"
                                    className="w-full bg-black/40 border border-white/10 text-sm text-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-mono placeholder:text-slate-600 font-sans"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-1.5 font-sans"><Maximize size={14}/> Diện tích (m2)</label>
                            <input 
                                type="number" 
                                name="area"
                                value={formData.area}
                                onChange={handleChange}
                                placeholder="25"
                                className="w-full bg-black/40 border border-white/10 text-sm text-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-mono placeholder:text-slate-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-3 font-sans">Các tiện ích trong phòng</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {AMENITIES.map(amenity => {
                                    const isSelected = selectedAmenities.includes(amenity);
                                    return (
                                        <button
                                            key={amenity}
                                            type="button"
                                            onClick={() => toggleAmenity(amenity)}
                                            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border flex items-center justify-center gap-1.5 ${
                                                isSelected 
                                                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                                                    : 'bg-black/20 border-white/5 text-slate-500 hover:border-white/20'
                                            }`}
                                        >
                                            {isSelected && <Check size={12} />}
                                            {amenity}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-5 border-t border-white/5 flex justify-end gap-3 bg-slate-800/50 shrink-0 font-sans">
                    <button 
                        onClick={onClose}
                        type="button"
                        className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all font-sans">
                        Hủy
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={mutation.isPending}
                        className="px-5 py-2.5 flex items-center gap-2 text-sm font-semibold text-emerald-950 bg-emerald-500 hover:bg-emerald-400 rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] disabled:opacity-70 disabled:cursor-not-allowed font-sans">
                        {mutation.isPending ? <Loader2 size={16} className="animate-spin text-emerald-950" /> : isEdit ? 'Lưu thay đổi' : 'Tạo Loại Phòng'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
