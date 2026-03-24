import { Home, MapPin, Calendar, Building2, Layers, DoorOpen } from 'lucide-react';

interface RoomOverviewProps {
    room: {
        roomName: string;
        building: string;
        floor: number;
        roomType: string;
        status: string;
        joinDate: string;
    };
}

export default function RoomOverviewCard({ room }: RoomOverviewProps) {
    const isActive = room.status === 'OCCUPIED' || room.status === 'ACTIVE';

    return (
        <div className="relative rounded-2xl overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-slate-900 to-cyan-600/10"></div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/8 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-500/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 p-6 md:p-8">
                {/* Top Row: Room Name + Status */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                            <Home className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-extrabold text-white tracking-tight">{room.roomName}</h2>
                            <p className="text-emerald-400/80 text-sm font-medium mt-0.5">{room.roomType}</p>
                        </div>
                    </div>
                    
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${
                        isActive 
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                        : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                    }`}>
                        <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                        {isActive ? 'Đang ở' : 'Chờ xử lý'}
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/8 transition-colors cursor-default">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                            <Building2 className="h-4 w-4 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Tòa nhà</p>
                            <p className="text-sm font-semibold text-slate-200">{room.building}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/8 transition-colors cursor-default">
                        <div className="p-2 rounded-lg bg-purple-500/10">
                            <Layers className="h-4 w-4 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Tầng</p>
                            <p className="text-sm font-semibold text-slate-200">{room.floor}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/8 transition-colors cursor-default">
                        <div className="p-2 rounded-lg bg-emerald-500/10">
                            <Calendar className="h-4 w-4 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Ngày vào</p>
                            <p className="text-sm font-semibold text-slate-200">{room.joinDate || '---'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
