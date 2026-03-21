import { useState, FormEvent, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { meterService } from '../../../services/meter';
import Alert from '../../../components/ui/Alert';

interface Props {
    buildingId: number;
    serviceInfo: any; // The global service object
    currentPrice: number | null; // The existing price if any
    onClose: () => void;
}

export default function BuildingServiceModal({ buildingId, serviceInfo, currentPrice, onClose }: Props) {
    const queryClient = useQueryClient();
    const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const [unitPrice, setUnitPrice] = useState<string>('');

    useEffect(() => {
        if (currentPrice !== null && currentPrice !== undefined) {
            setUnitPrice(currentPrice.toString());
        } else {
            setUnitPrice('');
        }
    }, [currentPrice]);

    const mutation = useMutation({
        mutationFn: async (payload: any) => {
            return await meterService.upsertBuildingService(buildingId, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['building-services', buildingId] });
            setAlert({ type: 'success', message: 'Lưu đơn giá thành công!' });
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
        
        if (!unitPrice.trim()) {
            setAlert({ type: 'error', message: 'Vui lòng nhập đơn giá.' });
            return;
        }
        
        const priceNum = parseFloat(unitPrice);
        if (isNaN(priceNum) || priceNum < 0) {
            setAlert({ type: 'error', message: 'Đơn giá không hợp lệ.' });
            return;
        }

        mutation.mutate({
            serviceId: serviceInfo.serviceId,
            unitPrice: priceNum
        });
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            
            <div className="relative bg-slate-900 border border-slate-800 rounded-xl w-full max-w-sm shadow-2xl">
                <div className="flex items-center justify-between p-5 border-b border-slate-800">
                    <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                        Thiết lập Đơn giá
                    </h2>
                    <button 
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-200 transition-colors bg-slate-800 hover:bg-slate-700 p-1.5 rounded-lg border border-slate-700">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-5 space-y-4">
                        {alert && (
                            <Alert
                                type={alert.type}
                                message={alert.message}
                                onClose={() => setAlert(null)}
                            />
                        )}

                        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-800">
                            <p className="text-sm font-medium text-slate-300">Dịch vụ: <span className="text-emerald-400 font-bold">{serviceInfo.serviceName}</span></p>
                            <p className="text-xs text-slate-500 mt-1">Đơn vị: {serviceInfo.unit} • Trả theo: {serviceInfo.calculationMethod}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Áp dụng đơn giá (VNĐ)</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    value={unitPrice}
                                    onChange={(e) => setUnitPrice(e.target.value)}
                                    placeholder="Ví dụ: 3500"
                                    className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-mono placeholder:text-slate-500"
                                />
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500 text-sm font-medium">
                                    VNĐ/{serviceInfo.unit}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 border-t border-slate-800 flex justify-end gap-3 bg-slate-900/50 rounded-b-xl">
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
                            Lưu thiết lập
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
