import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Service } from '../../../types/service';

interface Props {
    service: Service | null;
    onClose: () => void;
}

export default function ServiceModal({ service, onClose }: Props) {
    const isEdit = !!service;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            
            <div className="relative bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg shadow-2xl">
                <div className="flex items-center justify-between p-5 border-b border-slate-800">
                    <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                        {isEdit ? 'Chỉnh sửa Dịch vụ' : 'Thêm Dịch vụ mới'}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-200 transition-colors bg-slate-800 hover:bg-slate-700 p-1.5 rounded-lg border border-slate-700">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-5 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5">Tên dịch vụ</label>
                        <input 
                            type="text" 
                            defaultValue={service?.name || ''}
                            placeholder="Ví dụ: Điện sinh hoạt"
                            className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-500"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Cách tính (Loại)</label>
                            <select 
                                defaultValue={service?.type || 'FIXED'}
                                className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                            >
                                <option value="FIXED">Cố định (hàng tháng)</option>
                                <option value="METERED">Phụ thuộc chỉ số (Mét khối, kWh)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Đơn vị tính</label>
                            <input 
                                type="text" 
                                defaultValue={service?.unit || ''}
                                placeholder="Ví dụ: kWh, Người..."
                                className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5">Đơn giá cơ sở (VNĐ)</label>
                        <div className="relative">
                            <input 
                                type="number" 
                                defaultValue={service?.basePrice || ''}
                                placeholder="0"
                                className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-mono placeholder:text-slate-500"
                            />
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500 text-sm font-medium">
                                VNĐ
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5">Trạng thái</label>
                        <select 
                            defaultValue={service?.status || 'ACTIVE'}
                            className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                        >
                            <option value="ACTIVE">Đang cung cấp</option>
                            <option value="INACTIVE">Khóa / Ngừng cung cấp</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5">Ghi chú / Mô tả</label>
                        <textarea 
                            defaultValue={service?.description || ''}
                            rows={3}
                            placeholder="Mô tả công năng dịch vụ..."
                            className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-500 resize-none"
                        />
                    </div>
                </div>

                <div className="p-5 border-t border-slate-800 flex justify-end gap-3 bg-slate-900/50 rounded-b-xl">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors">
                        Hủy
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                        {isEdit ? 'Lưu thay đổi' : 'Thêm dịch vụ'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
