import React, { useState } from 'react';
import { Layout } from '../../components/layout';
import { Search, Filter, Plus, UserPlus, MoreVertical, Edit2, Trash2, Mail, Phone, FileText } from 'lucide-react';
import { format } from 'date-fns';

// Giả lập dữ liệu người thuê
const mockTenants = Array.from({ length: 15 }).map((_, i) => {
  const joinDate = new Date();
  joinDate.setMonth(joinDate.getMonth() - Math.floor(Math.random() * 12));

  return {
    id: `NT${(i + 1).toString().padStart(3, '0')}`,
    name: `Nguyễn ${['Văn', 'Thị', 'Hoàng', 'Minh'][i % 4]} ${['A', 'B', 'C', 'Linh', 'Hùng'][i % 5]}`,
    phone: `098${Math.floor(1000000 + Math.random() * 9000000)}`,
    email: `khachthue${i + 1}@example.com`,
    room: `P${101 + Math.floor(i / 2)}`,
    status: i % 8 === 0 ? 'Sắp hết hạn' : (i % 12 === 0 ? 'Đã rời đi' : 'Đang thuê'),
    joinDate: joinDate,
  };
});

export default function Tenants() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Layout>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 mb-1">Quản lý người thuê</h1>
          <p className="text-slate-400 text-sm">Tra cứu và quản lý thông tin khách hàng đang thuê phòng.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700">
            Xuất Excel
          </button>
          <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <UserPlus size={18} /> Thêm người thuê
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Tìm theo tên, SĐT, mã người thuê..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-sm text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-500 font-mono"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <select className="bg-slate-950 border border-slate-700 text-sm text-slate-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500 cursor-pointer outline-none">
              <option>Tất cả trạng thái</option>
              <option>Đang thuê</option>
              <option>Sắp hết hạn</option>
              <option>Đã rời đi</option>
            </select>
            <button className="flex items-center gap-2 text-slate-400 hover:text-white px-3 py-2 rounded-lg text-sm transition-colors border border-slate-700 hover:bg-slate-800 whitespace-nowrap">
              <Filter size={16} /> Lọc
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="text-xs text-slate-500 uppercase bg-slate-950 border-b border-slate-800">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Mã KH</th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Họ & Tên</th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Liên hệ</th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Phòng</th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Ngày hợp đồng</th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Trạng thái</th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {mockTenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4 font-mono text-emerald-500">
                    {tenant.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-200">{tenant.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Phone size={14} className="text-slate-500" /> {tenant.phone}
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <Mail size={14} /> {tenant.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      {tenant.room}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {format(tenant.joinDate, 'dd/MM/yyyy')}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={tenant.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-slate-400 hover:text-emerald-500 transition-colors rounded-md hover:bg-slate-800" title="Chi tiết hợp đồng">
                        <FileText size={16} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-blue-500 transition-colors rounded-md hover:bg-slate-800" title="Chỉnh sửa">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors rounded-md hover:bg-slate-800" title="Xóa">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Setup */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-sm text-slate-400 bg-slate-900/50">
          <div>Hiển thị <span className="text-slate-200 font-medium">1</span> đến <span className="text-slate-200 font-medium">10</span> trong <span className="text-slate-200 font-medium">15</span> kết quả</div>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 border border-slate-700 rounded-md hover:bg-slate-800 transition-colors disabled:opacity-50">Trước</button>
            <button className="px-3 py-1 border border-emerald-500 bg-emerald-500/10 text-emerald-500 rounded-md">1</button>
            <button className="px-3 py-1 border border-transparent hover:bg-slate-800 rounded-md transition-colors">2</button>
            <button className="px-3 py-1 border border-slate-700 rounded-md hover:bg-slate-800 transition-colors disabled:opacity-50">Sau</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function StatusBadge({ status }: { status: string }) {
  let styles = '';
  switch (status) {
    case 'Đang thuê':
      styles = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      break;
    case 'Sắp hết hạn':
      styles = 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      break;
    case 'Đã rời đi':
      styles = 'bg-slate-800 text-slate-400 border-slate-700';
      break;
    default:
      styles = 'bg-slate-800 text-slate-400 border-slate-700';
  }

  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${styles}`}>
      {status}
    </span>
  );
}
