import { useState, FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assetService, AssetRequest } from '../../../services/asset';
import Alert from '../../../components/ui/Alert';
import { X, Loader2, Calendar as CalendarIcon } from 'lucide-react';
// @ts-ignore
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Props {
    assetToEdit?: any;
    onClose: () => void;
}

export default function AssetModal({ assetToEdit, onClose }: Props) {
    const isEdit = !!assetToEdit;
    const queryClient = useQueryClient();

    const [assetName, setAssetName] = useState(assetToEdit?.assetName || '');
    const [assetCode, setAssetCode] = useState(assetToEdit?.assetCode || '');
    const [purchasePrice, setPurchasePrice] = useState<number | ''>(assetToEdit?.purchasePrice || '');
    const [purchaseDate, setPurchaseDate] = useState<Date | null>(assetToEdit?.purchaseDate ? new Date(assetToEdit.purchaseDate) : new Date());
    const [errorMsg, setErrorMsg] = useState('');

    const mutation = useMutation({
        mutationFn: (payload: AssetRequest) => isEdit 
            ? assetService.updateAsset(assetToEdit.assetId, payload)
            : assetService.createAsset(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assets'] });
            onClose();
        },
        onError: (err: any) => {
            setErrorMsg(err.response?.data?.message || `Có lỗi xảy ra khi ${isEdit ? 'cập nhật' : 'tạo'} tài sản.`);
        }
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        if (!assetName.trim()) { setErrorMsg('Tên tài sản không được để trống'); return; }

        mutation.mutate({
            assetName,
            assetCode: assetCode ? assetCode : undefined,
            purchasePrice: purchasePrice ? Number(purchasePrice) : undefined,
            purchaseDate: purchaseDate ? purchaseDate.toISOString().split('T')[0] : undefined
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
                        {isEdit ? 'Chỉnh sửa Tài Sản' : 'Tạo Danh Mục Tài Sản'}
                    </h2>
                    <button 
                        onClick={onClose}
                        disabled={mutation.isPending}
                        className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-5 overflow-y-auto">
                    {errorMsg && <Alert type="error" message={errorMsg} className="mb-4" />}

                    <form id="asset-form" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Tên tài sản <span className="text-rose-500">*</span></label>
                            <input 
                                type="text"
                                placeholder="VD: Điều hòa Daikin 9000BTU"
                                className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
                                value={assetName}
                                onChange={(e) => setAssetName(e.target.value)}
                                disabled={mutation.isPending}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Mã tài sản</label>
                            <input 
                                type="text"
                                placeholder="VD: DHKK-001"
                                className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 font-mono"
                                value={assetCode}
                                onChange={(e) => setAssetCode(e.target.value)}
                                disabled={mutation.isPending}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Giá mua (VNĐ)</label>
                            <input 
                                type="number"
                                className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 font-mono text-emerald-400"
                                value={purchasePrice}
                                onChange={(e) => setPurchasePrice(Number(e.target.value))}
                                disabled={mutation.isPending}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Ngày mua</label>
                            <div className="relative">
                                <DatePicker
                                    selected={purchaseDate}
                                    onChange={(date: Date | null) => setPurchaseDate(date)}
                                    dateFormat="dd/MM/yyyy"
                                    className="w-full bg-slate-950/50 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-200 px-4 py-2.5 rounded-xl text-sm transition-all shadow-inner placeholder:text-slate-600 pl-10"
                                    disabled={mutation.isPending}
                                />
                                <CalendarIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                            </div>
                        </div>
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
                        form="asset-form"
                        disabled={mutation.isPending}
                        className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                    >
                        {mutation.isPending && <Loader2 size={16} className="animate-spin" />}
                        {isEdit ? 'Cập nhật' : 'Tạo Tài Sản'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
