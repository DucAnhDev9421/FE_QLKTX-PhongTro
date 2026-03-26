import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ShieldCheck, KeyRound, Loader2, Building } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userService } from '../../../services/user';
import { buildingService } from '../../../services/building';
import { useAuth } from '../../../hooks/useAuth';
import Alert from '../../../components/ui/Alert';

interface Props {
    user: any;
    onClose: () => void;
}

export default function UserModal({ user, onClose }: Props) {
    const isEdit = !!user;
    const queryClient = useQueryClient();
    const { user: currentUser } = useAuth();

    const currentUserRole = (currentUser?.role || (Array.isArray(currentUser?.roles) ? currentUser.roles[0] : '') || '').toUpperCase();
    const normalizedCurrentUserRole = currentUserRole.startsWith('ROLE_') ? currentUserRole.substring(5) : 
                                    currentUserRole.startsWith('SCOPE_') ? currentUserRole.substring(6) : currentUserRole;
    const isOwner = normalizedCurrentUserRole === 'OWNER';

    const [formData, setFormData] = useState({
        username: user?.username || '',
        password: '',
        fullName: user?.fullName || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        roleName: user?.roleName || user?.role?.roleName || user?.role || 'Staff'
    });

    const [selectedBuildingIds, setSelectedBuildingIds] = useState<number[]>(user?.managedBuildings ? [] : []); // We'll sync this after fetching buildings
    const [isBuildingsSynced, setIsBuildingsSynced] = useState(false);

    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Fetch roles from API
    const { data: rolesData } = useQuery({
        queryKey: ['roles'],
        queryFn: () => userService.getRoles(),
    });
    const roles: any[] = (rolesData?.result || []).filter((r: any) => {
        if (isOwner) {
            const rName = r.roleName.toUpperCase();
            return !(rName === 'ADMIN' || rName === 'OWNER');
        }
        return true;
    });

    const { data: buildingsData } = useQuery({
        queryKey: ['buildings'],
        queryFn: () => buildingService.getBuildings(),
    });
    const buildings: any[] = buildingsData?.result || [];

    // Sync selected buildings when buildings are loaded for edit mode
    if (isEdit && buildings.length > 0 && !isBuildingsSynced) {
        const managed = user.managedBuildings || [];
        const initialIds = buildings
            .filter(b => managed.includes(b.buildingName))
            .map(b => b.buildingId);
        setSelectedBuildingIds(initialIds);
        setIsBuildingsSynced(true);
    }

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await userService.createUser(data);
            const newUserId = res.result?.userId;
            if (newUserId && selectedBuildingIds.length > 0) {
                await buildingService.assignManagerToBuildings(newUserId, selectedBuildingIds);
            }
            return res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['buildings'] });
            onClose();
        },
        onError: (err: any) => {
            setErrorMsg(err.response?.data?.message || 'Có lỗi xảy ra khi tạo người dùng.');
        }
    });

    const updateMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await userService.updateUser(user.userId, data);
            await buildingService.assignManagerToBuildings(user.userId, selectedBuildingIds);
            return res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['buildings'] });
            setSuccessMsg('Cập nhật thông tin thành công!');
            setTimeout(() => onClose(), 1000);
        },
        onError: (err: any) => {
            setErrorMsg(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật.');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (isEdit) {
            updateMutation.mutate({
                fullName: formData.fullName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                roleName: formData.roleName,
            });
            return;
        }

        if (!formData.username || !formData.password || !formData.fullName) {
            setErrorMsg('Vui lòng điền đầy đủ các trường bắt buộc (*).');
            return;
        }

        createMutation.mutate(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBuildingToggle = (buildingId: number) => {
        setSelectedBuildingIds(prev => 
            prev.includes(buildingId) 
                ? prev.filter(id => id !== buildingId)
                : [...prev, buildingId]
        );
    };

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            
            <div className="relative bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transform transition-all">
                <div className="flex items-center justify-between p-5 border-b border-white/5 shrink-0 bg-slate-900">
                    <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                        {isEdit ? 'Chỉnh sửa Nhân sự' : 'Cấp tài khoản mới'}
                        {isEdit && <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">ID: {user.userId}</span>}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-200 transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-lg border border-white/5">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-5 overflow-y-auto space-y-6">
                    {errorMsg && (
                        <Alert type="error" message={errorMsg} />
                    )}
                    {successMsg && (
                        <Alert type="success" message={successMsg} />
                    )}

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1.5">Họ và tên <span className="text-rose-500">*</span></label>
                                <input 
                                    type="text" 
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Điền họ tên người dùng..."
                                    className="w-full bg-black/40 border border-white/10 text-sm text-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1.5">Email liên hệ</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="email@example.com"
                                    className="w-full bg-black/40 border border-white/10 text-sm text-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1.5">Số điện thoại</label>
                                <input 
                                    type="tel" 
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    placeholder="09xx..."
                                    className="w-full bg-black/40 border border-white/10 text-sm text-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600 font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-emerald-400 mb-1.5 flex items-center gap-1.5"><ShieldCheck size={16}/> Nhóm quyền (Role) <span className="text-rose-500">*</span></label>
                                <select 
                                    name="roleName"
                                    value={formData.roleName}
                                    onChange={handleChange}
                                    className="w-full bg-black/40 focus:bg-slate-900 text-emerald-400 border border-emerald-500/30 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-semibold uppercase appearance-none"
                                >
                                    {roles.length > 0 ? roles.map((r: any) => (
                                        <option key={r.roleId} value={r.roleName} className="bg-slate-900 text-slate-200">
                                            {r.roleName} {r.description ? `(${r.description})` : ''}
                                        </option>
                                    )) : (
                                        <>
                                            <option value="Owner" className="bg-slate-900 text-slate-200">Owner (Chủ hệ thống)</option>
                                            <option value="Admin" className="bg-slate-900 text-slate-200">Admin (Quản trị viên)</option>
                                            <option value="Staff" className="bg-slate-900 text-slate-200">Staff (Nhân viên)</option>
                                            <option value="Tenant" className="bg-slate-900 text-slate-200">Tenant (Người thuê trọ)</option>
                                        </>
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Building Assignment Checklist */}
                    {(formData.roleName?.toUpperCase() === 'STAFF' || formData.roleName?.toUpperCase() === 'OWNER') && buildings.length > 0 && (
                        <div className="border border-white/5 rounded-2xl p-5 bg-black/20 shadow-inner">
                            <label className="block text-sm font-medium text-emerald-400 mb-3 flex items-center gap-1.5 text-left uppercase tracking-wider">
                                <Building size={16} /> Chỉ định Tòa nhà quản lý
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                {buildings.map((b: any) => (
                                    <label 
                                        key={b.buildingId} 
                                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${selectedBuildingIds.includes(b.buildingId) ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-slate-900/40 border-white/5 text-slate-400 hover:border-white/10'}`}
                                    >
                                        <input 
                                            type="checkbox" 
                                            className="hidden"
                                            checked={selectedBuildingIds.includes(b.buildingId)}
                                            onChange={() => handleBuildingToggle(b.buildingId)}
                                        />
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedBuildingIds.includes(b.buildingId) ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'}`}>
                                            {selectedBuildingIds.includes(b.buildingId) && <X size={12} className="text-emerald-950 stroke-[4px]" />}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold truncate">{b.buildingName}</span>
                                            <span className="text-[10px] opacity-70 truncate">{b.address}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            {selectedBuildingIds.length === 0 && (
                                <p className="text-[10px] text-amber-500/70 mt-3 italic">
                                    * Chưa có tòa nhà nào được chọn. Nhân viên này sẽ không thấy thông tin tòa nhà nào.
                                </p>
                            )}
                        </div>
                    )}

                    <div className="border border-white/5 rounded-2xl p-5 bg-black/20 shadow-inner">
                        <label className="block text-sm font-medium text-amber-500 mb-3 flex items-center gap-1.5 text-left"><KeyRound size={16}/> Thông tin Đăng nhập</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">Tên đăng nhập (Username) <span className="text-rose-500">*</span></label>
                                <input 
                                    type="text" 
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    disabled={isEdit}
                                    autoComplete="off"
                                    placeholder="Ví dụ: admin_123"
                                    className="w-full bg-slate-900/50 border border-white/10 text-sm text-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-mono disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-slate-600 [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_30px_#0f172a_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                                />
                                {isEdit && <span className="text-[10px] text-slate-500 mt-1 block">Tên đăng nhập là định danh, không thể thay đổi.</span>}
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">{isEdit ? 'Mật khẩu mới (để trống nếu không đổi)' : 'Mật khẩu khởi tạo'} {(!isEdit) && <span className="text-rose-500">*</span>}</label>
                                <input 
                                    type="password" 
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    placeholder={isEdit ? '••••••••' : 'Nhập mật khẩu...'}
                                    className="w-full bg-slate-900/50 border border-white/10 text-sm text-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-mono placeholder:text-slate-600 [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_30px_#0f172a_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-5 border-t border-white/5 flex justify-end gap-3 bg-slate-900 shrink-0">
                    <button 
                        onClick={onClose}
                        type="button"
                        className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all">
                        Hủy
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-5 py-2.5 flex items-center gap-2 text-sm font-semibold text-emerald-950 bg-emerald-500 hover:bg-emerald-400 rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] disabled:opacity-70 disabled:cursor-not-allowed">
                        {isSubmitting ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Đang xử lý...
                            </>
                        ) : (
                            isEdit ? 'Lưu thay đổi' : 'Tạo Tài khoản'
                        )}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
