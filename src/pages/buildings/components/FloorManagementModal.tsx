import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, Layers, Plus, Search, HelpCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { buildingService } from '../../../services/building';
import Alert from '../../../components/ui/Alert';

interface Props {
    building: any;
    onClose: () => void;
}

export default function FloorManagementModal({ building, onClose }: Props) {
    const queryClient = useQueryClient();
    const [floorName, setFloorName] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const { data: responseData, isLoading } = useQuery({
        queryKey: ['floors', building.buildingId],
        queryFn: () => buildingService.getFloorsByBuilding(building.buildingId)
    });

    const floors = responseData?.result || [];
    
    // Sort floors by name conceptually if they have numbers, or just alphabetically 
    const sortedFloors = [...floors].sort((a: any, b: any) => 
        a.floorName.localeCompare(b.floorName, undefined, { numeric: true })
    );

    const filteredFloors = sortedFloors.filter((f: any) => 
        (f.floorName || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const createMutation = useMutation({
        mutationFn: (data: { floorName: string, buildingId: number }) => buildingService.createFloor(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['floors', building.buildingId] });
            // Also invalidate buildings list so the totalFloors count can update if backend increments it
            queryClient.invalidateQueries({ queryKey: ['buildings'] });
            setFloorName('');
            setErrorMsg('');
        },
        onError: (err: any) => {
            setErrorMsg(err.response?.data?.message || 'Có lỗi xảy ra khi tạo tầng mới.');
        }
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        if (!floorName.trim()) {
            setErrorMsg('Vui lòng nhập tên tầng hợp lệ.');
            return;
        }

        createMutation.mutate({ 
            floorName: floorName.trim(), 
            buildingId: building.buildingId 
        });
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-end p-0 md:p-4 font-sans">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            
            {/* Side Panel Modal */}
            <div className="relative bg-slate-900 md:border md:border-white/10 md:rounded-2xl w-full max-w-md h-[100dvh] md:h-[95vh] shadow-2xl flex flex-col overflow-hidden transform transition-transform slide-in-right">
                <div className="flex items-center justify-between p-5 border-b border-white/5 shrink-0 bg-blue-950/20">
                    <div>
                        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                            <Layers size={18} className="text-blue-400" /> Quản lý Tầng
                        </h2>
                        <p className="text-sm text-slate-400 mt-0.5 truncate max-w-[250px]">{building.buildingName}</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-slate-400 hover:text-rose-400 transition-colors bg-white/5 hover:bg-rose-500/10 p-2 rounded-xl border border-white/5">
                        <X size={18} />
                    </button>
                </div>

                <div className="flex flex-col flex-1 overflow-hidden">
                    {/* Create New Floor Form */}
                    <div className="p-5 border-b border-white/5 bg-slate-900 shrink-0 shadow-lg z-10">
                        {errorMsg && (
                            <Alert type="error" message={errorMsg} className="mb-4 shadow-none py-2" />
                        )}

                        <form onSubmit={handleCreate} className="flex gap-2 relative">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">Tên:</span>
                                <input 
                                    type="text" 
                                    value={floorName}
                                    onChange={(e) => setFloorName(e.target.value)}
                                    placeholder="VD: Tầng 1..."
                                    className="w-full bg-black/40 border border-white/10 text-sm text-slate-200 rounded-xl pl-12 pr-4 py-2.5 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-medium"
                                    disabled={createMutation.isPending}
                                />
                            </div>
                            <button 
                                type="submit"
                                disabled={createMutation.isPending || !floorName.trim()}
                                className="px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-[0_0_10px_rgba(37,99,235,0.3)]">
                                {createMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                                <span className="hidden sm:inline">Thêm</span>
                            </button>
                        </form>
                    </div>

                    {/* Floor List Area */}
                    <div className="flex-1 overflow-y-auto bg-slate-900/50 p-4">
                        <div className="relative mb-5">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input
                                type="text"
                                placeholder="Lọc nhanh danh sách tầng..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-black/20 border-b border-white/5 text-slate-300 pl-9 pr-4 py-2 focus:outline-none focus:border-blue-500/50 transition-colors text-sm placeholder:text-slate-600"
                            />
                        </div>

                        {isLoading ? (
                            <div className="space-y-3">
                                {Array.from({ length: 4 }).map((_, idx) => (
                                    <div key={idx} className="bg-white/5 border border-white/5 p-4 rounded-xl animate-pulse flex items-center justify-between">
                                        <div className="flex flex-col gap-2">
                                            <div className="w-20 h-4 bg-white/10 rounded"></div>
                                            <div className="w-32 h-3 bg-white/10 rounded"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredFloors.length === 0 ? (
                            <div className="py-12 flex flex-col items-center justify-center text-slate-500 border border-dashed border-white/10 bg-white/[0.02] rounded-2xl mx-1 text-center font-medium">
                                <HelpCircle size={40} className="mb-3 opacity-20" />
                                <p>Chưa có tầng nào được tạo.</p>
                                <p className="text-xs text-slate-600 mt-1 max-w-[200px]">Hãy thêm một tầng mới ở khung bên trên để quản lý các phòng sau này.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {filteredFloors.map((f: any) => (
                                    <div key={f.floorId} className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-xl p-4 flex items-center justify-between group transition-all duration-200">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner group-hover:scale-105 transition-transform duration-300 font-bold shrink-0">
                                                {f.floorName.match(/\d+/) ? f.floorName.match(/\d+/)[0] : 'T'}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-200">{f.floorName}</span>
                                                <span className="text-xs text-slate-500 font-mono">ID: {f.floorId}</span>
                                            </div>
                                        </div>
                                        
                                        <button 
                                            title="Sửa (Coming soon)"
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-30">
                                            ...
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .slide-in-right {
                    animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </div>,
        document.body
    );
}
