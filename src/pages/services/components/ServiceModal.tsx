import { useState, FormEvent, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, Zap, Droplets, Wifi, Trash, Settings2, Flame, Wind, Shield, Monitor, Tv, Video, Phone, Battery, Home, Building, Car, Wrench, Briefcase, Camera, Key } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { meterService } from '../../../services/meter';
import Alert from '../../../components/ui/Alert';

const ICONS_LIST = [
    { name: 'Zap', curIcon: <Zap size={20} /> },
    { name: 'Droplets', curIcon: <Droplets size={20} /> },
    { name: 'Wifi', curIcon: <Wifi size={20} /> },
    { name: 'Trash', curIcon: <Trash size={20} /> },
    { name: 'Flame', curIcon: <Flame size={20} /> },
    { name: 'Wind', curIcon: <Wind size={20} /> },
    { name: 'Shield', curIcon: <Shield size={20} /> },
    { name: 'Monitor', curIcon: <Monitor size={20} /> },
    { name: 'Tv', curIcon: <Tv size={20} /> },
    { name: 'Video', curIcon: <Video size={20} /> },
    { name: 'Phone', curIcon: <Phone size={20} /> },
    { name: 'Battery', curIcon: <Battery size={20} /> },
    { name: 'Home', curIcon: <Home size={20} /> },
    { name: 'Building', curIcon: <Building size={20} /> },
    { name: 'Car', curIcon: <Car size={20} /> },
    { name: 'Wrench', curIcon: <Wrench size={20} /> },
    { name: 'Briefcase', curIcon: <Briefcase size={20} /> },
    { name: 'Camera', curIcon: <Camera size={20} /> },
    { name: 'Key', curIcon: <Key size={20} /> },
    { name: 'Settings2', curIcon: <Settings2 size={20} /> },
];

interface Props {
    service: any | null; // ServiceInfoResponse
    onClose: () => void;
}

export default function ServiceModal({ service, onClose }: Props) {
    const isEdit = !!service;
    const queryClient = useQueryClient();
    const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Form states
    const [serviceName, setServiceName] = useState('');
    const [unit, setUnit] = useState('');
    const [calculationMethod, setCalculationMethod] = useState('Khối lượng tiêu thụ');
    const [selectedIcon, setSelectedIcon] = useState('Settings2');

    useEffect(() => {
        if (service) {
            setServiceName(service.serviceName);
            setUnit(service.unit);
            setCalculationMethod(service.calculationMethod || 'Khối lượng tiêu thụ');
            setSelectedIcon(service.icon || 'Settings2');
        } else {
            setServiceName('');
            setUnit('');
            setCalculationMethod('Khối lượng tiêu thụ');
            setSelectedIcon('Settings2');
        }
    }, [service]);

    const mutation = useMutation({
        mutationFn: async (payload: any) => {
            if (isEdit) {
                return await meterService.updateService(service.serviceId, payload);
            } else {
                return await meterService.createService(payload);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
            setAlert({ type: 'success', message: `Đã ${isEdit ? 'cập nhật' : 'thêm'} dịch vụ thành công!` });
            setTimeout(() => {
                onClose();
            }, 1000);
        },
        onError: (error: any) => {
            setAlert({ type: 'error', message: error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.' });
        }
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        if (!serviceName.trim() || !unit.trim() || !calculationMethod.trim()) {
            setAlert({ type: 'error', message: 'Vui lòng điền đầy đủ các trường bắt buộc.' });
            return;
        }

        mutation.mutate({
            serviceName: serviceName.trim(),
            unit: unit.trim(),
            calculationMethod: calculationMethod.trim(),
            icon: selectedIcon
        });
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            
            <div className="relative bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
                    <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                        {isEdit ? 'Chỉnh sửa Dịch vụ' : 'Thêm Dịch vụ mới'}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-200 transition-colors bg-slate-800 hover:bg-slate-700 p-1.5 rounded-lg border border-slate-700">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
                    <div className="p-5 space-y-4 overflow-y-auto">
                        {alert && (
                            <Alert
                                type={alert.type}
                                message={alert.message}
                                onClose={() => setAlert(null)}
                            />
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Chọn biểu tượng đại diện</label>
                            <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 p-3 bg-slate-950/50 border border-slate-800 rounded-xl overflow-y-auto max-h-40 shadow-inner">
                                {ICONS_LIST.map((iconItem) => (
                                    <button
                                        type="button"
                                        key={iconItem.name}
                                        onClick={() => setSelectedIcon(iconItem.name)}
                                        className={`w-full aspect-square flex items-center justify-center rounded-lg border transition-all ${
                                            selectedIcon === iconItem.name 
                                            ? 'bg-emerald-500 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-105 z-10' 
                                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                                        }`}
                                        title={iconItem.name}
                                    >
                                        {iconItem.curIcon}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Tên dịch vụ <span className="text-rose-500">*</span></label>
                            <input 
                                type="text" 
                                value={serviceName}
                                onChange={(e) => setServiceName(e.target.value)}
                                placeholder="Ví dụ: Điện sinh hoạt"
                                className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-500"
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1.5">Cách tính (Loại)</label>
                                <select 
                                    value={calculationMethod}
                                    onChange={(e) => setCalculationMethod(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                >
                                    <option value="Số cố định">Số cố định hàng tháng</option>
                                    <option value="Khối lượng tiêu thụ">Căn cứ khối lượng (Mét khối, kWh)</option>
                                    <option value="Theo người">Tính theo Đầu người</option>
                                    <option value="Theo phòng">Tính theo Phòng</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1.5">Đơn vị tính <span className="text-rose-500">*</span></label>
                                <input 
                                    type="text" 
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value)}
                                    placeholder="Ví dụ: kWh, Người..."
                                    className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-500"
                                />
                            </div>
                        </div>

                        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-400 flex items-start gap-2">
                            <span className="font-bold flex-shrink-0">Lưu ý:</span>
                            Mức giá tiền cơ sở sẽ được gắn và định mức riêng tại Menu "Cấu hình theo Tòa nhà" chứ không đặt chung ở đây.
                        </div>
                    </div>

                    <div className="p-5 border-t border-slate-800 flex justify-end gap-3 bg-slate-900/50 rounded-b-xl shrink-0">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors">
                            Hủy
                        </button>
                        <button 
                            type="submit"
                            disabled={mutation.isPending}
                            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 flex justify-center items-center gap-2 rounded-lg transition-colors shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                            {mutation.isPending ? <Loader2 size={16} className="animate-spin" /> : null}
                            {isEdit ? 'Lưu thay đổi' : 'Thêm dịch vụ'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
