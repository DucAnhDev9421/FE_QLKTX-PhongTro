import { useState, FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assetService, AssetRequest } from '../../../services/asset';
import Alert from '../../../components/ui/Alert';

interface Props {
    onClose: () => void;
}

export default function AssetModal({ onClose }: Props) {
    const queryClient = useQueryClient();

    const [assetName, setAssetName] = useState('');
    const [assetCode, setAssetCode] = useState('');
    const [purchasePrice, setPurchasePrice] = useState<number | ''>('');
    const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
    const [errorMsg, setErrorMsg] = useState('');

    const mutation = useMutation({
        mutationFn: (payload: AssetRequest) => assetService.createAsset(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assets'] });
            onClose();
        },
        onError: (err: any) => {
            setErrorMsg(err.response?.data?.message || 'Có lỗi xảy ra khi tạo tài sản.');
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
            purchaseDate: purchaseDate ? purchaseDate : undefined
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
                        Tạo Danh Mục Tài Sản
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
                            <input 
                                type="date"
                                className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
                                value={purchaseDate}
                                onChange={(e) => setPurchaseDate(e.target.value)}
                                disabled={mutation.isPending}
                            />
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
                        Tạo Tài Sản
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
