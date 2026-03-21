import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '../../components/layout';
import { Search, Plus, Edit, Settings2, Building2 } from 'lucide-react';
import { meterService } from '../../services/meter';
import { buildingService } from '../../services/building';
import ServiceModal from './components/ServiceModal';
import BuildingServiceModal from './components/BuildingServiceModal';
import { getServiceIcon } from '../../utils/iconHelper';

export default function Services() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<any | null>(null);
    const [activeTab, setActiveTab] = useState<'ALL' | 'BUILDING_SPECIFIC'>('ALL');

    const [selectedBuildingId, setSelectedBuildingId] = useState<number | ''>('');
    const [isBuildingModalOpen, setIsBuildingModalOpen] = useState(false);
    const [selectedBuildingService, setSelectedBuildingService] = useState<any | null>(null);
    const [currentConfiguredPrice, setCurrentConfiguredPrice] = useState<number | null>(null);

    // Fetch Global Services
    const { data: servicesData, isLoading: isServicesLoading } = useQuery({
        queryKey: ['services'],
        queryFn: () => meterService.getAllServices()
    });
    const services = servicesData?.result || [];

    // Fetch Buildings for combobox
    const { data: buildingsData } = useQuery({
        queryKey: ['buildings'],
        queryFn: () => buildingService.getBuildings()
    });
    const buildings = buildingsData?.result || [];

    // Auto-select first building if available
    if (buildings.length > 0 && selectedBuildingId === '') {
        setSelectedBuildingId(buildings[0].buildingId);
    }

    // Fetch Specific Prices for selected building
    const { data: buildingServicesData } = useQuery({
        queryKey: ['building-services', selectedBuildingId],
        queryFn: () => meterService.getBuildingServices(selectedBuildingId as number),
        enabled: !!selectedBuildingId && activeTab === 'BUILDING_SPECIFIC'
    });
    const configuredBuildingServices = buildingServicesData?.result || [];

    // Filters for global search
    const filteredServices = services.filter((s: any) => 
        s.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateGlobal = () => {
        setSelectedService(null);
        setIsModalOpen(true);
    };

    const handleEditGlobal = (service: any) => {
        setSelectedService(service);
        setIsModalOpen(true);
    };

    const handleConfigurePrice = (serviceInfo: any, currentPrice: number | null) => {
        setSelectedBuildingService(serviceInfo);
        setCurrentConfiguredPrice(currentPrice);
        setIsBuildingModalOpen(true);
    };

    return (
        <Layout>
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100 mb-1">Cấu hình Dịch vụ & Đơn giá</h1>
                    <p className="text-slate-400 text-sm">Quản lý danh mục chung và thiết lập giá linh hoạt cho từng Tòa nhà.</p>
                </div>
                {activeTab === 'ALL' && (
                    <button 
                        onClick={handleCreateGlobal}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                        <Plus size={18} /> Thêm Dịch vụ
                    </button>
                )}
            </div>

            {/* Tabs & Search */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 w-full md:w-auto">
                    <button 
                        onClick={() => setActiveTab('ALL')}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'ALL' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>
                        Bảng danh mục Chung
                    </button>
                    <button 
                        onClick={() => setActiveTab('BUILDING_SPECIFIC')}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 justify-center ${activeTab === 'BUILDING_SPECIFIC' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>
                        <Building2 size={16} /> Áp giá theo Tòa
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
                    {filteredServices.map((service: any) => (
                        <div key={service.serviceId} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors group relative overflow-hidden">
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700">
                                        {getServiceIcon(service.icon, 20, "text-emerald-400")}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-100">{service.serviceName}</h3>
                                        <div className="flex gap-2 items-center mt-1">
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                                                / {service.unit}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="my-4 relative z-10 bg-slate-800/50 p-3 rounded-lg border border-slate-800/80">
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Phương thức tính</p>
                                <p className="text-sm text-slate-300 font-medium">{service.calculationMethod || 'Chưa thiết lập'}</p>
                            </div>
                            
                            <div className="flex gap-2 pt-4 border-t border-slate-800 relative z-10">
                                <button 
                                    onClick={() => handleEditGlobal(service)}
                                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg py-2 text-sm font-medium transition-colors border border-slate-700 flex justify-center items-center gap-2">
                                    <Edit size={16} /> Chỉnh sửa
                                </button>
                            </div>

                            {/* Decorative background icon */}
                            <div className="absolute -bottom-6 -right-6 opacity-[0.03] scale-150 pointer-events-none grayscale">
                                {getServiceIcon(service.icon, 80)}
                            </div>
                        </div>
                    ))}
                    {!isServicesLoading && filteredServices.length === 0 && (
                        <div className="col-span-1 md:col-span-2 xl:col-span-3 text-center py-12 text-slate-500 border border-slate-800 border-dashed rounded-xl">
                            Không tìm thấy dịch vụ nào!
                        </div>
                    )}
                </div>
            )}

            {/* Tab: BUILDING_SPECIFIC */}
            {activeTab === 'BUILDING_SPECIFIC' && (
                <div>
                     <div className="flex items-center gap-4 mb-6">
                        <label className="text-sm font-bold text-slate-300">Chọn Cơ sở / Tòa nhà:</label>
                        <select 
                            value={String(selectedBuildingId)}
                            onChange={(e) => setSelectedBuildingId(e.target.value ? Number(e.target.value) : '')}
                            className="bg-slate-900 border border-slate-700 hover:border-emerald-500/50 text-slate-200 px-4 py-2.5 rounded-xl text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-500/50 min-w-[250px] font-medium shadow-lg">
                            {buildings.map((b: any) => (
                                <option key={b.buildingId} value={b.buildingId}>{b.buildingName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                         <table className="w-full text-left text-sm text-slate-400 border-collapse">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-950/50 border-b border-slate-800">
                                <tr>
                                    <th className="px-6 py-4 font-semibold w-12 text-center">STT</th>
                                    <th className="px-6 py-4 font-semibold">Tên dịch vụ</th>
                                    <th className="px-6 py-4 font-semibold">Đơn vị</th>
                                    <th className="px-6 py-4 font-semibold text-right">Đơn giá áp dụng (VNĐ)</th>
                                    <th className="px-6 py-4 font-semibold text-right w-32">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredServices.map((service: any, index: number) => {
                                    // Tìm xem dịch vụ này đã được cấu hình giá ở Tòa nhà hiện tại chưa
                                    const configuredInfo = configuredBuildingServices.find((bs: any) => bs.serviceId === service.serviceId);
                                    const hasPrice = !!configuredInfo;
                                    
                                    return (
                                        <tr key={service.serviceId} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4 text-center text-slate-600">{index + 1}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-slate-950 flex justify-center items-center border border-slate-800">
                                                        {getServiceIcon(service.icon, 16)}
                                                    </div>
                                                    <span className="font-bold text-slate-200">{service.serviceName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">/{service.unit}</td>
                                            <td className="px-6 py-4 text-right">
                                                {hasPrice ? (
                                                    <span className="font-mono text-emerald-400 font-bold text-lg bg-emerald-500/10 px-3 py-1 rounded inline-block">
                                                        {configuredInfo.unitPrice.toLocaleString()} ₫
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-500 italic px-3 py-1 bg-slate-800/50 rounded inline-block">
                                                        Chưa cấu hình
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => handleConfigurePrice(service, configuredInfo ? configuredInfo.unitPrice : null)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border flex items-center justify-center gap-2 inline-flex w-full ${
                                                        hasPrice 
                                                            ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                                                            : 'bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-500'
                                                    }`}
                                                >
                                                    <Settings2 size={14} /> {hasPrice ? 'Sửa giá' : 'Áp giá ngay'}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filteredServices.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center py-8 text-slate-500">
                                            Không có dữ liệu
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <ServiceModal 
                    service={selectedService} 
                    onClose={() => setIsModalOpen(false)} 
                />
            )}

            {isBuildingModalOpen && selectedBuildingService && (
                <BuildingServiceModal 
                    buildingId={selectedBuildingId as number}
                    serviceInfo={selectedBuildingService}
                    currentPrice={currentConfiguredPrice}
                    onClose={() => setIsBuildingModalOpen(false)} 
                />
            )}
        </Layout>
    );
}
