import { Home, MapPin, Calendar, Image as ImageIcon } from 'lucide-react';

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
    return (
        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="w-full md:w-56 h-36 rounded-xl bg-slate-700/50 border border-slate-600/50 flex items-center justify-center shrink-0 overflow-hidden relative group">
                    <ImageIcon className="h-8 w-8 text-slate-500 group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                </div>
                
                <div className="flex-1 w-full">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shadow-inner">
                            <Home className="h-5 w-5 text-emerald-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-100">{room.roomName}</h2>
                        <span className="ml-auto md:ml-0 px-3 py-1 text-xs font-semibold tracking-wide rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                            Đang ở
                        </span>
                    </div>
                    
                    <p className="text-slate-400 text-sm mb-5 font-medium">{room.roomType}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-700/30 border border-slate-600/30 text-sm text-slate-300">
                            <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />
                            <span className="truncate">{room.building} - Tầng {room.floor}</span>
                        </div>
                        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-700/30 border border-slate-600/30 text-sm text-slate-300">
                            <Calendar className="h-4 w-4 text-blue-400 shrink-0" />
                            <span className="truncate">T/gia: {room.joinDate}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
