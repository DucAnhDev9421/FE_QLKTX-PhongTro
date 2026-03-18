import { useState } from 'react';
import { Layout } from '../../components/layout';
import { Search, Plus, Edit, Trash2, Settings2, Zap, Droplets, Wifi, Trash } from 'lucide-react';
import { Service } from '../../types/service';
import ServiceModal from './components/ServiceModal';

const mockServices: Service[] = [
    { id: 'SVC-001', name: 'Điện sinh hoạt', unit: 'kWh', basePrice: 3500, type: 'METERED', status: 'ACTIVE', description: 'Tính theo chỉ số đồng hồ' },
    { id: 'SVC-002', name: 'Nước sinh hoạt', unit: 'm³', basePrice: 20000, type: 'METERED', status: 'ACTIVE', description: 'Tính theo chỉ số đồng hồ' },
    { id: 'SVC-003', name: 'Internet (Wifi)', unit: 'Phòng/Tháng', basePrice: 100000, type: 'FIXED', status: 'ACTIVE', description: 'Gói cáp quang tốc độ cao' },
    { id: 'SVC-004', name: 'Rác thải', unit: 'Người/Tháng', basePrice: 30000, type: 'FIXED', status: 'ACTIVE' },
    { id: 'SVC-005', name: 'Giữ xe máy', unit: 'Chiếc/Tháng', basePrice: 120000, type: 'FIXED', status: 'INACTIVE' },
];

export default function Services() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [activeTab, setActiveTab] = useState<'ALL' | 'BUILDING_SPECIFIC'>('ALL');

    const handleCreate = () => {
        setSelectedService(null);
        setIsModalOpen(true);
    };

    const handleEdit = (service: Service) => {
        setSelectedService(service);
        setIsModalOpen(true);
    };

    const getIcon = (name: string) => {
        const lower = name.toLowerCase();
        if (lower.includes('điện')) return <Zap size={20} className="text-amber-500" />;
        if (lower.includes('nước')) return <Droplets size={20} className="text-blue-500" />;
        if (lower.includes('wifi') || lower.includes('internet')) return <Wifi size={20} className="text-emerald-500" />;
        if (lower.includes('rác')) return <Trash size={20} className="text-slate-500" />;
        return <Settings2 size={20} className="text-indigo-500" />;
    };

    return (
        <Layout>
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100 mb-1">Thiết lập Dịch vụ</h1>
                    <p className="text-slate-400 text-sm">Quản lý danh mục định mức và đơn giá các dịch vụ thu phí.</p>
                </div>
                <button 
                    onClick={handleCreate}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                    <Plus size={18} /> Thêm Dịch vụ
                </button>
            </div>

            {/* Tabs & Search */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 w-full md:w-auto">
                    <button 
                        onClick={() => setActiveTab('ALL')}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'ALL' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>
                        Bảng giá chung
                    </button>
                    <button 
                        onClick={() => setActiveTab('BUILDING_SPECIFIC')}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'BUILDING_SPECIFIC' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>
                        Cấu hình riêng theo Tòa nhà
                    </button>
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm dịch vụ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                    />
                </div>
            </div>

            {/* Services Grid (Tab: ALL) */}
            {activeTab === 'ALL' && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {mockServices.map((service) => (
                        <div key={service.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors group relative overflow-hidden">
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700">
                                        {getIcon(service.name)}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-100">{service.name}</h3>
                                        <div className="flex gap-2 items-center mt-1">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                                service.type === 'METERED' 
                                                ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' 
                                                : 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                                            }`}>
                                                {service.type === 'METERED' ? 'Theo đồng hồ' : 'Cố định'}
                                            </span>
                                            {service.status === 'INACTIVE' && (
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-slate-500/10 text-slate-400 border border-slate-500/20">
                                                    Ngừng cung cấp
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-baseline gap-1 my-4 relative z-10">
                                <span className="text-3xl font-bold font-mono text-emerald-400">
                                    {service.basePrice.toLocaleString()}đ
                                </span>
                                <span className="text-slate-500">/{service.unit}</span>
                            </div>
                            
                            <p className="text-sm text-slate-400 mb-6 h-10 line-clamp-2 relative z-10">{service.description || 'Chưa có mô tả chi tiết.'}</p>
                            
                            <div className="flex gap-2 pt-4 border-t border-slate-800 relative z-10">
                                <button 
                                    onClick={() => handleEdit(service)}
                                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg py-2 text-sm font-medium transition-colors border border-slate-700 flex justify-center items-center gap-2">
                                    <Edit size={16} /> Chỉnh sửa
                                </button>
                                <button className="w-10 flex-shrink-0 bg-slate-800 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 text-slate-400 rounded-lg flex justify-center items-center transition-colors border border-slate-700">
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {/* Decorative background icon */}
                            <div className="absolute -bottom-6 -right-6 opacity-[0.03] scale-150 pointer-events-none grayscale">
                                {getIcon(service.name)}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Tab: BUILDING_SPECIFIC */}
            {activeTab === 'BUILDING_SPECIFIC' && (
                <div className="flex flex-col items-center justify-center p-12 bg-slate-900 border border-slate-800 border-dashed rounded-xl">
                    <Settings2 size={48} className="text-slate-600 mb-4" />
                    <h3 className="text-lg font-medium text-slate-200 mb-2">Chưa có ngoại lệ nào</h3>
                    <p className="text-slate-400 text-sm text-center max-w-md">
                        Mọi Tòa nhà hiện đều đang sử dụng Bảng giá chung. Chọn Thêm để thiết lập giá Dịch vụ ưu đãi hoặc phụ thu cho một Tòa nhà cụ thể.
                    </p>
                    <button className="mt-6 font-medium text-emerald-500 hover:text-emerald-400 pb-1 border-b border-emerald-500/30 hover:border-emerald-400 transition-colors">
                        Thiết lập báo giá riêng
                    </button>
                </div>
            )}

            {isModalOpen && (
                <ServiceModal 
                    service={selectedService} 
                    onClose={() => setIsModalOpen(false)} 
                />
            )}
        </Layout>
    );
}
