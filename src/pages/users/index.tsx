import { useState, useMemo, useDeferredValue } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Layout } from '../../components/layout';
import { Search, Plus, ShieldCheck, Shield, UserCog, User as UserIcon, Lock, Unlock, Edit, Trash2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import UserModal from './components/UserModal';
import { userService } from '../../services/user';
import { useAuth } from '../../hooks/useAuth';
import ConfirmModal from '../../components/ui/ConfirmModal';
import defaultAvatar from '../../assets/man-avatar-png-image_6514640.png';

const RoleBadge = ({ role }: { role: string }) => {
    switch (role?.toUpperCase().replace('SCOPE_', '').replace('ROLE_', '')) {
        case 'OWNER':
            return <span className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded border bg-amber-500/10 text-amber-500 border-amber-500/20 w-fit"><ShieldCheck size={12} /> Owner</span>;
        case 'ADMIN':
            return <span className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded border bg-rose-500/10 text-rose-500 border-rose-500/20 w-fit"><Shield size={12} /> Admin</span>;
        case 'STAFF':
            return <span className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded border bg-blue-500/10 text-blue-500 border-blue-500/20 w-fit"><UserCog size={12} /> Staff</span>;
        case 'USER':
        case 'TENANT':
        default:
            return <span className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded border bg-slate-500/10 text-slate-400 border-slate-500/20 w-fit"><UserIcon size={12} /> {role?.replace('SCOPE_', '') || 'TENANT'}</span>;
    }
};

export default function Users() {
    const [searchTerm, setSearchTerm] = useState('');
    const deferredSearch = useDeferredValue(searchTerm);
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [page, setPage] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    
    // Confirm Dialog State
    const [confirmDialog, setConfirmDialog] = useState<{isOpen: boolean, config: any}>({
        isOpen: false,
        config: null
    });

    const queryClient = useQueryClient();
    const { user: currentUser } = useAuth();

    const currentUserRole = (currentUser?.role || (Array.isArray(currentUser?.roles) ? currentUser.roles[0] : '') || '').toUpperCase();
    const normalizedCurrentUserRole = currentUserRole.startsWith('ROLE_') ? currentUserRole.substring(5) : 
                                    currentUserRole.startsWith('SCOPE_') ? currentUserRole.substring(6) : currentUserRole;
    const isOwner = normalizedCurrentUserRole === 'OWNER';

    // Fetch users with pagination and server-side filtering
    const { data: pageResult, isLoading } = useQuery({
        queryKey: ['users', roleFilter, page, deferredSearch],
        queryFn: () => userService.getUsers(
            roleFilter === 'ALL' ? undefined : roleFilter, 
            deferredSearch || undefined, 
            page, 
            10
        )
    });

    const { data: rolesData } = useQuery({
        queryKey: ['roles'],
        queryFn: () => userService.getRoles()
    });

    const users = pageResult?.data || [];
    const roles: any[] = rolesData?.result || [];

    // Reset page to 0 when search or filter changes
    useMemo(() => {
        setPage(0);
    }, [deferredSearch, roleFilter]);

    const toggleStatusMutation = useMutation({
        mutationFn: ({ id, isActive }: { id: string | number, isActive: boolean }) => userService.updateUserStatus(id, isActive),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setConfirmDialog({ isOpen: false, config: null });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string | number) => userService.deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setConfirmDialog({ isOpen: false, config: null });
        }
    });

    const handleCreate = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const handleEdit = (user: any) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const toggleLock = (e: React.MouseEvent, user: any) => {
        e.stopPropagation();
        setConfirmDialog({
            isOpen: true,
            config: {
                title: user.isActive ? 'Khóa tài khoản' : 'Mở khóa tài khoản',
                message: user.isActive 
                    ? `Bạn có chắc chắn muốn KHÓA tài khoản "${user.username}"? Người dùng này sẽ không thể đăng nhập vào hệ thống.`
                    : `Bạn có chắc chắn muốn MỞ KHÓA tài khoản "${user.username}"?`,
                type: user.isActive ? 'warning' : 'info',
                confirmText: user.isActive ? 'Khóa ngay' : 'Mở khóa',
                onConfirm: () => toggleStatusMutation.mutate({ id: user.userId, isActive: !user.isActive })
            }
        });
    };

    const handleDelete = (e: React.MouseEvent, user: any) => {
        e.stopPropagation();
        setConfirmDialog({
            isOpen: true,
            config: {
                title: 'Xóa tài khoản',
                message: `Bạn có chắc chắn muốn XÓA tài khoản "${user.username}"? Thao tác này không thể hoàn tác.`,
                type: 'danger',
                confirmText: 'Xóa',
                onConfirm: () => deleteMutation.mutate(user.userId)
            }
        });
    };

    // Server-side filters now, so we just use the users list directly.

    const displayedRoles = roles.filter((r: any) => {
        if (isOwner) {
            const rName = r.roleName.toUpperCase();
            return !(rName === 'ADMIN' || rName === 'OWNER');
        }
        return true;
    });

    return (
        <Layout>
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100 mb-1">Quản lý Nhân sự & Người dùng</h1>
                    <p className="text-slate-400 text-sm">Phân quyền, cấp tài khoản và theo dõi hoạt động của hệ thống.</p>
                </div>
                <button 
                    onClick={handleCreate}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.4)] transform hover:-translate-y-0.5">
                    <Plus size={18} /> Thêm tài khoản
                </button>
            </div>

            {/* Config & Filter Bar */}
            <div className="bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-2xl shadow-xl p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm theo tên, username, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 text-slate-200 rounded-xl pl-11 pr-4 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-sm placeholder:text-slate-500"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    <button
                        onClick={() => setRoleFilter('ALL')}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap border ${roleFilter === 'ALL' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-black/40 text-slate-400 border-white/10 hover:border-white/20'}`}
                    >
                        Tất cả
                    </button>
                    {displayedRoles.map((r: any) => (
                        <button
                            key={r.roleId}
                            onClick={() => setRoleFilter(r.roleName.toUpperCase())}
                            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap border ${roleFilter === r.roleName.toUpperCase() ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-black/40 text-slate-400 border-white/10 hover:border-white/20'}`}
                        >
                            {r.roleName}
                        </button>
                    ))}
                </div>
            </div>

            {/* Users Data Grid */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative min-h-[300px]">
                {isLoading && (
                    <div className="absolute inset-0 z-10 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                    </div>
                )}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="text-xs text-slate-400 uppercase bg-black/40 border-b border-white/10">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Nhân viên</th>
                                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Tài khoản</th>
                                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Vai trò</th>
                                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Trạng thái</th>
                                <th scope="col" className="px-6 py-4 text-right font-semibold tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading && users.length === 0 ? (
                                Array.from({ length: 5 }).map((_, idx) => (
                                    <tr key={idx} className="animate-pulse bg-white/[0.02]">
                                        <td className="px-6 py-4"><div className="w-48 h-10 bg-white/5 rounded-lg"></div></td>
                                        <td className="px-6 py-4"><div className="w-32 h-10 bg-white/5 rounded-lg"></div></td>
                                        <td className="px-6 py-4"><div className="w-20 h-6 bg-white/5 rounded-full"></div></td>
                                        <td className="px-6 py-4"><div className="w-24 h-5 bg-white/5 rounded"></div></td>
                                        <td className="px-6 py-4 text-right"><div className="w-8 h-8 bg-white/5 rounded-lg inline-block"></div></td>
                                    </tr>
                                ))
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        Không tìm thấy người dùng nào.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user: any) => (
                                    <tr key={user.userId} className={`hover:bg-white/5 transition-all duration-200 group cursor-pointer ${!user.isActive ? 'opacity-50 grayscale' : ''}`} onClick={() => handleEdit(user)}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 overflow-hidden shrink-0 shadow-inner">
                                                    <img 
                                                        src={defaultAvatar} 
                                                        alt="Avatar" 
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-slate-200 font-semibold">{user.fullName || 'Chưa cập nhật'}</span>
                                                    <span className="text-xs text-slate-500 mt-0.5">{user.email || 'Không có email'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-slate-300 font-mono text-sm mb-0.5">@{user.username}</span>
                                                <span className="text-xs text-slate-500">{user.phoneNumber || 'Không có SĐT'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-2">
                                                <RoleBadge role={user.roleName || user.role?.roleName || user.role} />
                                                {user.managedBuildings && user.managedBuildings.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {user.managedBuildings.map((bName: string, i: number) => (
                                                            <span key={i} className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded text-[9px] font-medium leading-tight">
                                                                {bName}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {user.isActive ? (
                                                    <>
                                                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                                                        <span className="text-xs font-medium text-emerald-400">Hoạt động</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                                                        <span className="text-xs font-medium text-slate-500">Đã khóa</span>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 md:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={(e) => toggleLock(e, user)}
                                                    disabled={toggleStatusMutation.isPending}
                                                    title={user.isActive ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                                                    className={`p-2 rounded-lg transition-colors ${user.isActive ? 'text-slate-400 hover:text-amber-500 hover:bg-amber-500/10' : 'text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/10'} disabled:opacity-50`}>
                                                    {user.isActive ? <Lock size={18} /> : <Unlock size={18} />}
                                                </button>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); handleEdit(user); }}
                                                    title="Chỉnh sửa"
                                                    className="text-slate-400 hover:text-emerald-500 p-2 rounded-lg hover:bg-emerald-500/10 transition-colors">
                                                    <Edit size={18} />
                                                </button>
                                                <button 
                                                    onClick={(e) => handleDelete(e, user)}
                                                    title="Xóa tài khoản"
                                                    className="text-slate-400 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-500/10 transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-black/20">
                    <span className="text-sm text-slate-500">
                        Hiển thị <span className="font-medium text-slate-300">{users.length}</span> trong <span className="font-medium text-slate-300">{pageResult?.totalElements || 0}</span> người dùng
                    </span>

                    {pageResult && pageResult.totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <button 
                                disabled={page === 0}
                                onClick={() => setPage(page - 1)}
                                className="p-2 rounded-lg bg-slate-800/40 border border-white/10 text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <span className="text-sm text-slate-300 font-medium px-2">
                                Trang {page + 1} / {pageResult.totalPages}
                            </span>
                            <button 
                                disabled={page >= pageResult.totalPages - 1}
                                onClick={() => setPage(page + 1)}
                                className="p-2 rounded-lg bg-slate-800/40 border border-white/10 text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <UserModal 
                    user={selectedUser} 
                    onClose={() => setIsModalOpen(false)} 
                />
            )}

            <ConfirmModal 
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog(prev => ({...prev, isOpen: false}))}
                onConfirm={confirmDialog.config?.onConfirm || (() => {})}
                title={confirmDialog.config?.title || ''}
                message={confirmDialog.config?.message || ''}
                type={confirmDialog.config?.type || 'danger'}
                confirmText={confirmDialog.config?.confirmText}
                isLoading={toggleStatusMutation.isPending}
            />
        </Layout>
    );
}
