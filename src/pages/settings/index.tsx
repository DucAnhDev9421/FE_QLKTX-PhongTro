import { useState, useEffect } from 'react';
import { Layout } from '../../components/layout';
import { Bell, Wallet, Building, Globe, Save, Moon, Monitor, QrCode, Tag, Plus, Edit2, Trash2, Loader2, Package } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roomService } from '../../services/room';
import RoomTypeModal from '../rooms/components/RoomTypeModal';
import Alert from '../../components/ui/Alert';
import { useAuth } from '../../hooks/useAuth';

const ALL_TABS = [
    { id: 'business', label: 'Cơ sở & Hệ thống', icon: <Building size={18} />, adminOnly: true },
    { id: 'room-types', label: 'Phân loại phòng', icon: <Tag size={18} /> },
    { id: 'payment', label: 'Cấu hình Thanh toán', icon: <Wallet size={18} />, adminOnly: true },
    { id: 'notifications', label: 'Thông báo', icon: <Bell size={18} /> },
    { id: 'preferences', label: 'Tùy chỉnh hệ thống', icon: <Globe size={18} /> },
];

export default function Settings() {
    const { user, loading: authLoading } = useAuth();
    const isAdmin = user?.role?.includes('SCOPE_ADMIN');
    
    const tabs = ALL_TABS.filter(tab => !tab.adminOnly || isAdmin);
    
    const [activeTab, setActiveTab] = useState('business');

    useEffect(() => {
        if (!authLoading && !isAdmin && activeTab === 'business') {
            setActiveTab('room-types');
        }
    }, [authLoading, isAdmin, activeTab]);

    if (authLoading) {
        return (
            <Layout>
                <div className="flex justify-center items-center py-20">
                    <Loader2 size={32} className="animate-spin text-emerald-500" />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-100 mb-1">Cài đặt hệ thống</h1>
                <p className="text-slate-400 text-sm">Cấu hình luồng kinh doanh và tham số kỹ thuật toàn cục.</p>
            </div>

            <div className="flex flex-col xl:flex-row gap-8">
                {/* Settings Sidebar */}
                <div className="lg:w-72 flex-shrink-0">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-lg flex xl:flex-col overflow-x-auto gap-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-4 py-3.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap xl:whitespace-normal ${activeTab === tab.id
                                    ? 'bg-emerald-500/10 text-emerald-500 shadow-[inset_2px_0_0_0_rgba(16,185,129,1)]'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Settings Content Area */}
                <div className="flex-1">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg p-6 lg:p-8 min-h-[500px]">
                        {activeTab === 'business' && <BusinessSettings />}
                        {activeTab === 'room-types' && <RoomTypeSettings />}
                        {activeTab === 'payment' && <PaymentSettings />}
                        {activeTab === 'notifications' && <NotificationSettings />}
                        {activeTab === 'preferences' && <PreferencesSettings />}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

function BusinessSettings() {
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div>
                <h2 className="text-lg font-bold text-slate-100 mb-6 border-b border-slate-800 pb-4">Thông tin Kinh doanh (Ký túc xá)</h2>
                <div className="grid grid-cols-1 gap-6 max-w-3xl">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400 block">Tên hệ thống/Thương hiệu</label>
                        <input type="text" defaultValue="Hệ thống Căn hộ Dịch vụ QLKTX" className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400 block">Danh sách Tòa nhà (Cơ sở)</label>
                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                            <div className="flex justify-between items-center p-3.5 bg-slate-800/50 border border-slate-700 rounded-lg">
                                <span className="text-slate-200 font-medium">Cơ sở 1 - Quận 7</span>
                                <span className="text-emerald-500 text-[10px] uppercase font-bold px-2 py-1 bg-emerald-500/10 rounded-md border border-emerald-500/20">Hoạt động (8 Tầng)</span>
                            </div>
                            <div className="flex justify-between items-center p-3.5 bg-slate-800/50 border border-slate-700 rounded-lg">
                                <span className="text-slate-200 font-medium">Cơ sở 2 - Bình Thạnh</span>
                                <span className="text-emerald-500 text-[10px] uppercase font-bold px-2 py-1 bg-emerald-500/10 rounded-md border border-emerald-500/20">Hoạt động (5 Tầng)</span>
                            </div>
                            <div className="mt-2 text-xs text-slate-500 bg-amber-500/10 text-amber-500 p-3 rounded-lg flex items-start gap-2 border border-amber-500/20">
                                <span>💡</span>
                                <p>Để sửa đổi mã cơ sở hay cấu trúc Tầng, vui lòng truy cập menu <strong>Tòa nhà</strong> bên tay trái.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-slate-800 flex justify-end">
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                    <Save size={18} /> Lưu bộ thông tin
                </button>
            </div>
        </div>
    );
}

function PaymentSettings() {
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div>
                <h2 className="text-lg font-bold text-slate-100 mb-6 border-b border-slate-800 pb-4">Tài khoản Ngân hàng Đích</h2>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full max-w-4xl">
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400 block">Ngân hàng thụ hưởng</label>
                            <select className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all">
                                <option className="bg-slate-900">NHTMCP Ngoại thương VN (Vietcombank)</option>
                                <option className="bg-slate-900">NHTMCP Kỹ thương VN (Techcombank)</option>
                                <option className="bg-slate-900">NH Quân Đội (MB Bank)</option>
                                <option className="bg-slate-900">NH TMCP Đầu tư và Phát triển VN (BIDV)</option>
                                <option className="bg-slate-900">NH TMCP Tiên Phong (TPBank)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400 block">Số tài khoản (Số thẻ)</label>
                            <input type="text" defaultValue="1010123456" className="w-full bg-slate-950 border border-slate-800 text-emerald-400 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono font-bold tracking-widest text-lg" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400 block">Tên chủ tài khoản</label>
                            <input type="text" defaultValue="NGUYEN VAN A" className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all uppercase font-semibold" />
                        </div>
                    </div>

                    <div className="flex gap-6 items-center flex-col justify-center bg-slate-950 border border-slate-800 border-dashed rounded-xl p-6">
                        <label className="text-sm font-medium text-slate-300 block mb-2 tracking-wide uppercase">Cấu hình Mã QR VietQR</label>
                        <div className="w-48 h-48 bg-white p-3 rounded-xl flex items-center justify-center relative group shadow-lg cursor-pointer transition-transform hover:scale-105">
                            <QrCode className="w-full h-full text-slate-800" strokeWidth={1} />
                            <div className="absolute inset-0 bg-slate-900/90 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                <span className="text-white text-sm font-medium border border-white/20 px-4 py-2 rounded-lg bg-black/50">Tải mã tĩnh lên</span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 text-center leading-relaxed">Mã QR này sẽ được đính kèm tự động <br/>khi in Hóa đơn Tiền phòng cho khách xem.</p>
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-slate-800 flex justify-end">
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                    <Save size={18} /> Cập nhật kết nối Thanh toán
                </button>
            </div>
        </div>
    );
}

function NotificationSettings() {
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div>
                <h2 className="text-lg font-bold text-slate-100 mb-6 border-b border-slate-800 pb-4">Tùy chỉnh Thông báo Máy chủ (WebHook)</h2>
                <div className="space-y-4 max-w-3xl">
                    <ToggleItem title="Khách sắp hết hạn hợp đồng" desc="Chủ động nhắc nhở (gửi Email cho Ban quản lý) khi có hợp đồng khách thuê sắp đi đến ngày kết thúc sau 15 ngày." active={true} />
                    <ToggleItem title="Sinh nợ chậm thanh toán" desc="Tự động nhảy thông báo khi có chu kỳ hóa đơn chưa đóng quá 3 ngày." active={true} />
                    <ToggleItem title="Nhận trích xuất Báo cáo tuần" desc="Sáng Thứ 2 hàng tuần (8h00), hệ thống tự động lọc và gửi Danh sách doanh thu qua hòm thư Admin." active={false} />
                </div>
            </div>
            <div className="pt-6 border-t border-slate-800 flex justify-end">
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                    <Save size={18} /> Lưu thiết lập thông báo
                </button>
            </div>
        </div>
    );
}

function PreferencesSettings() {
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div>
                <h2 className="text-lg font-bold text-slate-100 mb-6 border-b border-slate-800 pb-4">Giao diện Hiển thị (UI)</h2>
                <div className="space-y-4 max-w-3xl">
                    <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-lg">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 border border-slate-700">
                                <Moon size={22} />
                            </div>
                            <div>
                                <p className="text-slate-200 font-bold">Chế độ tối (Dark Mode)</p>
                                <p className="text-slate-500 text-xs">Phù hợp xem dữ liệu đêm, bảo vệ mắt (Đang cố định ở giao diện OLED Dark)</p>
                            </div>
                        </div>
                        <div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer opacity-80 pointer-events-none">
                            <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-lg">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 border border-slate-700">
                                <Monitor size={22} />
                            </div>
                            <div>
                                <p className="text-slate-200 font-bold">Ngôn ngữ Mặc định</p>
                                <p className="text-slate-500 text-xs">Văn bản hiển thị của toàn bộ hệ thống</p>
                            </div>
                        </div>
                        <select className="bg-slate-800 border border-slate-700 text-sm font-medium text-slate-200 rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-emerald-500">
                            <option className="bg-slate-900 text-slate-200">Tiếng Việt (Mặc định)</option>
                            <option className="bg-slate-900 text-slate-200">English (US)</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}

function RoomTypeSettings() {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<any | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const { data: roomTypesData, isLoading } = useQuery({
        queryKey: ['roomTypes'],
        queryFn: () => roomService.getRoomTypes()
    });
    const roomTypes = roomTypesData?.result || [];

    const deleteMutation = useMutation({
        mutationFn: (id: number) => roomService.deleteRoomType(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roomTypes'] });
            setDeleteId(null);
        },
        onError: (err: any) => {
            alert(err.response?.data?.message || 'Không thể xóa loại phòng này. Có thể đang có phòng thuộc loại này.');
            setDeleteId(null);
        }
    });

    const handleEdit = (type: any) => {
        setSelectedType(type);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedType(null);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
                <h2 className="text-lg font-bold text-slate-100">Quản lý Loại Phòng</h2>
                <button 
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-emerald-900/20"
                >
                    <Plus size={18} /> Thêm loại mới
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isLoading ? (
                    <div className="col-span-full flex justify-center py-12">
                        <Loader2 className="animate-spin text-emerald-500" size={32} />
                    </div>
                ) : roomTypes.length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-slate-950 border border-dashed border-slate-800 rounded-xl">
                        <Package className="mx-auto text-slate-700 mb-2" size={32} />
                        <p className="text-slate-500 text-sm">Chưa có loại phòng nào được định nghĩa.</p>
                    </div>
                ) : (
                    roomTypes.map((type: any) => (
                        <div key={type.roomTypeId} className="bg-slate-950 border border-slate-800 p-5 rounded-xl flex justify-between items-start group hover:border-emerald-500/30 transition-all shadow-sm">
                            <div className="space-y-1">
                                <h3 className="text-slate-100 font-bold flex items-center gap-2">
                                    <Tag size={14} className="text-emerald-500" />
                                    {type.typeName}
                                </h3>
                                <div className="text-emerald-500 font-mono font-bold text-lg">
                                    {new Intl.NumberFormat('vi-VN').format(type.basePrice)}đ
                                </div>
                                <div className="flex gap-3 text-[11px] text-slate-500 uppercase font-bold tracking-wider pt-2">
                                    <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{type.area} m²</span>
                                    <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">Max {type.maxOccupancy} người</span>
                                </div>
                                {type.description && (
                                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 italic italic-slate-600">"{type.description}"</p>
                                )}
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => handleEdit(type)}
                                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700" title="Chỉnh sửa">
                                    <Edit2 size={14} />
                                </button>
                                <button 
                                    onClick={() => setDeleteId(type.roomTypeId)}
                                    className="p-2 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-lg border border-rose-500/20 transition-colors" title="Xóa">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {isModalOpen && (
                <RoomTypeModal 
                    roomType={selectedType}
                    onClose={() => setIsModalOpen(false)}
                />
            )}

            {/* Simple Delete Dialog */}
            {deleteId && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
                    <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                        <h3 className="text-lg font-bold text-slate-100 mb-2">Xác nhận xóa?</h3>
                        <p className="text-slate-400 text-sm mb-6">Hành động này không thể hoàn tác. Loại phòng sẽ bị xóa vĩnh viễn khỏi hệ thống.</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200">Hủy</button>
                            <button 
                                onClick={() => deleteMutation.mutate(deleteId)}
                                disabled={deleteMutation.isPending}
                                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2">
                                {deleteMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : 'Xóa ngay'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Reusable Toggle switch component
function ToggleItem({ title, desc, active }: { title: string, desc: string, active: boolean }) {
    const [isOn, setIsOn] = useState(active);

    return (
        <div className="flex items-center justify-between p-5 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition-colors" onClick={() => setIsOn(!isOn)}>
            <div className="pr-6">
                <p className="text-slate-200 font-bold">{title}</p>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">{desc}</p>
            </div>
            <div className={`w-12 h-6 rounded-full relative transition-colors duration-200 ease-in-out shrink-0 ${isOn ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-700 border border-slate-600'}`}>
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out shadow-sm ${isOn ? 'translate-x-6 right-auto' : 'translate-x-0.5 left-0'}`} />
            </div>
        </div>
    );
}
