import { useState } from 'react';
import { Layout } from '../../components/layout';
import { Bell, Wallet, Building, Globe, Save, Moon, Monitor, QrCode } from 'lucide-react';

const TABS = [
    { id: 'business', label: 'Cơ sở & Hệ thống', icon: <Building size={18} /> },
    { id: 'payment', label: 'Cấu hình Thanh toán', icon: <Wallet size={18} /> },
    { id: 'notifications', label: 'Thông báo', icon: <Bell size={18} /> },
    { id: 'preferences', label: 'Tùy chỉnh hệ thống', icon: <Globe size={18} /> },
];

export default function Settings() {
    const [activeTab, setActiveTab] = useState('business');

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
                        {TABS.map((tab) => (
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
