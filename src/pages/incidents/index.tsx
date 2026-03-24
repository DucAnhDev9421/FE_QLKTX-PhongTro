import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Layout } from '../../components/layout';
import { Search, Activity, Loader2, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { incidentService } from '../../services/incidentService';

export default function Incidents() {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const { data: incidentsList, isLoading } = useQuery({
        queryKey: ['incidents'],
        queryFn: () => incidentService.getAllIncidents(),
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: number, status: string }) => 
            incidentService.updateIncidentStatus(id, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['incidents'] });
        },
        onError: (err: any) => {
            alert(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái.');
        }
    });

    const handleStatusChange = (id: number, newStatus: string) => {
        updateStatusMutation.mutate({ id, status: newStatus });
    };

    const incidentData = Array.isArray(incidentsList) ? incidentsList : [];

    const filteredIncidents = incidentData.filter((i: any) => 
        (statusFilter === '' || i.status === statusFilter) &&
        (i.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         i.room?.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         i.tenant?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <Layout>
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100 mb-1">Sự cố & Phản hồi</h1>
                    <p className="text-slate-400 text-sm">Quản lý và cập nhật trạng thái các báo cáo hư hỏng từ người thuê.</p>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-visible min-h-[500px]">
                <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/50">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Tra cứu phòng, người báo cáo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 text-sm text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-500 font-mono"
                        />
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-slate-950 border border-slate-700 text-sm text-slate-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500 cursor-pointer outline-none font-medium"
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="PENDING">Chờ xử lý (Pending)</option>
                            <option value="IN_PROGRESS">Đang xử lý (In Progress)</option>
                            <option value="RESOLVED">Đã hoàn thành (Resolved)</option>
                        </select>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 size={32} className="animate-spin text-emerald-500" />
                    </div>
                ) : filteredIncidents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                        <Activity size={48} className="mb-4 opacity-20" />
                        <p>Không tìm thấy sự cố nào phù hợp.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto overflow-y-visible">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-950 border-b border-slate-800">
                                <tr>
                                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Mã SC</th>
                                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Phòng / Người báo</th>
                                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Nội dung</th>
                                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Ngày báo</th>
                                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-center">Trạng Thái</th>
                                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-center">Cập nhật</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredIncidents.map((incident: any) => (
                                    <tr key={incident.incidentId} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-4 align-top">
                                            <span className="font-mono text-slate-200 font-medium text-xs">#{incident.incidentId}</span>
                                        </td>
                                        <td className="px-6 py-4 align-top">
                                            <div className="font-medium text-slate-200">{incident.room?.roomNumber || 'Không rõ'}</div>
                                            <div className="text-xs text-slate-500 mt-1">{incident.tenant?.fullName || 'Hệ thống'}</div>
                                        </td>
                                        <td className="px-6 py-4 align-top max-w-xs">
                                            <div className="text-slate-300 break-words line-clamp-2" title={incident.description}>
                                                {incident.description}
                                            </div>
                                            {incident.priority && (
                                                <span className={`inline-block mt-2 text-[10px] uppercase px-1.5 py-0.5 rounded ${incident.priority === 'HIGH' ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-800 text-slate-400'}`}>
                                                    Mức độ: {incident.priority}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 align-top">
                                            <div className="text-slate-300 text-xs">
                                                {incident.createdDate ? format(new Date(incident.createdDate), 'dd/MM/yyyy HH:mm') : '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-top text-center">
                                            <IncidentStatusBadge status={incident.status} />
                                        </td>
                                        <td className="px-6 py-4 align-top text-center">
                                            <select 
                                                value={incident.status}
                                                onChange={(e) => handleStatusChange(incident.incidentId, e.target.value)}
                                                className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded p-1.5 focus:ring-1 focus:ring-emerald-500 outline-none cursor-pointer"
                                            >
                                                <option value="PENDING">Chờ xử lý</option>
                                                <option value="IN_PROGRESS">Đang xử lý</option>
                                                <option value="RESOLVED">Đã xong</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Layout>
    );
}

function IncidentStatusBadge({ status }: { status: string }) {
    let styles = '';
    let label = status;
    let Icon = Activity;

    switch (status) {
        case 'PENDING':
            styles = 'bg-rose-500/10 text-rose-500 border-rose-500/20';
            label = 'Chờ xử lý';
            Icon = AlertTriangle;
            break;
        case 'IN_PROGRESS':
            styles = 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            label = 'Đang xử lý';
            Icon = Clock;
            break;
        case 'RESOLVED':
            styles = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            label = 'Hoàn thành';
            Icon = CheckCircle;
            break;
        default:
            styles = 'bg-slate-800 text-slate-400 border-slate-700';
    }

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] uppercase tracking-wider font-bold border ${styles}`}>
            <Icon size={12} /> {label}
        </span>
    );
}
