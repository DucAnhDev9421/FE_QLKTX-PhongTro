import { Users, Shield } from 'lucide-react';

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

export default function RoommatesList({ members }: RoommatesListProps) {
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden shadow-lg">
            <div className="p-5 border-b border-slate-700/50 bg-slate-800/80">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                        <Users className="h-5 w-5 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-100">Thành viên phòng</h3>
                </div>
            </div>
            
            <div className="p-5 flex flex-col gap-4">
                {members.map((member) => (
                    <div key={member.id} className="flex items-center gap-4 group p-2 hover:bg-slate-700/30 rounded-xl transition-colors">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 border border-slate-600 flex items-center justify-center text-sm font-medium text-slate-200 shadow-inner group-hover:border-purple-500/30 transition-colors shrink-0">
                            {getInitials(member.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-200 truncate flex items-center gap-2">
                                {member.name}
                                {member.role === 'Đại diện' && (
                                    <Shield className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                                )}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5 truncate">
                                Gia nhập: {member.joinDate}
                            </p>
                        </div>
                        <div className="px-2.5 py-1 bg-slate-700/50 rounded-lg border border-slate-600/50 text-xs font-medium text-slate-300">
                            {member.role === 'Đại diện' ? 'Đ.Diện' : member.role}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
