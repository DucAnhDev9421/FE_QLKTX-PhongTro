import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Layout } from '../../components/layout';
import { Search, Plus, UserPlus, Edit2, Mail, Phone, FileText, Download, User as UserIcon, Loader2, MapPin } from 'lucide-react';
import { tenantService } from '../../services/tenant';
import TenantModal from './components/TenantModal';

export default function Tenants() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<any | null>(null);

  const { data: responseData, isLoading } = useQuery({
    queryKey: ['tenants', searchTerm],
    queryFn: () => tenantService.getTenants(searchTerm || undefined)
  });

  const tenants = responseData?.result || [];

  const handleExport = async () => {
    try {
      await tenantService.exportPolice();
    } catch (e) {
      console.error("Lỗi xuất excel: ", e);
      alert("Bạn không có quyền xuất danh sách hoặc hệ thống đang lỗi!");
    }
  };

  const handleCreate = () => {
    setSelectedTenant(null);
    setIsModalOpen(true);
  };

  const handleEdit = (tenant: any) => {
    setSelectedTenant(tenant);
    setIsModalOpen(true);
  };

  return (
    <Layout>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 mb-1">Quản lý người thuê</h1>
          <p className="text-slate-400 text-sm">Tra cứu và quản lý thông tin khách hàng đang thuê phòng.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExport}
            className="bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-emerald-500/30 hover:border-emerald-500/50 flex items-center gap-2"
          >
            <Download size={16} /> Xuất Excel
          </button>
          <button 
            onClick={handleCreate}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            <UserPlus size={18} /> Thêm người thuê
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/50 shrink-0">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Tìm theo tên, SĐT, CCCD..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-sm text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-500 font-mono"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="text-xs text-slate-500 uppercase bg-slate-950 border-b border-slate-800">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Họ & Tên</th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Thông tin liên hệ</th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Định danh (CCCD)</th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <Loader2 size={32} className="animate-spin text-emerald-500 mx-auto" />
                  </td>
                </tr>
              ) : tenants.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-slate-500">
                    <UserIcon size={48} className="mx-auto mb-4 opacity-20" />
                    Không tìm thấy dữ liệu người thuê nào.
                  </td>
                </tr>
              ) : (
                tenants.map((tenant: any) => (
                  <tr key={tenant.tenantId} className="hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-200">{tenant.fullName}</div>
                      {tenant.hometown && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                          <MapPin size={12} /> {tenant.hometown}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-slate-300 font-mono text-xs font-semibold">
                          <Phone size={14} className="text-emerald-500" /> {tenant.phoneNumber}
                        </div>
                        {tenant.email && (
                          <div className="flex items-center gap-2 text-slate-500 text-xs">
                            <Mail size={14} /> {tenant.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-bold font-mono bg-slate-800 text-slate-300 border border-slate-700">
                        {tenant.identityCardNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-slate-400 hover:text-blue-500 transition-colors rounded-md hover:bg-slate-800" title="Ký Hợp đồng">
                          <FileText size={16} />
                        </button>
                        <button 
                          onClick={() => handleEdit(tenant)}
                          className="p-1.5 text-slate-400 hover:text-emerald-500 transition-colors rounded-md hover:bg-slate-800" title="Chỉnh sửa">
                          <Edit2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <TenantModal 
          tenant={selectedTenant}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </Layout>
  );
}
