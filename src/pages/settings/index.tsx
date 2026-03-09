import { useState } from 'react';
import { Layout } from '../../components/layout';
import { User, Bell, Shield, Wallet, Building, Globe, Save, Moon, Monitor } from 'lucide-react';

const TABS = [
    { id: 'profile', label: 'Thông tin chủ trọ', icon: <User size={18} /> },
    { id: 'business', label: 'Thông tin cơ sở', icon: <Building size={18} /> },
    { id: 'pricing', label: 'Cấu hình giá & phí', icon: <Wallet size={18} /> },
    { id: 'notifications', label: 'Thông báo', icon: <Bell size={18} /> },
    { id: 'security', label: 'Bảo mật', icon: <Shield size={18} /> },
    { id: 'preferences', label: 'Tùy chỉnh hệ thống', icon: <Globe size={18} /> },
];

export default function Settings() {
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-100 mb-1">Cài đặt hệ thống</h1>
                <p className="text-slate-400 text-sm">Quản lý tài khoản, phân quyền và các tham số cấu hình ứng dụng.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Settings Sidebar */}
                <div className="lg:w-64 flex-shrink-0">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-lg flex lg:flex-col overflow-x-auto gap-1">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap lg:whitespace-normal ${activeTab === tab.id
                                    ? 'bg-emerald-500/10 text-emerald-500'
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
                        {activeTab === 'profile' && <ProfileSettings />}
                        {activeTab === 'business' && <BusinessSettings />}
                        {activeTab === 'pricing' && <PricingSettings />}
                        {activeTab === 'notifications' && <NotificationSettings />}
                        {activeTab === 'security' && <SecuritySettings />}
                        {activeTab === 'preferences' && <PreferencesSettings />}
                    </div>
                </div>
            </div>
        </Layout >
    );
}

function ProfileSettings() {
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div>
                <h2 className="text-lg font-semibold text-slate-100 mb-4">Thông tin chủ trọ</h2>
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-emerald-500/30 flex items-center justify-center text-slate-400 overflow-hidden">
                        <User size={32} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700">
                            Đổi ảnh đại diện
                        </button>
                        <button className="text-slate-400 hover:text-rose-500 text-xs font-medium transition-colors">
                            Xóa ảnh hiện tại
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400 block">Họ và tên</label>
                        <input type="text" defaultValue="Admin QLKTX" className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400 block">Địa chỉ Email</label>
                        <input type="email" defaultValue="admin@qlktx.com" className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400 block">Số điện thoại liên hệ</label>
                        <input type="tel" defaultValue="0987654321" className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400 block">Số CMND/CCCD</label>
                        <input type="text" defaultValue="036099123456" className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono" />
                    </div>
                    <div className="space-y-2 lg:col-span-2">
                        <label className="text-sm font-medium text-slate-400 block">Địa chỉ thường trú</label>
                        <input type="text" defaultValue="123 Đường Điện Biên Phủ, Phường 15, Bình Thạnh, TP.HCM" className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" />
                    </div>
                    <div className="space-y-2 lg:col-span-2">
                        <label className="text-sm font-medium text-slate-400 block">Thông tin ngân hàng nhận tiền</label>
                        <input type="text" defaultValue="Vietcombank - 1012345678 - NGUYEN VAN A" className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono" />
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-slate-800 flex justify-end">
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                    <Save size={18} /> Lưu thay đổi
                </button>
            </div>
        </div>
    );
}

function BusinessSettings() {
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div>
                <h2 className="text-lg font-semibold text-slate-100 mb-4">Thông tin Cơ sở quản lý</h2>
                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400 block">Tên hệ thống/Thương hiệu</label>
                        <input type="text" defaultValue="Hệ thống Căn hộ Dịch vụ QLKTX" className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400 block">Danh sách cơ sở</label>
                        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-3">
                            <div className="flex justify-between items-center p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                                <span className="text-slate-200">Cơ sở 1 - Quận 7</span>
                                <span className="text-emerald-500 text-xs font-medium px-2 py-1 bg-emerald-500/10 rounded-md">Hoạt động</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                                <span className="text-slate-200">Cơ sở 2 - Bình Thạnh</span>
                                <span className="text-emerald-500 text-xs font-medium px-2 py-1 bg-emerald-500/10 rounded-md">Hoạt động</span>
                            </div>
                            <button className="w-full py-2 flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-emerald-500 border border-dashed border-slate-700 hover:border-emerald-500 rounded-lg transition-colors">
                                + Thêm cơ sở mới
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-slate-800 flex justify-end">
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                    <Save size={18} /> Lưu thay đổi
                </button>
            </div>
        </div>
    );
}

function PricingSettings() {
    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            <div>
                <h2 className="text-lg font-semibold text-slate-100 mb-6">Cấu hình Đơn giá & Phí dịch vụ</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-slate-950 border border-slate-800 p-5 rounded-lg hover:border-slate-700 transition-colors">
                        <h3 className="text-slate-200 font-medium mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-md bg-amber-500/10 text-amber-500 flex items-center justify-center">⚡</span>
                            Giá Điện
                        </h3>
                        <div className="space-y-4">
                            <div className="relative">
                                <input type="number" defaultValue="3500" className="w-full bg-slate-900 border border-slate-800 text-emerald-400 font-semibold text-lg rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 transition-all text-right pr-28" />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium bg-slate-900 pl-2">VNĐ / kWh</span>
                            </div>
                            <p className="text-xs text-slate-500">Đơn giá áp dụng tự động khi chốt chỉ số điện hàng tháng.</p>
                        </div>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 p-5 rounded-lg hover:border-slate-700 transition-colors">
                        <h3 className="text-slate-200 font-medium mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-md bg-blue-500/10 text-blue-500 flex items-center justify-center">💧</span>
                            Giá Nước
                        </h3>
                        <div className="space-y-4">
                            <div className="relative">
                                <input type="number" defaultValue="20000" className="w-full bg-slate-900 border border-slate-800 text-emerald-400 font-semibold text-lg rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 transition-all text-right pr-28" />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium bg-slate-900 pl-2">VNĐ / Khối</span>
                            </div>
                            <p className="text-xs text-slate-500">Đơn giá áp dụng tự động khi chốt chỉ số nước hàng tháng.</p>
                        </div>
                    </div>
                </div>

                <h3 className="text-slate-200 font-medium mb-4">Các loại Phí dịch vụ mặc định khác</h3>
                <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-800 bg-slate-900/50 text-xs font-semibold text-slate-400 uppercase">
                        <div className="col-span-5">Tên phí / Dịch vụ</div>
                        <div className="col-span-4">Đơn giá định mức</div>
                        <div className="col-span-3 text-right">Đơn vị tính</div>
                    </div>

                    <div className="divide-y divide-slate-800/50 p-2">
                        <div className="grid grid-cols-12 gap-4 p-2 items-center hover:bg-slate-900/30 rounded-lg transition-colors">
                            <div className="col-span-5">
                                <input type="text" defaultValue="Rác thải sinh hoạt" className="w-full bg-transparent border border-transparent hover:border-slate-800 focus:border-emerald-500 text-slate-200 rounded px-2 py-1 outline-none transition-all" />
                            </div>
                            <div className="col-span-4">
                                <input type="text" defaultValue="30,000" className="w-full bg-transparent border border-transparent hover:border-slate-800 focus:border-emerald-500 text-emerald-400 font-medium rounded px-2 py-1 outline-none transition-all" />
                            </div>
                            <div className="col-span-3">
                                <select className="w-full bg-transparent border border-transparent hover:border-slate-800 focus:border-emerald-500 text-slate-400 text-sm rounded px-1 py-1 outline-none">
                                    <option>Phòng / Tháng</option>
                                    <option>Người / Tháng</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-12 gap-4 p-2 items-center hover:bg-slate-900/30 rounded-lg transition-colors">
                            <div className="col-span-5">
                                <input type="text" defaultValue="Internet / Wifi" className="w-full bg-transparent border border-transparent hover:border-slate-800 focus:border-emerald-500 text-slate-200 rounded px-2 py-1 outline-none transition-all" />
                            </div>
                            <div className="col-span-4">
                                <input type="text" defaultValue="100,000" className="w-full bg-transparent border border-transparent hover:border-slate-800 focus:border-emerald-500 text-emerald-400 font-medium rounded px-2 py-1 outline-none transition-all" />
                            </div>
                            <div className="col-span-3">
                                <select className="w-full bg-transparent border border-transparent hover:border-slate-800 focus:border-emerald-500 text-slate-400 text-sm rounded px-1 py-1 outline-none">
                                    <option>Phòng / Tháng</option>
                                    <option>Người / Tháng</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-12 gap-4 p-2 items-center hover:bg-slate-900/30 rounded-lg transition-colors">
                            <div className="col-span-5">
                                <input type="text" defaultValue="Giữ xe máy" className="w-full bg-transparent border border-transparent hover:border-slate-800 focus:border-emerald-500 text-slate-200 rounded px-2 py-1 outline-none transition-all" />
                            </div>
                            <div className="col-span-4">
                                <input type="text" defaultValue="120,000" className="w-full bg-transparent border border-transparent hover:border-slate-800 focus:border-emerald-500 text-emerald-400 font-medium rounded px-2 py-1 outline-none transition-all" />
                            </div>
                            <div className="col-span-3">
                                <select className="w-full bg-transparent border border-transparent hover:border-slate-800 focus:border-emerald-500 text-slate-400 text-sm rounded px-1 py-1 outline-none">
                                    <option>Chiếc / Tháng</option>
                                    <option>Phòng / Tháng</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="p-3 border-t border-slate-800 bg-slate-900/50">
                        <button className="text-sm text-emerald-500 hover:text-emerald-400 font-medium flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-slate-800">
                            + Thêm loại phí mới
                        </button>
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-slate-800 flex justify-end">
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/20">
                    <Save size={18} /> Lưu cấu hình giá
                </button>
            </div>
        </div>
    );
}

function NotificationSettings() {
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div>
                <h2 className="text-lg font-semibold text-slate-100 mb-6">Tùy chỉnh Thông báo</h2>
                <div className="space-y-4">
                    <ToggleItem title="Khách sắp hết hạn hợp đồng" desc="Nhận email trước 15 ngày khi hợp đồng sắp hết hạn" active={true} />
                    <ToggleItem title="Chậm thanh toán" desc="Gửi thông báo đẩy khi có phòng chậm đóng tiền quá 3 ngày" active={true} />
                    <ToggleItem title="Báo cáo tuần" desc="Nhận báo cáo tổng hợp doanh thu vào sáng Thứ 2 hàng tuần qua email" active={false} />
                    <ToggleItem title="Sự cố kỹ thuật" desc="Nhận thông báo ngay lập tức khi khách báo hỏng đồ/sự cố" active={true} />
                </div>
            </div>
        </div>
    );
}

function SecuritySettings() {
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div>
                <h2 className="text-lg font-semibold text-slate-100 mb-6">Bảo mật & Đăng nhập</h2>
                <div className="space-y-6">
                    <div className="bg-slate-950 border border-slate-800 rounded-lg p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h3 className="text-slate-200 font-medium mb-1">Xác thực 2 yếu tố (2FA)</h3>
                            <p className="text-slate-500 text-sm">Bảo vệ tài khoản bằng mã bảo mật qua ứng dụng Authenticator.</p>
                        </div>
                        <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                            Bật 2FA
                        </button>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-lg p-5">
                        <h3 className="text-slate-200 font-medium mb-4">Đổi mật khẩu</h3>
                        <div className="space-y-4">
                            <input type="password" placeholder="Mật khẩu hiện tại" className="w-full lg:w-96 block bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono" />
                            <input type="password" placeholder="Mật khẩu mới" className="w-full lg:w-96 block bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono" />
                            <input type="password" placeholder="Xác nhận mật khẩu mới" className="w-full lg:w-96 block bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono" />
                            <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border border-slate-700 mt-2">
                                Cập nhật mật khẩu
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PreferencesSettings() {
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div>
                <h2 className="text-lg font-semibold text-slate-100 mb-6">Giao diện & Tuỳ chỉnh</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-lg">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400">
                                <Moon size={20} />
                            </div>
                            <div>
                                <p className="text-slate-200 font-medium text-sm">Chế độ tối (Dark Mode)</p>
                                <p className="text-slate-500 text-xs">Phù hợp xem dữ liệu đêm, bảo vệ mắt (OLED Dark)</p>
                            </div>
                        </div>
                        <div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer">
                            <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-lg">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400">
                                <Monitor size={20} />
                            </div>
                            <div>
                                <p className="text-slate-200 font-medium text-sm">Ngôn ngữ</p>
                                <p className="text-slate-500 text-xs">Ngôn ngữ hiển thị của hệ thống</p>
                            </div>
                        </div>
                        <select className="bg-slate-800 border border-slate-700 text-sm text-slate-300 rounded-lg px-3 py-2 outline-none">
                            <option>Tiếng Việt</option>
                            <option>English</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Reusable Toggle switch component
function ToggleItem({ title, desc, active }: { title: string, desc: string, active: boolean }) {
    const [isOn, setIsOn] = useState(active);

    return (
        <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-lg cursor-pointer hover:border-slate-700 transition-colors" onClick={() => setIsOn(!isOn)}>
            <div>
                <p className="text-slate-200 font-medium text-sm">{title}</p>
                <p className="text-slate-500 text-xs mt-0.5">{desc}</p>
            </div>
            <div className={`w-11 h-6 rounded-full relative transition-colors duration-200 ease-in-out ${isOn ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out shadow-sm ${isOn ? 'translate-x-6 right-auto' : 'translate-x-1 left-0'}`} />
            </div>
        </div>
    );
}
