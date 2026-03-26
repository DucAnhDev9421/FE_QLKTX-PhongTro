import { useQuery } from '@tanstack/react-query';
import { incidentService } from '../../../services/incidentService';
import { Clock, CheckCircle2, AlertTriangle, AlertCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface IncidentHistoryProps {
    tenantId: number;
}

export default function IncidentHistory({ tenantId }: IncidentHistoryProps) {
    const { data: incidents, isLoading } = useQuery({
        queryKey: ['myIncidents', tenantId],
        queryFn: () => incidentService.getIncidentsByTenant(tenantId),
        enabled: !!tenantId
    });

    if (isLoading) {
        return (
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 flex justify-center">
                <Loader2 className="animate-spin text-emerald-500" size={24} />
            </div>
        );
    }

    const incidentList = Array.isArray(incidents) ? incidents : [];

    return (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl overflow-hidden backdrop-blur-sm">
            <div className="p-6 border-b border-slate-800/60 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                        <AlertCircle size={20} className="text-orange-400" />
                        Lịch sử sự cố
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Theo dõi tiến độ xử lý các báo cáo của bạn</p>
                </div>
                <span className="px-2 py-1 rounded-lg bg-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider border border-slate-700">
                    {incidentList.length} Báo cáo
                </span>
            </div>

            <div className="divide-y divide-slate-800/40 max-h-[400px] overflow-y-auto custom-scrollbar">
                {incidentList.length === 0 ? (
                    <div className="p-10 text-center flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-800/50 flex items-center justify-center text-slate-600">
                            <Clock size={24} />
                        </div>
                        <p className="text-slate-500 text-sm">Chưa có báo cáo sự cố nào.</p>
                    </div>
                ) : (
                    incidentList.map((incident) => (
                        <div key={incident.incidentId} className="p-5 hover:bg-slate-800/20 transition-all group">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-mono text-slate-600 font-bold uppercase tracking-widest">
                                    #{incident.incidentId}
                                </span>
                                <StatusBadge status={incident.status} />
                            </div>
                            <p className="text-sm text-slate-300 line-clamp-2 mb-3 leading-relaxed">
                                {incident.description}
                            </p>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                <Clock size={12} />
                                {incident.reportedDate ? format(new Date(incident.reportedDate), 'dd/MM/yyyy HH:mm') : '-'}
                            </div>
                        </div>
                    ))
                ).reverse()}
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case 'PENDING':
            return (
                <span className="flex items-center gap-1 text-[10px] font-bold text-orange-400 uppercase bg-orange-400/5 px-2 py-0.5 rounded-full border border-orange-400/20">
                    <AlertTriangle size={10} /> Chờ xử lý
                </span>
            );
        case 'RESOLVED':
            return (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase bg-emerald-400/5 px-2 py-0.5 rounded-full border border-emerald-400/20">
                    <CheckCircle2 size={10} /> Đã xong
                </span>
            );
        default:
            return (
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase bg-slate-400/5 px-2 py-0.5 rounded-full border border-slate-400/20">
                    {status}
                </span>
            );
    }
}
