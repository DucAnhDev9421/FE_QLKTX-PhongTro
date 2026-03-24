import { Users, Shield, Phone } from 'lucide-react';

interface Member {
    id: number;
    name: string;
    phone: string;
    role: string;
    joinDate: string;
}

interface RoommatesListProps {
    members: Member[];
}

const AVATAR_COLORS = [
    'from-emerald-500 to-teal-600',
    'from-blue-500 to-indigo-600',
    'from-purple-500 to-violet-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
];

export default function RoommatesList({ members }: RoommatesListProps) {
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                        <Users className="h-4.5 w-4.5 text-purple-400" />
                    </div>
                    <h3 className="text-base font-bold text-slate-100">Thành viên</h3>
                </div>
                <span className="text-xs font-medium text-slate-500 bg-slate-800 px-2.5 py-1 rounded-full">{members.length} người</span>
            </div>
            
            <div className="p-4 space-y-1">
                {members.map((member, idx) => (
                    <div key={member.id} className="flex items-center gap-3.5 p-3 hover:bg-slate-800/50 rounded-xl transition-all duration-200 group cursor-default">
                        <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${AVATAR_COLORS[idx % AVATAR_COLORS.length]} flex items-center justify-center text-sm font-bold text-white shadow-lg shrink-0`}>
                            {getInitials(member.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-slate-200 truncate">{member.name}</p>
                                {member.role === 'Đại diện' && (
                                    <Shield className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                                )}
                            </div>
                            {member.phone && (
                                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    {member.phone}
                                </p>
                            )}
                        </div>
                        {member.role === 'Đại diện' && (
                            <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[11px] font-semibold text-emerald-400 uppercase tracking-wider whitespace-nowrap">
                                Đại diện
                            </span>
                        )}
                    </div>
                ))}
                
                {members.length === 0 && (
                    <div className="py-8 text-center">
                        <Users className="h-10 w-10 text-slate-700 mx-auto mb-3" />
                        <p className="text-sm text-slate-500">Chưa có thành viên</p>
                    </div>
                )}
            </div>
        </div>
    );
}
