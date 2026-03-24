import { Zap, Droplets, Wifi, Trash2, ShieldCheck, HelpCircle } from 'lucide-react';

interface Service {
    id: number;
    name: string;
    type: string;
    unit: string;
    price: number;
}

interface ServicesCardProps {
    services: Service[];
}

export default function ServicesCard({ services }: ServicesCardProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const getIcon = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes('điện') || n.includes('electric')) return <Zap className="h-4 w-4 text-yellow-400" />;
        if (n.includes('nước') || n.includes('water')) return <Droplets className="h-4 w-4 text-blue-400" />;
        if (n.includes('mạng') || n.includes('internet') || n.includes('wifi')) return <Wifi className="h-4 w-4 text-emerald-400" />;
        if (n.includes('rác') || n.includes('trash')) return <Trash2 className="h-4 w-4 text-slate-400" />;
        if (n.includes('an ninh') || n.includes('security')) return <ShieldCheck className="h-4 w-4 text-purple-400" />;
        return <HelpCircle className="h-4 w-4 text-slate-400" />;
    };

    return (
        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden shadow-lg">
            <div className="p-5 border-b border-slate-700/50 bg-slate-800/80">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <Zap className="h-5 w-5 text-amber-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-100">Dịch vụ & Tiện ích</h3>
                </div>
            </div>
            
            <div className="px-5 py-2">
                {services.map((service, index) => (
                    <div 
                        key={service.id} 
                        className={`flex items-center justify-between py-3.5 ${
                            index !== services.length - 1 ? 'border-b border-slate-700/50' : ''
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-slate-700/40 border border-slate-600/30">
                                {getIcon(service.name)}
                            </div>
                            <span className="text-sm font-medium text-slate-200">{service.name}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-sm font-semibold text-slate-100">{formatCurrency(service.price)}</span>
                            <span className="text-xs text-slate-500 ml-1">/{service.unit}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
