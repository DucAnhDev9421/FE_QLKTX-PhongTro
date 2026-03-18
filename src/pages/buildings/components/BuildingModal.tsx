import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Building as BuildingType } from '../../../types/building';

interface Props {
    building: BuildingType | null;
    onClose: () => void;
}

export default function BuildingModal({ building, onClose }: Props) {
    const isEdit = !!building;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg shadow-2xl">
                <div className="flex items-center justify-between p-5 border-b border-slate-800">
                    <h2 className="text-lg font-bold text-slate-100">
                        {isEdit ? 'Chỉnh sửa tòa nhà' : 'Thêm tòa nhà mới'}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-200 transition-colors bg-slate-800 hover:bg-slate-700 p-1.5 rounded-lg border border-slate-700">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-5 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5">Tên tòa nhà</label>
                        <input 
                            type="text" 
                            defaultValue={building?.name || ''}
                            placeholder="Nhập tên tòa nhà..."
                            className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5">Địa chỉ</label>
                        <input 
                            type="text" 
                            defaultValue={building?.address || ''}
                            placeholder="Nhập địa chỉ đầy đủ..."
                            className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-500"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Số tầng</label>
                            <input 
                                type="number" 
                                defaultValue={building?.numberOfFloors || ''}
                                placeholder="0"
                                className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Tổng số phòng</label>
                            <input 
                                type="number" 
                                defaultValue={building?.totalRooms || ''}
                                placeholder="0"
                                className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5">Trạng thái</label>
                        <select 
                            defaultValue={building?.status || 'ACTIVE'}
                            className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                        >
                            <option value="ACTIVE">Hoạt động</option>
                            <option value="MAINTENANCE">Đang bảo trì</option>
                            <option value="INACTIVE">Ngưng hoạt động</option>
                        </select>
                    </div>
                </div>

                <div className="p-5 border-t border-slate-800 flex justify-end gap-3 bg-slate-900/50 rounded-b-xl">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors">
                        Hủy bỏ
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                        {isEdit ? 'Cập nhật' : 'Thêm mới'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
