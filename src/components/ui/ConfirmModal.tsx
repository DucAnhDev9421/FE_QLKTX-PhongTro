import { createPortal } from 'react-dom';
import { AlertTriangle, X, Info } from 'lucide-react';

export type ConfirmType = 'danger' | 'warning' | 'info';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: ConfirmType;
    isLoading?: boolean;
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Xác nhận',
    cancelText = 'Hủy',
    type = 'danger',
    isLoading = false
}: Props) {
    if (!isOpen) return null;

    const stylesByType = {
        danger: {
            icon: <AlertTriangle className="text-rose-500" size={24} />,
            bgIcon: 'bg-rose-500/10 border-rose-500/20',
            btnConfirm: 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_15px_rgba(225,29,72,0.3)]',
        },
        warning: {
            icon: <AlertTriangle className="text-amber-500" size={24} />,
            bgIcon: 'bg-amber-500/10 border-amber-500/20',
            btnConfirm: 'bg-amber-500 hover:bg-amber-400 text-amber-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]',
        },
        info: {
            icon: <Info className="text-emerald-500" size={24} />,
            bgIcon: 'bg-emerald-500/10 border-emerald-500/20',
            btnConfirm: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]',
        }
    };

    const currentStyle = stylesByType[type];

    return createPortal(
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 font-sans backdrop-blur-sm bg-black/60 transition-opacity">
            <div className="relative bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm shadow-2xl transform transition-all overflow-hidden border border-white/10">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-lg border border-white/5">
                    <X size={18} />
                </button>
                
                <div className="p-6 pt-8 flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center border mb-5 shadow-inner ${currentStyle.bgIcon}`}>
                        {currentStyle.icon}
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-100 mb-2">{title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed mb-6">
                        {message}
                    </p>
                    
                    <div className="flex w-full gap-3 mt-2">
                        <button 
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-xl font-medium transition-colors disabled:opacity-50">
                            {cancelText}
                        </button>
                        <button 
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`flex-1 px-4 py-2.5 rounded-xl font-bold transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${currentStyle.btnConfirm}`}>
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
