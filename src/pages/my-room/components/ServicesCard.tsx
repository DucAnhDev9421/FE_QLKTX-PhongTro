import { Zap, Droplets, Wifi, Trash2, ShieldCheck, HelpCircle, Snowflake } from 'lucide-react';

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
        return new Intl.NumberFormat('vi-VN').format(amount);
    };

    const getServiceMeta = (name: string): { icon: JSX.Element; color: string; bgColor: string } => {
        const n = name.toLowerCase();
        if (n.includes('điện') || n.includes('electric')) return { 
            icon: <Zap className="h-4 w-4" />, color: 'text-yellow-400', bgColor: 'bg-yellow-500/10 border-yellow-500/20' 
        };
        if (n.includes('nước') || n.includes('water')) return { 
            icon: <Droplets className="h-4 w-4" />, color: 'text-blue-400', bgColor: 'bg-blue-500/10 border-blue-500/20' 
        };
        if (n.includes('mạng') || n.includes('internet') || n.includes('wifi')) return { 
            icon: <Wifi className="h-4 w-4" />, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10 border-emerald-500/20' 
        };
        if (n.includes('rác') || n.includes('trash')) return { 
            icon: <Trash2 className="h-4 w-4" />, color: 'text-slate-400', bgColor: 'bg-slate-500/10 border-slate-500/20' 
        };
        if (n.includes('an ninh') || n.includes('security') || n.includes('bảo vệ')) return { 
            icon: <ShieldCheck className="h-4 w-4" />, color: 'text-purple-400', bgColor: 'bg-purple-500/10 border-purple-500/20' 
        };
        if (n.includes('máy lạnh') || n.includes('air') || n.includes('điều hòa')) return { 
            icon: <Snowflake className="h-4 w-4" />, color: 'text-cyan-400', bgColor: 'bg-cyan-500/10 border-cyan-500/20' 
        };
        return { 
            icon: <HelpCircle className="h-4 w-4" />, color: 'text-slate-400', bgColor: 'bg-slate-500/10 border-slate-500/20' 
        };
    };

    return (
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <Zap className="h-4.5 w-4.5 text-amber-400" />
                    </div>
                    <h3 className="text-base font-bold text-slate-100">Dịch vụ & Tiện ích</h3>
                </div>
            </div>
            
            <div className="p-4 space-y-1">
                {services.map((service) => {
                    const { icon, color, bgColor } = getServiceMeta(service.name);
                    return (
                        <div 
                            key={service.id} 
                            className="flex items-center justify-between p-3 hover:bg-slate-800/50 rounded-xl transition-all duration-200 group cursor-default"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2.5 rounded-xl border ${bgColor} ${color} group-hover:scale-105 transition-transform duration-200`}>
                                    {icon}
                                </div>
                                <span className="text-sm font-medium text-slate-200">{service.name}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-bold text-slate-100">{formatCurrency(service.price)} <span className="text-xs font-normal text-slate-500">đ</span></span>
                                <span className="text-xs text-slate-500 ml-0.5">/{service.unit}</span>
                            </div>
                        </div>
                    );
                })}
                
                {services.length === 0 && (
                    <div className="py-8 text-center">
                        <Zap className="h-10 w-10 text-slate-700 mx-auto mb-3" />
                        <p className="text-sm text-slate-500">Chưa có dịch vụ</p>
                    </div>
                )}
            </div>
        </div>
    );
}
