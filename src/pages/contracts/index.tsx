import { useState } from 'react';
import { Layout } from '../../components/layout';
import { Search, Filter, Plus, FileText, Download, MoreVertical, Edit2, Trash2, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { format, addMonths } from 'date-fns';

// Giả lập dữ liệu hợp đồng
const mockContracts = Array.from({ length: 15 }).map((_, i) => {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - Math.floor(Math.random() * 10));
    const durationMonths = i % 3 === 0 ? 6 : 12;
    const endDate = addMonths(startDate, durationMonths);

    // Tạo trạng thái logic dựa trên ngày
    let status = 'Đang hiệu lực';
    const now = new Date();
    const timeUntilEnd = endDate.getTime() - now.getTime();
    const daysUntilEnd = timeUntilEnd / (1000 * 3600 * 24);

    if (daysUntilEnd < 0) {
        status = 'Đã thanh lý';
    } else if (daysUntilEnd < 30) {
        status = 'Sắp hết hạn';
    } else if (i % 10 === 0) {
        status = 'Chờ ký';
    }

    return {
        id: `HD${(i + 1).toString().padStart(4, '0')}`,
        tenantName: `Nguyễn ${['Văn', 'Thị', 'Hoàng', 'Minh'][i % 4]} ${['A', 'B', 'C', 'Linh', 'Hùng'][i % 5]}`,
        room: `P${101 + Math.floor(i / 2)}`,
        startDate: startDate,
        endDate: endDate,
        deposit: (i % 3 === 0 ? 5500000 : (i % 2 === 0 ? 4500000 : 3500000)),
        status: status,
        createdBy: 'Admin',
    };
});

export default function Contracts() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <Layout>
            {/* Header Section */}
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100 mb-1">Quản lý Hợp đồng</h1>
                    <p className="text-slate-400 text-sm">Theo dõi lưu trữ và trạng thái của các hợp đồng thuê phòng.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700 flex items-center gap-2">
                        <Download size={18} /> Xuất dữ liệu
                    </button>
                    <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                        <Plus size={18} /> Tạo hợp đồng mới
                    </button>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/50">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm theo mã HĐ, người thuê, phòng..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 text-sm text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-500 font-mono"
                        />
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <select className="bg-slate-950 border border-slate-700 text-sm text-slate-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500 cursor-pointer outline-none">
                            <option>Tất cả trạng thái</option>
                            <option>Đang hiệu lực</option>
                            <option>Sắp hết hạn</option>
                            <option>Đã thanh lý</option>
                            <option>Chờ ký</option>
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
                                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Mã Hợp Đồng</th>
                                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Người Thuê</th>
                                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Phòng</th>
                                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Thời Hạn</th>
                                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Tiền Cọc</th>
                                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Trạng Thái</th>
                                <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-right">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {mockContracts.map((contract) => (
                                <tr key={contract.id} className="hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-800 rounded-lg text-slate-400 group-hover:text-emerald-500 group-hover:bg-emerald-500/10 transition-colors">
                                                <FileText size={16} />
                                            </div>
                                            <span className="font-mono text-slate-200 font-medium">{contract.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-200">{contract.tenantName}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                                            {contract.room}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1 text-xs">
                                            <div className="text-slate-300">Từ: {format(contract.startDate, 'dd/MM/yyyy')}</div>
                                            <div className="text-slate-500">Đến: {format(contract.endDate, 'dd/MM/yyyy')}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-emerald-400">
                                        {new Intl.NumberFormat('vi-VN').format(contract.deposit)}đ
                                    </td>
                                    <td className="px-6 py-4">
                                        <ContractStatusBadge status={contract.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {contract.status === 'Chờ ký' && (
                                                <button className="p-1.5 text-slate-400 hover:text-emerald-500 transition-colors rounded-md hover:bg-slate-800" title="Duyệt / Ký">
                                                    <CheckCircle2 size={16} />
                                                </button>
                                            )}
                                            <button className="p-1.5 text-slate-400 hover:text-blue-500 transition-colors rounded-md hover:bg-slate-800" title="Xem / Sửa">
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors rounded-md hover:bg-slate-800" title="Hủy / Thanh lý">
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
                    <div>Hiển thị <span className="text-slate-200 font-medium">1</span> đến <span className="text-slate-200 font-medium">10</span> trong <span className="text-slate-200 font-medium">15</span> hợp đồng</div>
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

function ContractStatusBadge({ status }: { status: string }) {
    let styles = '';
    switch (status) {
        case 'Đang hiệu lực':
            styles = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            break;
        case 'Sắp hết hạn':
            styles = 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            break;
        case 'Chờ ký':
            styles = 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            break;
        case 'Đã thanh lý':
            styles = 'bg-slate-800 text-slate-400 border-slate-700';
            break;
        default:
            styles = 'bg-slate-800 text-slate-400 border-slate-700';
    }

    return (
        <span className={`inline-flex px-2.5 py-1.5 rounded-md text-xs font-medium border ${styles}`}>
            {status}
        </span>
    );
}
