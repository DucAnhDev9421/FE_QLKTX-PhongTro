import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface Props {
    type?: AlertType;
    title?: string;
    message: string | React.ReactNode;
    onClose?: () => void;
    className?: string;
}

export default function Alert({ type = 'info', title, message, onClose, className = '' }: Props) {
    const stylesByType = {
        success: {
            container: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
            icon: <CheckCircle2 size={20} className="shrink-0 text-emerald-500" />
        },
        error: {
            container: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
            icon: <AlertCircle size={20} className="shrink-0 text-rose-500" />
        },
        warning: {
            container: 'bg-amber-500/10 border-amber-500/20 text-amber-500',
            icon: <AlertTriangle size={20} className="shrink-0 text-amber-500" />
        },
        info: {
            container: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
            icon: <Info size={20} className="shrink-0 text-blue-500" />
        }
    };

    const currentStyle = stylesByType[type];

    return (
        <div className={`flex gap-3 p-4 rounded-xl border ${currentStyle.container} ${className} relative overflow-hidden`}>
            {/* Subtle glow effect */}
            <div className="absolute top-0 left-0 w-1/2 h-full bg-white/5 blur-xl pointer-events-none transform -skew-x-12 translate-x-[-150%] animate-[shine_3s_infinite]" />
            
            {currentStyle.icon}
            
            <div className="flex-1 text-sm font-medium z-10">
                {title && <h4 className="font-bold mb-1">{title}</h4>}
                <div>{message}</div>
            </div>

            {onClose && (
                <button 
                    onClick={onClose}
                    className="p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0 self-start -mt-1 -mr-1 z-10">
                    <X size={16} />
                </button>
            )}
        </div>
    );
}
