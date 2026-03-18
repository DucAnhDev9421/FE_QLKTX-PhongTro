import { useState } from 'react';
import { Layout } from '../../components/layout';
import { Search, Filter, Plus, ShieldCheck, Shield, UserCog, User as UserIcon, Lock, Unlock, Edit, MoreVertical } from 'lucide-react';
import { User } from '../../types/user';
import UserModal from './components/UserModal';

const mockUsers: User[] = [
    { id: 'USR-001', fullName: 'Chủ trọ Hệ thống', username: 'owner_admin', email: 'owner@ktx.com', phone: '0901234567', role: 'OWNER', status: 'ACTIVE', lastLogin: '18/11/2026 08:30', createdAt: '01/01/2025' },
    { id: 'USR-002', fullName: 'Quản trị viên', username: 'admin_sys', email: 'admin@ktx.com', phone: '0912345678', role: 'ADMIN', status: 'ACTIVE', lastLogin: '18/11/2026 10:15', createdAt: '15/06/2026' },
    { id: 'USR-003', fullName: 'Nhân viên Vận hành', username: 'staff_1', email: 'staff1@ktx.com', phone: '0987654321', role: 'STAFF', status: 'ACTIVE', lastLogin: '17/11/2026 17:00', createdAt: '01/10/2026' },
    { id: 'USR-004', fullName: 'Người dùng Test', username: 'user_test', email: 'test@ktx.com', phone: '0922334455', role: 'USER', status: 'INACTIVE', createdAt: '10/11/2026' },
];

const RoleBadge = ({ role }: { role: User['role'] }) => {
    switch (role) {
        case 'OWNER':
            return <span className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded border bg-amber-500/10 text-amber-500 border-amber-500/20 w-fit"><ShieldCheck size={12} /> Owner</span>;
        case 'ADMIN':
            return <span className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded border bg-rose-500/10 text-rose-500 border-rose-500/20 w-fit"><Shield size={12} /> Admin</span>;
        case 'STAFF':
            return <span className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded border bg-blue-500/10 text-blue-500 border-blue-500/20 w-fit"><UserCog size={12} /> Staff</span>;
        case 'USER':
            return <span className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded border bg-slate-500/10 text-slate-400 border-slate-500/20 w-fit"><UserIcon size={12} /> User</span>;
    }
};

export default function Users() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleCreate = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const toggleLock = (e: React.MouseEvent, _user: User) => {
        e.stopPropagation();
        // Handle lock/unlock
    };

    return (
        <Layout>
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100 mb-1">Quản lý Nhân sự & Người dùng</h1>
                    <p className="text-slate-400 text-sm">Phân quyền, cấp tài khoản và theo dõi hoạt động của hệ thống.</p>
                </div>
                <button 
                    onClick={handleCreate}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                    <Plus size={18} /> Thêm tài khoản
                </button>
            </div>

            {/* Config & Filter Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm theo tên, username, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    <button className="flex items-center gap-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                        <Filter size={16} /> Nhóm quyền
                    </button>
                    <button className="flex items-center gap-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                        <Filter size={16} /> Trạng thái
                    </button>
                </div>
            </div>

            {/* Users Data Grid */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-900/50 border-b border-slate-800">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-semibold">Nhân viên</th>
                                <th scope="col" className="px-6 py-4 font-semibold">Tài khoản</th>
                                <th scope="col" className="px-6 py-4 font-semibold">Vai trò</th>
                                <th scope="col" className="px-6 py-4 font-semibold">Trạng thái</th>
                                <th scope="col" className="px-6 py-4 font-semibold">Đăng nhập lân cuối</th>
                                <th scope="col" className="px-6 py-4 text-right font-semibold">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {mockUsers.map((user) => (
                                <tr key={user.id} className={`hover:bg-slate-800/50 transition-colors group cursor-pointer ${user.status === 'INACTIVE' ? 'opacity-60 grayscale' : ''}`} onClick={() => handleEdit(user)}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 font-bold flex items-center justify-center text-slate-300">
                                                {user.fullName.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-slate-200 font-medium">{user.fullName}</span>
                                                <span className="text-xs text-slate-500">{user.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-slate-300 font-mono text-xs mb-0.5">@{user.username}</span>
                                            <span className="text-xs text-slate-500">{user.phone}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <RoleBadge role={user.role} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${user.status === 'ACTIVE' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-slate-600'}`}></span>
                                            <span className="text-xs">{user.status === 'ACTIVE' ? 'Hoạt động' : 'Đã khóa'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.lastLogin ? <span className="text-slate-400">{user.lastLogin}</span> : <span className="text-xs text-slate-600 italic">Chưa đăng nhập</span>}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button 
                                                onClick={(e) => toggleLock(e, user)}
                                                title={user.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa kết nối'}
                                                className={`p-2 rounded-lg transition-colors ${user.status === 'ACTIVE' ? 'text-slate-400 hover:text-amber-500 hover:bg-slate-800' : 'text-slate-500 hover:text-emerald-500 hover:bg-slate-800'}`}>
                                                {user.status === 'ACTIVE' ? <Lock size={18} /> : <Unlock size={18} />}
                                            </button>
                                            <button className="text-slate-400 hover:text-emerald-500 p-2 rounded-lg hover:bg-slate-800 transition-colors">
                                                <Edit size={18} />
                                            </button>
                                            <button className="text-slate-400 hover:text-slate-200 p-2 rounded-lg hover:bg-slate-800 transition-colors hidden sm:block">
                                                <MoreVertical size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/50">
                    <span className="text-sm text-slate-500">
                        Hiển thị <span className="font-medium text-slate-300">1</span> đến <span className="font-medium text-slate-300">4</span> trong <span className="font-medium text-slate-300">4</span> người dùng
                    </span>
                </div>
            </div>

            {isModalOpen && (
                <UserModal 
                    user={selectedUser} 
                    onClose={() => setIsModalOpen(false)} 
                />
            )}
        </Layout>
    );
}
